# Vérifications — 15 octobre 2026

## Exécutées automatiquement

12 tests réussis avec Node.js (tests/api.test.mjs et tests/participant.test.mjs).

- Cinq profils exclusifs à 10/10 et égalité des cinq profils à 2/10.
- Envoi anonyme, insertion réelle dans SQLite à partir de la migration livrée, lecture administrateur des dix réponses.
- Recalcul des scores côté serveur ; les scores et dates éventuellement transmis par le client ne sont pas utilisés.
- Refus des soumissions incomplètes, invalides et d’une ancienne version.
- Réessai sans doublon ; conflit d’identifiant rejeté.
- Refus sans autorisation sur la liste, les statistiques, l’export, la suppression et la restauration.
- Refus d’une mutation par cookie depuis une origine différente.
- Filtres de session et de dates, paramètres liés SQL et pagination.
- Export CSV contenant les réponses, les scores et l’identifiant ; neutralisation des cellules pouvant devenir des formules.
- Corbeille, exclusion des statistiques actives et restauration.
- API indépendante : absence de configuration refusée, mauvaise clé refusée, clé correcte acceptée.
- Interface exécutée dans un DOM simulé : dix réponses, correction avant envoi, confirmation, résultats et bouton PDF ; réessai après panne réseau avec le même identifiant.

Compilation de la version Sites réussie. Les assets publics et les routes serveur sont fournis.

## Limites

Pas de vérification visuelle dans un navigateur réel dans cet environnement. Les tests de connexion propriétaire en production ne peuvent pas se substituer à votre propre connexion interactive. Le déploiement dans votre compte GitHub/Cloudflare personnel reste à effectuer pour l’option indépendante.

Les contrôles effectués sur le site public après déploiement sont consignés ci-dessous.

## Déploiement réel

- Déploiement version 2 : succès confirmé par l’hébergement.
- Mode d’accès : public confirmé par le service d’hébergement.
- Secret d’autorisation du compte propriétaire configuré côté serveur.
- Tentative de contrôle HTTP depuis l’environnement d’exécution : HTTP 403, `error code: 1010`, avant d’obtenir le contenu attendu. Impossible de vérifier l’envoi et la connexion propriétaire sur l’URL réelle depuis cet environnement.
- Aucun envoi de test en production n’a été effectué : la première requête a été bloquée avant d’atteindre le questionnaire.
- Vérification finale nécessaire depuis votre navigateur : ouvrir le questionnaire en fenêtre privée, envoyer une participation de session `VERIFICATION`, vous connecter à `/admin`, consulter les dix réponses et exporter le CSV. Placez ensuite la participation de test dans la corbeille.

## Refonte graphique Alef

- 17 tests automatisés réussis (les 12 contrôles initiaux et 5 contrôles supplémentaires).
- Alef Regular et Bold : famille et couverture des accents français vérifiées dans les tables des polices ; fichiers et licence inclus dans les deux distributions.
- Contrastes calculés : les paires principales de texte dépassent 4,5:1 ; les contours testés des champs et réponses et l’indicateur de focus dépassent 3:1.
- Code adaptatif prévu pour les petits écrans, avec règles spécifiques à 390, 740 et 1 000 pixels. Pas de contrôle visuel effectif des points de rupture dans cet environnement.
- Présence des liens d’évitement, libellés de formulaire, focus visible et préférences de mouvement réduit contrôlée dans le code. La navigation clavier et les lecteurs d’écran restent à vérifier dans un navigateur réel.
- Correction d’un choix et retour direct à la relecture testés avec le DOM simulé.
- Impression : ouverture des cinq profils, insertion de la note personnelle et restauration des panneaux testées avec le DOM simulé. Aucun PDF réellement imprimé et vérifié visuellement.
- API, schéma des données, questions, profils, version du questionnaire et contrôle d’autorisation côté serveur inchangés.

## Actualisation turquoise

- Couleur de marque `#19A69F`, fonds blancs et tons turquoise foncés pour les éléments de lecture et d’action.
- 17 tests automatisés réussis, dont les paires de contraste actualisées.
- Présentation de l’accueil remplacée par un questionnaire éditorial avec repères numérotés ; titres des résultats et de l’administration simplifiés.
- Aucune modification du questionnaire, du calcul, de la base ou des autorisations serveur.
- Vérification visuelle dans un navigateur réel toujours indisponible dans cet environnement.
