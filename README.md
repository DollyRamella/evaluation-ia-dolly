# Évaluer à l’ère de l’IA — questionnaire et administration

Version livrée le 15 octobre 2026. Adaptation du questionnaire de Pascal Brassier (Quartiers du numérique 2026). Les formulations et restitutions sont adaptées. Cette typologie n’a pas de validation psychométrique et ne mesure pas un niveau de compétence.


## Architecture

| Élément | Version déjà hébergée | Hébergement indépendant |
| --- | --- | --- |
| Interface publique | Site public actuel | GitHub Pages, dossier `docs/` |
| API | Routes Sites/Vinext dans `app/api/` | Cloudflare Worker, `worker.mjs` |
| Base privée | D1 provisionnée par Sites | D1 dans votre compte Cloudflare |
| Authentification administrateur | Identité ChatGPT + adresse propriétaire autorisée côté serveur | Clé aléatoire de 32 octets, empreinte SHA-256 configurée dans les secrets Cloudflare |
| Participants | Aucun compte | Aucun compte |

Le code de l’API (`server/api.mjs`) et les questions (`public/questions.mjs`) sont partagés entre les deux modes. **GitHub Pages seul ne peut pas stocker les participations : il héberge uniquement l’interface statique.**

## Option A — Publier seulement l’interface sur GitHub Pages (le plus simple)

L’archive contient déjà un dossier `docs/` configuré pour joindre l’API du site actuel. Aucun compte Cloudflare supplémentaire n’est nécessaire pour cette option. Les nouvelles réponses seront visibles dans l’administration du site actuel. Cette option reste dépendante de la disponibilité de ce site et de son API.

1. Décompressez l’archive sur votre ordinateur.
2. Sur GitHub, cliquez sur **New repository**. Choisissez un nom, par exemple `evaluation-ia`, et un dépôt **Public** si vous utilisez GitHub Free.
3. Cliquez sur **Add file → Upload files**. Déposez les fichiers du projet, en conservant leur structure. Pour une première publication simple, le dossier `docs/` suffit ; pour versionner tout le code, utilisez Git ou GitHub Desktop. Le contenu de l’archive doit se retrouver à la racine du dépôt, pas dans un sous-dossier supplémentaire.
4. Validez avec **Commit changes**.
5. Ouvrez **Settings → Pages**.
6. Choisissez **Deploy from a branch**, branche **main**, dossier **/docs**, puis **Save**.
7. Attendez que GitHub affiche le lien publié. Il a généralement la forme `https://VOTRE-COMPTE.github.io/NOM-DU-DEPOT/` ; utilisez le lien réellement affiché.
8. Ouvrez ce lien dans une fenêtre privée : aucun compte ne doit être demandé pour répondre.
9. Envoyez une participation de vérification avec la session `VERIFICATION`, puis retrouvez-la dans l’administration hébergée. Placez-la ensuite dans la corbeille.

Le lien **Administration** de l’interface GitHub renvoie au site actuel : utilisez votre compte propriétaire. La page statique `admin.html` ne contient aucune donnée privée et n’accorde aucun accès à elle seule.

Pour régénérer `docs/` après une modification, avec Node.js 22.13 ou supérieur :

```sh
node scripts/prepare-github.mjs
```

## Option B — Héberger aussi votre propre API Cloudflare

Cette option nécessite un compte GitHub et un compte Cloudflare. Le code est fourni, mais aucune ressource n’a été créée dans votre compte Cloudflare personnel. N’activez pas de forfait payant pour suivre ces étapes si vous souhaitez rester dans l’offre gratuite.

### 1. Préparer les outils

Installez Node.js 22.13 ou supérieur depuis son site officiel. Dans un terminal, placez-vous dans le dossier décompressé. Les commandes suivantes utilisent la version de Wrangler livrée avec ce projet :

```sh
npx --yes wrangler@4.92.0 login
npx --yes wrangler@4.92.0 d1 create evaluation-ia
```

