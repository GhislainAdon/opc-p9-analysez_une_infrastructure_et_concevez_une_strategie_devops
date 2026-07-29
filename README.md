# GlossaPro — Pipeline CI/CD initialisé

Dépôt du **pipeline CI/CD d'initialisation** de la transformation DevOps de GlossaPro
(projet 9 — Option B, parcours Expert DevOps).

## 👉 Le contenu est sur la branche `solution`

Cette branche `master` est la **baseline** : le point de départ, conservé pour que
l'historique montre ce qui a été construit par-dessus.

| Où aller | Lien |
|---|---|
| **Le pipeline, l'application et le README complet** | [branche `solution`](../../tree/solution) |
| Le pipeline de référence (GitLab CI) | [`.gitlab-ci.yml`](../../blob/solution/.gitlab-ci.yml) |
| Le même enchaînement sur le miroir GitHub | [`.github/workflows/ci.yml`](../../blob/solution/.github/workflows/ci.yml) |

Le pipeline enchaîne **lint → tests → package → sécurité (Trivy + gitleaks) → smoke test
→ notification**. Le README de la branche `solution` est rédigé pour un développeur
junior : démarrage en 5 minutes, cycle de contribution complet, règles d'or.
