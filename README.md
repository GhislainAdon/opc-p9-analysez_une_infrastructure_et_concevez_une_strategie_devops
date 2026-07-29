# GlossaPro — Pipeline CI/CD d'initialisation

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/GhislainAdon/opc-p9-analysez_une_infrastructure_et_concevez_une_strategie_devops/tree/solution?quickstart=1)

Bienvenue ! Ce dépôt est la **base de travail** de la transformation DevOps de
GlossaPro. Il contient un service d'exemple (`glossaflow-api`) et un **pipeline
d'intégration continue complet** que tu peux lire, exécuter et copier pour ton
propre composant.

> 🎯 **Ce README est écrit pour toi, développeur ou développeuse junior** : tout ce
> qu'il faut pour démarrer tient sur cette page. Aucun prérequis DevOps.

> 💻 **Rien à installer : clique sur le bouton ci-dessus.** Il ouvre un
> **Codespace** — un VS Code dans le navigateur, avec Node 20 et Docker déjà
> installés et les dépendances posées pour toi. Tu peux y lancer toutes les
> commandes de cette page, y compris `docker build`. Pense à **arrêter le
> Codespace** quand tu as fini (onglet *Codespaces* de GitHub) : les heures
> gratuites sont limitées.

## C'est quoi, ce pipeline ?

À **chaque push**, le pipeline exécute automatiquement 6 étapes. Si l'une
échoue, le code n'avance pas — c'est le filet de sécurité de toute l'équipe.

| Étape | Ce qu'elle fait | Pourquoi c'est utile pour toi |
|---|---|---|
| **1. Lint** | Vérifie le style et les erreurs courantes du code (ESLint) | Attrape les fautes d'inattention avant la revue |
| **2. Tests** | Lance les tests unitaires (Jest) | Prouve que ton changement ne casse rien |
| **3. Package** | Construit l'image Docker de l'application | La même image tournera en intégration puis en production |
| **4. Sécurité** | Scanne l'image avec **Trivy** et l'historique git avec **gitleaks** — les deux **bloquent** | Ni faille connue, ni mot de passe oublié ne partent en production |
| **5. Vérification** | Démarre réellement le conteneur et appelle ses routes (*smoke test*) | Une image qui compile n'est pas forcément une image qui démarre |
| **6. Notification** | Publie le résultat sur Discord | Tu sais en 2 minutes si ton push est passé, sans surveiller l'écran |

Le résultat est visible dans **CI/CD → Pipelines** (GitLab) ou dans l'onglet
**Actions** (miroir GitHub) : vert = tout est bon, rouge = clique sur le job en
échec pour lire les logs, ils te disent quoi corriger.

> **Deux plateformes, un seul enchaînement.** Le dépôt de référence est sur
> **GitLab** (`.gitlab-ci.yml`) ; le miroir **GitHub** rejoue les mêmes étapes
> (`.github/workflows/ci.yml`). Tu peux travailler indifféremment sur l'un ou
> l'autre : les commandes de vérification locales sont identiques.

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
4. **Pousse et ouvre une merge request** (*pull request* sur GitHub) : le pipeline se lance tout seul, ses statuts s'affichent dans la MR.
5. **Pipeline vert + 1 relecture approuvée** → merge. C'est tout.

⚠️ Règles d'or :
- Jamais de mot de passe, token ou clé dans le code — les secrets vont dans les **variables CI/CD masquées** (GitLab : *Settings → CI/CD → Variables* ; GitHub : *Settings → Secrets*). Demande à l'équipe plateforme.
- Si le scan **Trivy** bloque ta MR : c'est une vraie vulnérabilité dans une dépendance. Mets à jour la dépendance (`npm update <paquet>`) ; si aucun correctif n'existe, parle-nous-en — ne contourne jamais le scan seul.
- Si le scan **gitleaks** bloque ta MR : un secret est présent dans un commit. Le retirer du dernier commit ne suffit pas (il reste dans l'historique) — préviens l'équipe plateforme, le secret doit être **révoqué** puis l'historique nettoyé.
- Un test rouge n'est jamais « à corriger plus tard ».

## Structure du dépôt

```
app/
├── src/server.js        # le service (Express) — 2 routes : /health, /translate
├── tests/server.test.js # les tests unitaires (Jest + supertest)
├── package.json         # scripts : start, test, lint
├── .eslintrc.json       # règles de style
└── Dockerfile           # image de production (multi-stage, utilisateur non-root)
.gitlab-ci.yml           # LE pipeline (référence) — chaque job y est commenté
.github/workflows/ci.yml # le même enchaînement sur le miroir GitHub
.trivyignore             # exceptions de vulnérabilités (gouvernées par l'équipe plateforme)
.gitleaks.toml           # chemins légitimes exclus du scan de secrets
.devcontainer/           # environnement prêt à l'emploi (Codespaces / VS Code)
```

## Et la suite ?

Ce squelette est l'**étape 1** de la trajectoire décrite dans le Document technique
de la transformation : les prochaines itérations ajouteront le déploiement
automatique vers l'environnement d'intégration (Helm/Kubernetes), puis la production
sur approbation. La structure du pipeline (lint → test → package → sécurité →
vérification → notification) restera la même — ce que tu apprends ici s'applique à
tous les composants GlossaFlow et GlossaLearn.

**Une question ?** Canal `#plateforme` — aucune question n'est bête, et si la
réponse manque dans ce README, c'est le README qu'on corrige.
