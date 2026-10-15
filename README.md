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


## Crédit

Source : https://qdn-evaluation-ia-2026.pascal6367.chatgpt.site/
Typologie proposée par Pascal Brassier, Quartiers du numérique 2026. 
Adaptation des formulations, de l’interface et de l’administration pour l’usage en formation. 