Copiez l’identifiant de base renvoyé par Cloudflare dans `wrangler.jsonc`, à la place de `REMPLACER_PAR_ID_D1`. Ce n’est pas une clé secrète.

### 2. Créer les tables

```sh
npx --yes wrangler@4.92.0 d1 migrations apply evaluation-ia --remote --config wrangler.jsonc
```

Les migrations du dossier `drizzle/` définissent la table privée. N’exposez pas la base via une API publique supplémentaire.

### 3. Créer votre accès administrateur

```sh
node scripts/generate-admin-key.mjs
```

Ce script affiche **une clé** et **son empreinte SHA-256**. Conservez la clé dans votre gestionnaire de mots de passe. Ne l’ajoutez jamais à GitHub, au code, à un document partagé ou à une conversation. Puis exécutez :

```sh
npx --yes wrangler@4.92.0 secret put ADMIN_TOKEN_SHA256 --config wrangler.jsonc
```

À l’invite, saisissez **l’empreinte**, pas la clé. Ce secret est utilisé côté serveur. Pour révoquer une ancienne clé, générez-en une nouvelle et remplacez l’empreinte dans Cloudflare.

### 4. Déployer l’API

```sh
npx --yes wrangler@4.92.0 deploy --config wrangler.jsonc
```

Copiez l’URL HTTPS réellement renvoyée par Cloudflare. Remplacez l’URL d’exemple ci-dessous par celle de votre Worker :

```sh
node scripts/prepare-github.mjs https://VOTRE-WORKER.VOTRE-SOUS-DOMAINE.workers.dev
```

Publiez ensuite `docs/` sur GitHub Pages comme dans l’option A. Le fichier `docs/config.mjs` contient uniquement l’adresse publique de l’API, aucun secret.

### 5. Ouvrir votre administration indépendante

Depuis votre interface GitHub Pages, cliquez sur **Administration**. Saisissez la clé créée à l’étape 3. Elle reste dans la mémoire de l’onglet et doit être ressaisie après fermeture ou actualisation. Cliquez sur **Déconnexion** lorsque vous avez terminé. La connexion entre le navigateur et l’API utilise HTTPS. Cette clé donne tous les droits administrateur : ne la partagez pas.

Les données de votre nouvelle API ne seront pas celles du site Sites : ce sont deux bases distinctes. L’export CSV permet de conserver vos résultats, mais cette version ne propose pas de migration automatique entre bases.

## Modifier le questionnaire et les sessions

- Les questions, choix, profils et pistes de restitution se trouvent dans `public/questions.mjs`.
- Chaque choix est `[indice_de_posture, texte]`. Les indices sont : 0 Gardien, 1 Régulateur, 2 Architecte, 3 Copilote, 4 Enquêteur.
- Conservez dix questions et cinq options par question, avec une option par posture. Le serveur attribue un point à la posture choisie.
- Changez `VERSION` si le sens d’une question, d’un choix ou le calcul change. Mettez à jour l’API et l’interface ensemble. Les anciens envois restent lisibles car le texte des questions et réponses est conservé dans chaque participation.
- Les statistiques par question utilisent les positions des choix du questionnaire courant. Si vous changez ces positions ou le contenu, utilisez une session distincte et filtrez cette session pour éviter de mélanger des versions incompatibles.
- Modifiez les couleurs et les dimensions dans `public/style.css`.
- Après chaque modification, exécutez `node scripts/prepare-github.mjs` avec l’URL de l’API choisie, puis publiez à nouveau le dossier `docs/`. Si les questions changent, redéployez aussi l’API.
- Une session ne nécessite pas de création de table : renseignez son nom sur l’accueil ou générez son lien depuis l’administration.

## Données, accès et conservation

