# ARCHITECTURE.md — MarocBR v2

**Statut : VALIDÉ par ElMehdi le 13 novembre 2026 (version 2, révision 2).** Dépend de DECISIONS.md v2.
Ce document décrit **comment le code est organisé**, pas le jeu. Si les deux se contredisent, DECISIONS.md gagne.

Public : ElMehdi (décisions), Muse (rangement des fichiers), Gemini et ChatGPT (relecture), Claude (seul à écrire le code).

---

## 1. Principes

1. **Un seul moteur pour toutes les cartes.** Les cartes sont des fichiers de données ; le moteur ne connaît aucune carte par son nom.
2. **Le joueur et les bots donnent les mêmes commandes.** Une seule façon d'agir sur le monde.
3. **L'affichage et le son lisent, ils ne modifient jamais.** Rien de ce qui est dessiné ou joué ne change l'état du jeu.
4. **Les règles ne sont écrites qu'à un seul endroit.** Un chiffre (portée, dégâts, vitesse) vit dans un fichier de données, jamais recopié dans le code.
5. **On mesure à chaque étape**, sur le Redmi réel, avant d'avancer.
6. **Le jeu s'ouvre sans serveur** : simples fichiers, pas de `import`, pas d'outils de compilation. (Ça marche en ouvrant `index.html` et sur GitHub Pages.)

## 2. Arborescence cible

On ne crée pas tout d'un coup : les fichiers arrivent jalon par jalon (section 11).

```
MarocBR/
├── index.html              (page, chargement des scripts dans l'ordre, numéro de version)
├── DECISIONS.md  ARCHITECTURE.md  TACHES.md  README.md
├── legacy/index_v1.html    (l'ancien jeu, conservé pour comparer, jamais modifié)
├── legacy/index_v1_mesure.html + legacy/perf-debug.js   (M0 : même jeu + outil de mesure)
├── M0_RELEVE.md            (relevé de l'ancien jeu et protocole de mesure)
├── cartes/
│   ├── contrat.js          (vérification : une carte est-elle valide ?)
│   ├── medina.js           (carte 1, en premier)
│   ├── ksar.js             (carte 2, plus tard)
│   └── kasbah.js           (carte 3, plus tard)
└── js/
    ├── config.js           (tous les réglages : unités, vitesses, seuils, temps)
    ├── util.js             (maths, hasard à graine, petites fonctions)
    ├── data/               armes.js  surfaces.js  butin.js  textes.js  profils.js
    ├── core/               etat.js  boucle.js  evenements.js  zone.js  match.js
    ├── world/              collision.js  vision.js  butin.js  bruit.js
    ├── entities/           combat.js  commandes.js
    ├── ai/                 perception.js  cerveau.js
    ├── input/              tactile.js  traduction.js
    ├── render/             monde.js  hud.js  minimap.js  effets.js
    ├── audio/              audio.js
    ├── debug/              perf.js
    └── main.js             (démarrage : charge la carte, branche les modules)
```

Tous les scripts partagent **un seul nom global** : `MBR`. Chaque fichier ajoute son module à `MBR` (par exemple `MBR.collision`, `MBR.zone`). Aucun autre nom global.

## 3. Couches et règle de dépendance

Les modules sont rangés en couches. **Un module n'appelle que les couches en dessous de lui, jamais au-dessus.** Pour « remonter » (informer l'interface qu'un tir a eu lieu), on passe par des **événements**.

| Couche | Contenu | Peut appeler |
|---|---|---|
| 1. Données | `config`, `util`, `data/*`, `cartes/*` | rien (ce sont des données) |
| 2. Cœur | `core/*` (état, boucle, événements, zone, match) | couche 1 |
| 3. Monde | `world/*` (collision, vision, butin, bruit) | couches 1-2 |
| 4. Entités | `entities/*` (combat, commandes) | couches 1-3 |
| 5. Décideurs | `ai/*` (bots), `input/*` (joueur) | couches 1-4 ; **produisent des commandes** |
| 6. Lecteurs | `render/*`, `audio/*`, `debug/*` | couches 1-5 en **lecture seule** |
| 7. Démarrage | `main.js` | tout |

