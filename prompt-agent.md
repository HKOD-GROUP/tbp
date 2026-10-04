# Brief : site Team Baraia Promotion

Tu vas développer en Angular le site de **Team Baraia Promotion (TBP)**, une promotion de boxe de Vigneux-sur-Seine : présentation de la promotion et de ses Galas du Peuple, mise en avant de son combattant Chadi Baraia, news, boutique par liens PayPal, et un espace admin pour que le client gère lui-même galas, news, boutique et messages.

## Les fichiers

| Fichier | À quoi il sert |
|---|---|
| `expression-de-besoin.md` | Le besoin complet : pages, admin, données Firestore, sécurité, textes exacts du client. Fait foi pour le fonctionnement. |
| `tbp-maquette.html` | La maquette, à ouvrir dans un navigateur. L'onglet jaune « Maquette » (bord gauche) liste tous les écrans, ouvre le design system et affiche les annotations. Fait foi pour le visuel. |
| `CHECKLIST.md` | Le plan de travail, phase par phase. |
| `tbp-images-v9.zip` | Les images du site en WebP, avec un `LISEZ-MOI.txt`. Utilise ces fichiers, pas les images intégrées dans la maquette. |
| `tbp-logo.svg` | Le logo officiel. |

## Les règles à respecter

1. **Pas de back-end.** Aucun serveur applicatif, aucune API, aucune Cloud Function, aucun service tiers. Les seuls appels réseau sont ceux du SDK Firebase côté client : Authentication, Firestore et Storage.
2. **Admin : un seul compte, défini à la main.** Son e-mail est déclaré dans `environment.ts` ; le compte est créé manuellement dans la console Firebase Auth. Pas de page d'inscription. Les règles Firestore et Storage n'autorisent l'écriture qu'à ce compte. Ne mets jamais de mot de passe dans le code.
3. **Contact et newsletter** sont enregistrés dans Firestore et lus dans l'onglet Messages de l'admin (export CSV des inscrits). Aucun e-mail n'est envoyé par le site.
4. **Déploiement : même VPS et même méthode que le projet lockir**, situé dans `C:\Users\dagho\Documents\HKOD-GROUP\lockir`. Lis-le avant d'écrire du code et reprends ses versions (Angular, Node, gestionnaire de paquets), son mode de rendu, sa configuration serveur et ses scripts de build et de déploiement. Domaine : tbp.fr.
5. **La maquette fait foi pour le visuel.** Reprends ses jetons CSS et ses composants à l'identique, sans librairie UI. Responsive de 360 à 1440 px ; admin pensé d'abord pour le téléphone.
6. **N'invente rien.** Textes et infos du client : mot pour mot depuis l'expression de besoin. Si un point n'est pas clair, pose la question.

## Ta méthode

- Suis `CHECKLIST.md` dans l'ordre. Copie-la à la racine du dépôt et coche chaque tâche terminée.
- Arrête-toi à chaque point de contrôle et attends ma validation.
- Une tâche est terminée quand le build et le lint passent, que le rendu correspond à la maquette sur ordinateur et sur mobile, et qu'il n'y a aucune erreur dans la console.

## Ton premier message

Avant tout code, réponds-moi avec :
- ton résumé du projet en cinq lignes ;
- ce que tu retiens de lockir : versions, rendu, déploiement ;
- ton plan ;
- ce qu'il te faut de ma part (configuration Firebase, e-mail et UID du compte admin, accès au VPS) ;
- tes questions.