Chaque envoi contient un UUID aléatoire, une date serveur UTC, la session facultative, la version, les dix choix et leurs textes, les cinq scores et les dominantes. Aucun champ nom/courriel et aucune adresse IP ne sont stockés dans la table des participations. L’hébergement peut traiter ses propres données techniques de connexion.

Les réponses avant envoi restent en mémoire de la page ; elles sont perdues en cas d’actualisation. La réflexion libre sur l’écran de résultat n’est pas transmise. Les participations répétées sont autorisées ; un même identifiant de réessai ne crée pas de doublon. L’absence d’identification ne permet pas de garantir une participation unique par personne.

Les réponses détaillées, statistiques et exports nécessitent une autorisation côté serveur. L’API publique accepte les participations, mais n’offre aucune lecture individuelle des données enregistrées. Les accès CORS publics servent à joindre l’API depuis GitHub Pages ; ils ne remplacent jamais l’authentification de l’administration. Un service public peut recevoir des réponses indésirables : surveillez les volumes et les quotas ; aucun CAPTCHA ni limite de débit globale n’est livré dans cette version.

La suppression depuis l’interface est **réversible** : la ligne reste dans la corbeille, sans contribuer aux résultats actifs. Aucune purge automatique n’est activée. Définissez la durée de conservation et les modalités de contact adaptées à votre formation avant une collecte à grande échelle. Pour la base indépendante, un effacement définitif peut être réalisé par la propriétaire dans la console D1 après sauvegarde et vérification des lignes concernées ; il ne se fait pas depuis l’interface.

## Coûts et quotas vérifiés le 15 octobre 2026

Ces chiffres concernent **l’hébergement indépendant**, pas une garantie tarifaire de Sites.

| Service | Offre gratuite vérifiée | Limites pertinentes |
| --- | --- | --- |
| GitHub Pages | Disponible avec GitHub Free pour les dépôts publics | Site publié ≤ 1 Go ; limite souple de bande passante 100 Go/mois |
| Cloudflare Workers Free | 100 000 requêtes par jour, partagées entre les Workers du compte | Temps CPU de 10 ms par requête ; dépassement des limites de l’offre gratuite susceptible d’interrompre le service |
| Cloudflare D1 Free | 5 millions de lignes lues/jour, 100 000 lignes écrites/jour, 5 Go de stockage total | Les index et les requêtes de statistiques consomment aussi des quotas ; une requête n’équivaut pas à une seule ligne lue |

Pour un usage restant dans ces quotas et sous les conditions des offres gratuites, le coût d’hébergement peut être de 0 €. Ce n’est pas une garantie de disponibilité ni de gratuité future. Le domaine personnalisé est facultatif et n’est pas inclus dans cette estimation. Aucun abonnement payant n’a été souscrit.

Sources officielles :
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/d1/platform/pricing/

## Vérification

Avec Node.js 22.13 ou supérieur :

```sh
node --test tests/*.test.mjs
```

Les tests utilisent SQLite en mémoire avec les migrations réellement livrées et exécutent l’API du projet. Ils vérifient les scores, les égalités, l’envoi public, le stockage, les réponses détaillées, les filtres, les statistiques, la pagination, l’export CSV, la protection de l’administration, les réessais, la corbeille et la restauration. Deux tests du parcours participant exécutent le code d’interface dans un DOM simulé, y compris l’édition avant envoi et une panne réseau. Ils ne remplacent pas une vérification visuelle dans de vrais navigateurs.

Voir `VERIFICATION.md` pour les vérifications réellement effectuées dans cette livraison et leurs limites. Avant votre première formation, testez le lien avec un téléphone, un ordinateur et une fenêtre privée.



## Crédit

Source : https://qdn-evaluation-ia-2026.pascal6367.chatgpt.site/
Typologie proposée par Pascal Brassier, Quartiers du numérique 2026. Adaptation des formulations, de l’interface et de l’administration pour l’usage en formation. Aucun logo institutionnel ni validation scientifique n’est revendiqué.