**Interdits** : une couche basse qui appelle l'interface ; `render` ou `audio` qui modifient l'état ; deux cartes qui partagent du code spécifique ; une valeur de jeu écrite en dur dans un module au lieu de `config`/`data`.

## 4. Responsabilité de chaque module

| Module | Fait | Ne fait pas |
|---|---|---|
| `config.js` | Toutes les constantes réglables (caméra 520, seuils tactiles, temps de zone, plafond d'images) | Aucune logique |
| `util.js` | Vecteurs, distances, hasard à graine fixe (pour rejouer un match), grille | Aucune règle de jeu |
| `data/armes.js` | Le tableau des armes (dégâts, portée, cadence, aimant…) | Aucun comportement |
| `data/surfaces.js` | **Un seul tableau** des surfaces (sable, pierre, eau, dune, intérieur, buisson) : vitesse, bruit, visibilité | Aucune logique de carte |
| `data/butin.js` | Raretés et probabilités de butin | |
| `data/textes.js` | **Tous les textes visibles** (français + bandeaux darija) | Aucun texte écrit ailleurs |
| `data/profils.js` | Profils de bots (Fonceur, Prudent, Tireur) et niveaux de difficulté | |
| `core/etat.js` | L'objet d'état unique du match (section 5) et sa création | N'affiche rien |
| `core/boucle.js` | Boucle à pas fixe (60 mises à jour/s), pause, plafond d'images | Aucune règle |
| `core/evenements.js` | Petit bus d'événements (section 7) | |
| `core/zone.js` | Chronologie de la zone (DECISIONS §2), cercle actuel/prochain, dégâts | Ne sait pas où est le joueur : elle donne « ce point est-il dans la zone ? » |
| `core/match.js` | États du match (attente, décompte, en cours, fini), rang, victoire, égalité | |
| `world/collision.js` | Grille de collision, déplacements qui glissent le long des murs, balles contre les murs | |
| `world/vision.js` | Ligne de vue, buissons (180 unités de contour à contour, fondu), fumée | |
| `world/butin.js` | Placement du butin, ouverture des caisses et maisons, ramassage | |
| `world/bruit.js` | **Modèle unique du bruit** : qui émet quoi, qui entend quoi (section 8) | Ne joue aucun son |
| `entities/combat.js` | Armes en action : salves, balles, dégâts, gilet, soins, projectiles lancés | |
| `entities/commandes.js` | Définit l'objet **Commande** (section 6) et l'applique à une entité | |
| `ai/perception.js` | Ce qu'un bot voit et entend (via `vision` et `bruit`, mêmes règles que le joueur) | |
| `ai/cerveau.js` | Hiérarchie de décisions, profils, réaction, états → produit des Commandes | N'agit jamais directement sur le monde |
| `input/tactile.js` | Doigts, rôles, zones, annulation, interruptions (section 9) | Ne déplace rien |
| `input/traduction.js` | Transforme les gestes en Commandes du joueur | |
| `render/monde.js` | Dessin du monde, caméra, buissons, toits transparents | Lecture seule |
| `render/hud.js` | Les 6 éléments permanents et les messages (DECISIONS §9) | Lecture seule |
| `render/minimap.js` | Minimap sans ennemis | Lecture seule |
| `render/effets.js` | Étincelles, particules (avec plafond) | |
| `audio/audio.js` | Joue les sons générés (Web Audio), à partir des événements et de `bruit` | Ne décide d'aucune règle |
| `debug/perf.js` | FPS, pire image, compteurs, scénarios de test | Désactivé hors mode debug |
| `main.js` | Charge la carte, vérifie le contrat, crée l'état, branche tout | |

## 5. L'état du match

**Un seul objet d'état**, créé par `core/etat.js`, lu par tout le monde, modifié uniquement par les couches 2 à 5 (cœur, monde, entités, décideurs).

Il contient : le temps du match, l'état du match (attente / décompte / en cours / fini), la carte chargée, la liste des **16 entités**, le butin au sol, les caisses et maisons, les projectiles, les fumées, la zone (phase, cercle actuel, cercle suivant), le fil des éliminations, la graine du hasard, la liste des événements du pas courant.

Une **entité** (joueur ou bot, même structure) : identifiant, est-ce le joueur, héros, position, direction, vie, gilet, emplacements d'armes (3) + poings, munitions, soins, vitesse, rôle de bot (le cas échéant), dernière cause de dégâts. Les bots ajoutent leurs paramètres de profil. Le détail exact des champs est défini dans `core/etat.js` au jalon M1.

## 6. Commande : la seule façon d'agir

À chaque pas de mise à jour, le joueur (via `input`) et chaque bot (via `ai`) produisent **une Commande**. `entities/commandes.js` l'applique. **Rien d'autre ne déplace ni ne fait tirer une entité.**

Une Commande contient : direction de déplacement et allure (0 à 1), angle de visée, geste de tir (aucun / appui / relâché / annulé), mode de visée (auto / verrouillé / manuel), emplacement d'arme choisi, utilisation d'un soin, lancer d'un objet, échange d'arme.

Intérêt : le joueur distant du futur multijoueur sera simplement **une autre source de Commandes**, comme un bot. C'est ce qui rendra la Phase 3 faisable.

## 7. Événements

Petit bus : un module « publie », d'autres « s'abonnent ». Seulement pour **informer vers le haut** (cœur → interface/son), jamais pour contourner la règle de dépendance.

Événements prévus : `tir`, `degats`, `elimination`, `ramassage`, `caisse-ouverte`, `phase-zone` (avertissement, début, fin), `bruit` (voir §8), `fin-match`, `pause`.

L'interface et le son s'abonnent. Les événements sont **vidés à chaque pas** : rien ne s'accumule.

## 8. Unités, caméra, bruit

- **Unité du monde** unique (DECISIONS §4). Caméra à hauteur fixe de 520 unités : `zoom = hauteur écran (px) / 520`. Toutes les distances de jeu (sons, portées, buissons) sont **en unités du monde**, jamais en pixels. L'interface est en pourcentage de la hauteur de l'écran.
- **Relevé à faire en M0** dans l'ancien code : rayon du joueur, vitesse **et son unité**, taille des maisons, pour caler les nouvelles valeurs. (Vitesse : ElMehdi avait demandé 131, Claude avait suggéré ~190 ; rien n'est décidé.)
- **Modèle du bruit** (`world/bruit.js`), **partagé par le joueur et les bots** :
  1. Chaque entité qui agit déclare un **émetteur** : position, portée de base (tableau DECISIONS §6), multiplicateur de surface.
  2. Pour un **auditeur** (le joueur ou un bot) : on ne garde que les émetteurs dans sa portée ; le volume décroît avec la distance ; un mur entre les deux étouffe ; le sens gauche/droite vient de la direction.
  3. Les **3 plus forts** sont retenus, avec les règles de stabilité (remplacement à +15 %, place gardée 0,4 s).
  4. Le résultat est une liste (direction, volume, étouffé ou non). **`audio` la joue**, **`hud` en tire les flèches**, **`ai/perception` s'en sert pour enquêter**. Une seule source de vérité.
