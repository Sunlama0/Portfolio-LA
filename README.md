# Portfolio Lucas Aveline — 2026

Site statique : expériences professionnelles, formations et diplômes, 4 réalisations, 10 expériences interactives, contact et journal de veille RSS. Nouvelle photo fournie par Lucas. Thème clair/sombre : préférence système au premier chargement, puis choix mémorisé.

## Démarrer

- `npm install`
- `npm run dev` : http://127.0.0.1:4173 ; collecte RSS au démarrage puis toutes les six heures.
- `npm run build` : génère le site dans `site-dist/`.
- `npm test` : vérifications navigateur avec Microsoft Edge.
- `python -m unittest discover -s scripts -p test_veille.py` : collecte RSS, URLs autorisées, format Atom et maintien du cache en cas de panne.
- `python scripts/update_veille.py` : rafraîchir les flux immédiatement.

## Sources à modifier

- `src/data/profile.json` : postes, dates, missions, engagements et formations, repris des rubriques LinkedIn copiées par Lucas.
- `src/projects.mjs` : catalogue des réalisations et jeux.
- `scripts/generate.mjs` : contenu et structure des pages HTML générées.
- `src/portfolio.css` et `src/theme.css` : mise en page et thèmes.
- `src/theme.js` : choix du thème avant le premier affichage.
- `src/portfolio.js` : filtres, recherche, modales et actualisation du mini-blog.
- `src/img/lucas-2026.jpg` : nouvelle photo originale, cadrée uniquement à l’affichage.

Les expériences et formations sont sur deux pages distinctes. Spice IT figure dans les engagements. La page BTS SIO a été supprimée ; le diplôme reste dans Formations avec le bac, le Bachelor et le Master 2026–2028 en cours. Le CV téléchargeable est le fichier IT Project Manager 2026 fourni par Lucas ; les autres documents de formation restent disponibles. Les dates des cursus achevés sont indiquées sans ajouter une mention d’obtention non fournie.

## Veille automatique

Trois flux officiels : MDN Web Docs, GitHub Blog, Cloudflare Blog. Jusqu’à huit titres par source, avec auteur institutionnel, date et lien HTTPS. Aucun article complet n’est recopié et aucun texte HTML distant n’est injecté. Les anciennes données restent disponibles si une source échoue. La page affiche l’état de fraîcheur et vérifie le cache toutes les cinq minutes lorsqu’elle est ouverte.

En local, utiliser `npm run dev` pour la collecte automatique. Un simple hébergement statique ne peut pas collecter seul les flux RSS.

Le workflow `.github/workflows/veille.yml` est préparé pour une collecte quotidienne à 06:23 UTC et un enregistrement des nouvelles données. Il sera actif après publication du code sur la branche par défaut avec GitHub Actions autorisé. Il n’a pas été envoyé ni exécuté sur GitHub dans cette tâche.

Pour publier automatiquement avec GitHub Pages : sélectionner **GitHub Actions** comme source Pages dans les réglages du dépôt, autoriser le workflow à écrire dans le dépôt et ajouter la variable de dépôt `ENABLE_PAGES_DEPLOY=true`. Le déploiement est désactivé tant que cette variable n’est pas définie. Cela évite de promettre une mise à jour du site sans hébergement configuré. Aucun secret ni service RSS payant n’est nécessaire.

## Vérifications

Pages et liens locaux, séparation des 4 réalisations/10 expériences interactives, quatre formations, cinq expériences et un engagement, filtres, recherche, navigation mobile, modales, persistance du thème, responsive 320/390/768/1440 px, 24 articles et filtres de sources. Les dix démos originales sont conservées ; interactions morpion, QCM, générateur, FAQ et notation testées. Le QCM d’origine a été réparé.

Le site utilise des chemins relatifs pour GitHub Pages ou un sous-répertoire. Les dix démos conservent leur style original. Certains exemples historiques dépendent de CDN ; la ToDoList Laravel conserve son lien d’hébergement externe.

La navigation comprend un accès direct au CV 2026, un état actif et un menu mobile. NexSecure est présenté sur l’accueil, la page Contact et l’expérience entrepreneuriale, avec liens vers https://nexsecure.fr/.

## Référencement

Le domaine public est défini dans `site.config.json` : `https://lucasaveline.fr/`. `SITE_URL` peut le remplacer lors de la compilation. `npm run build` régénère le sitemap des sept pages principales, robots.txt, les balises canoniques, descriptions uniques, Open Graph, Twitter Card et données structurées JSON-LD. La page historique de projets de formation est en noindex ; les démos restent accessibles depuis leur galerie.

Publier `robots.txt` et `sitemap.xml` à la racine du domaine. Configurer l’hébergeur pour servir `404.html` avec un vrai statut HTTP 404 ; GitHub Pages le gère nativement. Soumettre ensuite `https://lucasaveline.fr/sitemap.xml` dans Google Search Console. Ces fichiers ne configurent ni le DNS ni le certificat HTTPS et ne garantissent pas l’indexation.
