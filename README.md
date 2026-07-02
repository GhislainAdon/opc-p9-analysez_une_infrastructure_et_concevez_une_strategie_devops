# GlossaPro — Pipeline CI/CD d'initialisation

Bienvenue ! Ce dépôt est la **base de travail** de la transformation DevOps de
GlossaPro. Il contient un service d'exemple (`glossaflow-api`) et un **pipeline
d'intégration continue complet** que tu peux lire, exécuter et copier pour ton
propre composant.

> 🎯 **Ce README est écrit pour toi, développeur ou développeuse junior** : tout ce
> qu'il faut pour démarrer tient sur cette page. Aucun prérequis DevOps.

## C'est quoi, ce pipeline ?

À **chaque push**, GitHub Actions exécute automatiquement 4 étapes. Si l'une
échoue, le code n'avance pas — c'est le filet de sécurité de toute l'équipe.

| Étape | Ce qu'elle fait | Pourquoi c'est utile pour toi |
|---|---|---|
| **1. Lint** | Vérifie le style et les erreurs courantes du code (ESLint) | Attrape les fautes d'inattention avant la revue |
| **2. Tests** | Lance les tests unitaires (Jest) | Prouve que ton changement ne casse rien |
| **3. Build** | Construit l'image Docker de l'application | La même image tournera en intégration puis en production |
| **4. Sécurité** | Scanne l'image avec Trivy et **bloque** si une vulnérabilité grave est trouvée | Personne ne livre une faille en production par accident |

Le résultat est visible dans l'onglet **Actions** du dépôt : vert = tout est bon,
rouge = clique sur le job en échec pour lire les logs (ils te disent quoi corriger).

## Démarrer en local (5 minutes)

Prérequis : [Node.js 20](https://nodejs.org) (et [Docker](https://docs.docker.com/get-docker/) pour l'étape 4, facultatif en local).

```bash
git clone <url-du-depot> && cd opc-p9*/app

npm install        # installe les dépendances
npm test           # lance les tests — tu dois voir 3 tests verts ✅
npm run lint       # vérifie le style
npm start          # démarre l'API sur http://localhost:3000
```

Vérifie que ça tourne :

```bash
curl http://localhost:3000/health
# → {"status":"ok","service":"glossaflow-api","version":"dev"}

curl -X POST http://localhost:3000/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"bonjour","target":"en"}'
# → {"source":"bonjour","target":"en","translation":"[en] bonjour"}
```

Pour tester l'image Docker comme en production :

```bash
docker build -t glossaflow-api app
docker run -p 3000:3000 glossaflow-api
```

## Comment contribuer (le cycle complet)

1. **Crée une branche** depuis `master` : `git checkout -b feat/ma-fonctionnalite`
2. **Code** ta modification **et son test** (regarde `app/tests/server.test.js` pour un modèle — un test = quelques lignes).
3. **Vérifie en local** : `npm run lint && npm test` (les mêmes commandes que le pipeline — pas de surprise).
4. **Pousse et ouvre une pull request** : le pipeline se lance tout seul, ses statuts s'affichent dans la PR.
5. **Pipeline vert + 1 relecture approuvée** → merge. C'est tout.

⚠️ Règles d'or :
- Jamais de mot de passe, token ou clé dans le code — les secrets vont dans **Settings → Secrets** du dépôt (demande à l'équipe plateforme).
- Si le scan Trivy bloque ta PR : c'est une vraie vulnérabilité dans une dépendance. Mets à jour la dépendance (`npm update <paquet>`) ; si aucun correctif n'existe, parle-nous-en — ne contourne jamais le scan seul.
- Un test rouge n'est jamais « à corriger plus tard ».

## Structure du dépôt

```
app/
├── src/server.js        # le service (Express) — 2 routes : /health, /translate
├── tests/server.test.js # les tests unitaires (Jest + supertest)
├── package.json         # scripts : start, test, lint
├── .eslintrc.json       # règles de style
└── Dockerfile           # image de production (multi-stage, utilisateur non-root)
.github/workflows/ci.yml # LE pipeline — chaque job y est commenté
.trivyignore             # exceptions de sécurité (gouvernées par l'équipe plateforme)
```

## Et la suite ?

Ce squelette est l'**étape 1** de la trajectoire décrite dans le Document technique
de la transformation : les prochaines itérations ajouteront le déploiement
automatique vers l'environnement d'intégration (Helm/Kubernetes), puis la production
sur approbation. La structure du pipeline (lint → test → build → scan) restera la
même — ce que tu apprends ici s'applique à tous les composants GlossaFlow et
GlossaLearn.

**Une question ?** Canal `#plateforme` — aucune question n'est bête, et si la
réponse manque dans ce README, c'est le README qu'on corrige.