- **Les trois systèmes de visibilité** restent séparés : minimap (aucun ennemi), vision réelle (`world/vision`), distance de dessin (`render/monde`).

## 9. Contrôle tactile (`input/tactile.js`)

- **Un doigt = un rôle**, attribué quand il se pose (déplacement, tir, bouton de soin, bouton d'échange, pause, emplacements) et gardé jusqu'à ce qu'il se lève. On identifie chaque doigt par son identifiant, on ne se fie jamais à l'ordre.
- Le joystick flottant ne s'active que dans la moitié gauche. Le bouton de tir a sa zone propre et une **zone d'annulation** centrée dessus.
- **Seuils** (`config.js`) : maintien 0,25 s ; glissement minimal 12 px. Un seul endroit à changer.
- **Annulation** : relâcher dans la zone d'annulation produit un geste « annulé » : ni tir, ni munition consommée, ni attente.
- **Interruptions** : à la perte de visibilité de la page, au changement de taille ou d'orientation, à l'annulation d'un événement tactile, ou à l'arrivée d'un appel : tous les doigts sont remis à zéro, le geste en cours est annulé, le jeu passe en pause.
- **Orientation** : paysage uniquement. En portrait : pause et message « tourne ton téléphone ». (Le blocage automatique de l'orientation dépend du navigateur et du mode plein écran ; le message est le filet de sécurité.)
- Le module produit des **gestes** ; `input/traduction.js` les transforme en Commandes du joueur.

## 10. Le contrat d'une carte

Chaque fichier de carte contient **exactement les mêmes rubriques**. Si une rubrique manque, `cartes/contrat.js` affiche l'erreur à l'écran au chargement.

| Rubrique | Contenu |
|---|---|
| Identité | nom, taille (largeur × hauteur), numéro de version du contrat |
| Obstacles | liste de formes (rectangles, cercles) typées : mur plein, couvert bas, falaise |
| Surfaces | zones typées selon le **tableau commun** `data/surfaces.js` : sable, pierre, eau, dune, intérieur, buisson |
| Bâtiments | maisons (murs, porte, zone de toit), points de butin à l'intérieur |
| Points de butin | au sol, caisses, coffres, avec rareté de base |
| Départs | points de départ des 16 participants, groupés si la carte l'exige |
| Véhicules | positions des voiture(s) (obstacles solides) |
| Zone | centre et rayon de départ (demi-diagonale), **rayons de zone en % pour chaque phase** (par carte), règle de choix du centre suivant (**position aléatoire, toujours dans l'ancien cercle**) |
| Repères | noms et positions des quartiers (pour la minimap et les messages) |
| Options | limite de vision indépendante des obstacles (oui/non et valeur) |
| Remplissage | graine et règles de génération (maisons le long des rues, buissons), pour ne pas tout placer à la main |

**Vérifications automatiques au chargement** : point de départ dans un mur, butin hors de la carte, maison sans porte, rubrique manquante, surface inconnue. Les erreurs s'affichent à l'écran (on n'a pas de console sur le téléphone).

**Règle d'or** : si une carte a besoin d'un comportement qui n'existe pas dans le moteur, on ajoute un **nouveau type générique** (dans `data/surfaces.js` ou dans une rubrique du contrat), **jamais** un cas particulier pour cette carte.

## 11. Performance : règles de code

- **Pas de création d'objets dans la boucle** : on réutilise des tableaux et des objets, pour éviter les pauses du ramasse-miettes.
- **Grille spatiale** (cases d'environ 200 unités) pour la collision, la vision et la recherche de cibles : on ne teste que les voisins.
- **Lignes de vue mises en cache** par paire, recalculées environ toutes les 0,2 s, et seulement pour les paires proches.
- **Décisions des bots toutes les 0,2 s**, décalées d'un bot à l'autre (pas tous à la même image).
- **Décor fixe** (sol, murs) dessiné une fois sur un canevas hors écran, puis recopié ; on ne redessine que ce qui bouge.
- **Dessin seulement de ce qui est à l'écran** (plus une petite marge).
- **Pas d'ombres floues** (`shadowBlur`) : coûteux sur mobile ; contour de texte à la place.
- **Résolution** : tenir compte de la densité de pixels de l'écran, **plafonnée à 2**.
- **Particules plafonnées** (nombre maximal fixé dans `config`).
- **Mise à jour à pas fixe** (60/s) avec plafond du temps rattrapé, pour éviter les sauts si le téléphone ralentit.
- **Mode debug** (paramètre dans l'adresse) : FPS moyen, pire image, objets dessinés, lignes de vue par seconde, bruit. Les valeurs apparaissent à l'écran ; désactivé en jeu normal.

## 12. Jalons et critères de passage

Chaque jalon est testé sur le Redmi avant le suivant. Format de retour d'ElMehdi : *c'est lisible ? les pouces atteignent tout ? ça rame ?* + une capture.

| Jalon | Contenu | Critère de passage | Aide de Muse |
|---|---|---|---|
| **M0** Relevé et mesure | Relevé des valeurs de l'ancien code (**fait**, voir `M0_RELEVE.md`) ; outil de mesure `perf-debug.js` branché sur une copie de l'ancien jeu ; référence de performance | On sait combien d'images/s fait l'ancien jeu sur le Redmi (4 captures de résumé) | Muse met en place `legacy/` ; ElMehdi lance les scénarios et envoie les captures |
| **M1** Squelette | Découpage en fichiers, `config`, état, boucle à pas fixe, caméra à 520, version affichée | Le jeu actuel fonctionne à l'identique, même FPS | Range les fichiers dans le dépôt |
| **M2** Contrôles | `input/*`, commande unique de tir, annulation, interruptions, paysage verrouillé | Tap, maintien, glissement et annulation marchent ; aucun doigt fantôme ; testé par 5 personnes | Organise les 5 testeurs, note les ressentis |
| **M3** Médina (base) | Carte au contrat, collision, vision, buissons, 16 entités sans IA | Marche à 30 FPS minimum avec 16 entités | Test de ralentissement du processeur |
| **M4** Bruit et visibilité | `world/bruit`, `audio`, flèches, ennemis invisibles sur la minimap | On repère un ennemi caché au son ; scénario *stress* réussi | Test avec casque et en silencieux |
| **M5** Bots | `ai/*`, 3 profils, mode démo, mesure du rythme de survie | 3 matchs complets, durée 10–11 min 30, aucune anomalie dans les contrôles | 3 matchs notés (durée, bugs) |
| **M6** Armes et butin | 6 armes de base, butin, caisses, maisons, soins, ravitaillements | Un match complet jouable | Relecture Gemini du tableau |
| **M7** Zone et fin | Chronologie DECISIONS §2, avertissements, fin de match, écran de résultat | Tout le rythme est vérifié en mode accéléré ×4 puis en normal | Teste les cas limites (égalité) |
| **M8** Finition Médina | HUD épuré final, textes darija, retrait des mentions, version installable | **ElMehdi valide la Médina** | Vérifie 3 formats d'écran |
| **M9+** Cartes 2 et 3, armes en plus | Seulement après M8 | Même contrat, même moteur | |

Le jalon M8 est la porte d'entrée vers les cartes 2 et 3. Pas avant.

## 13. Tests

- **Mode démo** : les 16 participants sont des bots, graine fixe, vitesse de simulation accélérée possible. Sert à mesurer le rythme de survie, la durée, la performance.
- **Contrôles automatiques** (affichés à l'écran en mode debug) : aucun bot plus rapide que sa vitesse maximale ; chaque perte de vie a une cause ; chaque élimination à portée d'écoute produit un son ou une ligne dans le fil des éliminations ; zone toujours incluse dans la précédente.
- **Trois scénarios de performance**, répétés à chaque jalon : *stress*, *match complet*, *fin de match* ; plus le test de durée (DECISIONS §10). Seuils : moyenne ≥ 30, pire ≥ 24 images/s, aucune image à plus de 100 ms plus de quelques fois par minute, cible de 20 ms ou moins par image.
- **Format de rapport** : version, scénario, FPS moyen, pire image, ressenti, capture d'écran prise par ElMehdi sur son Redmi. À noter dans TACHES.md.

## 14. Règles de travail

- **Un seul auteur du code : Claude.** Les autres relisent et proposent, sans réécrire de fichier.
- **Muse range et publie** les fichiers dans le dépôt ; Claude ne peut pas écrire sur GitHub.
- **Numéro de version** : chaque changement change le numéro affiché dans le jeu et en tête de `index.html`. Une ligne dans TACHES.md (date, version, changement).
- **Conventions** : noms de fichiers en minuscules sans espace ; un module par fichier ; chaque fichier commence par un court commentaire « ce que fait ce fichier, ce qu'il ne fait pas » ; tous les textes visibles dans `data/textes.js`.
- **Gros fichiers** : on évite les fichiers de plus de ~800 lignes (relecture et copie plus faciles).
- **Aucune modification d'une règle de DECISIONS.md** sans l'accord d'ElMehdi ; si le code a besoin d'une règle manquante, Claude la propose par écrit et attend.
- **Mention d'autres jeux** : aucun nom, logo ni icône d'un autre jeu dans le contenu visible.

## 15. Ce que cette architecture prépare (sans le faire)

- **Phase 3 (en ligne)** : l'état unique, les Commandes et la séparation lecture/écriture permettent de déplacer le « cerveau du match » sur un serveur plus tard. Les bots tourneraient côté serveur. Ce travail n'est pas fait maintenant et n'est pas promis ; il demandera un refactoring et probablement de l'aide.
- **Version Unity** : les données (armes, surfaces, cartes, textes, profils de bots) et les règles (zone, bruit, hiérarchie des bots) se retraduisent presque telles quelles en C#.

---
*ARCHITECTURE.md v2 (révision 2) — validé par ElMehdi le 2026-11-13.*
