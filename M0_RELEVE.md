# M0 — Relevé de l'ancien jeu (v1) et protocole de mesure

**Date : 13 novembre 2026.** Source : `index.html` du dépôt (branche `main`), lu en entier.
Statut : **relevé terminé, mesures de performance à faire** (protocole en partie 5).
Ce document ne décide rien : il sert à caler les valeurs de la v2 (DECISIONS.md). Aucun code de jeu n'a été modifié.

Légende : **[LU]** valeur lue dans le code · **[CALCULÉ]** dérivé des valeurs lues · **[ESTIMÉ]** à confirmer par la mesure.

---

## 1. Unités du monde et caméra

| Élément | Valeur | Remarque |
|---|---|---|
| Taille du monde | **3 000 × 3 000** (`WORLD`) **[LU]** | carré |
| Unité du monde | **1 unité = 1 pixel CSS de l'écran** **[LU]** | aucun zoom : le canevas prend la taille de la fenêtre (`canvas.width = innerWidth`) |
| Résolution du canevas | pixels CSS, **densité de pixels ignorée** **[LU]** | image plus basse que l'écran réel, donc légèrement floue mais peu coûteuse |
| Hauteur visible | = hauteur de la fenêtre ≈ **390 unités** en paysage sans barre **[ESTIMÉ]** | Redmi : 2 400 × 1 080 px ÷ densité ~2,75. Le résumé de mesure affiche la vraie valeur |
| Largeur visible | ≈ **870 unités** **[ESTIMÉ]** | idem |
| Caméra | centrée sur le joueur, bornée aux limites du monde **[LU]** | pas de suivi progressif |

**Conséquence pour la v2.** La caméra v2 montre **520 unités de hauteur**, soit environ **33 % de plus** en hauteur que la v1 (zoom ≈ 0,75). Les personnages, les portées et les vitesses paraîtront donc plus petits et plus lents à l'écran, à nombres égaux. À régler par des tests de sensation (jalon M2), pas par calcul.

## 2. Joueur et bots

| Élément | Valeur v1 **[LU]** | Remarque |
|---|---|---|
| Rayon du joueur et des bots | **16** unités | diamètre 32 (≈ 6 % de 520, ≈ 8 % de 390) |
| **Vitesse de base** | **212 unités/s** (`212 × ch.speed`, `ch.speed = 1,00` pour tous les héros) | **unité : unités du monde par seconde** |
| Sur route | ×1,08 → **≈ 229** | |
| Dans la rivière | ×0,62 → **≈ 131** **[CALCULÉ]** | **131 = la vitesse en rivière.** Le « 131 » demandé par ElMehdi vient-il de là ? À demander. |
| Thé à la menthe | ×1,3 pendant 4 s → ≈ 276 | |
| Traversée de la carte | 3 000 ÷ 212 ≈ **14 s** (13 s sur route) | |
| Pour garder la **même sensation à l'écran** avec la caméra 520 | 212 × 520 ÷ 390 ≈ **283** **[CALCULÉ, ESTIMÉ]** | repère pour M2, pas une décision |
| Vie | 100 | pas de régénération |
| Bots | 9, même vitesse et même rayon, 1 bandage chacun | |
| Décision d'un bot | **toutes les 0,5 à 1,1 s** (aléatoire) | v2 : 0,2 s |
| Vue d'un bot | 430 unités ; tire à moins de 380 (sniper : 700) | **ne tient pas compte des murs** pour choisir sa cible ; aucune écoute de bruits ; un seul comportement pour tous |

## 3. Cartes, maisons, butin

**Carte v1** : type « 3 lanes » (3 routes + 2 routes latérales), rivière diagonale à 3 ponts, 2 bases, 6 tours. Les « 4 villes » (Fès, Casablanca, Marrakech, Tanger) ne changent que les couleurs. Rien de la Médina d'Ambre.

| Élément | Valeur v1 **[LU]** |
|---|---|
| Maisons | **8**, toutes **280 × 220** unités, murs de **14**, **porte de 64** au milieu du mur sud. Intérieur utile ≈ **252 × 192** |
| Centres des maisons | (560,120) (2 440,120) (560,2 560) (2 440,2 560) (1 150,1 150) (1 850,1 850) (1 150,1 850) (1 850,1 150) |
| Une maison en unités de joueur | environ 8,75 diamètres de large |
| Palmiers (solides) | 110, rayon de collision ≈ 9 à 15 |
| Buissons | 46, **décor seulement** (aucun effet de cache) |
| Tours | 6 (collision 32) |
| Voitures | 3 (collision 44, dessin 104 × 48) |
| Caisses | **20** (s'ouvrent à moins de 34 unités) |
| Butin au sol | **34** objets |
| Butin dans les maisons | 8 × (1 + 60 % de chance d'un 2e) ≈ **13** |
| Contenu d'une caisse | 1 objet + des munitions (2 objets) |
| **Total d'objets de butin** | ≈ **47 au départ**, ≈ **87** avec le contenu des caisses **[CALCULÉ]** |
| Rayon de ramassage | 38 (+10) = 48 |

**Repère pour la Médina v2** : ~90 objets sur 3 600² (12,96 M unités²) donne ≈ **6,9 objets par million d'unités²**, contre ≈ **9,7** en v1 (87 sur 9 M). La Médina v2 sera donc **un peu moins dense** que la v1 : à surveiller en test.

## 4. Armes, zone, boucle de jeu

**Armes v1 [LU]** (comparées au tableau v2 de DECISIONS.md §8) :

| Arme | Dégâts | Portée | Cadence | Particularité v1 |
|---|---|---|---|---|
| Poings | 9 | 74 (+rayon) | 0,38 s | aimant jusqu'à 330 |
| Pistolet | 14 | 540 | 0,30 s | 24 balles |
| Fusil | 10 | 560 | 0,15 s | 60 balles, tir très rapide |
| Pompe | 9 × 5 | 340 | 0,82 s | éventail 0,22 rad |
| Sniper | 55 | 980 | 1,25 s | **portée supérieure à la largeur visible (~870)** |

Gilet v1 : −30 %. Deux emplacements d'armes. Bandage +25, thé +50 (+30 % de vitesse).

**Zone v1 [LU]** : rayon de départ 2 250.

| Phase | Attente | Rétrécissement | Début → fin | Rayon final | % de 2 250 | Dégâts/s |
|---|---|---|---|---|---|---|
| 1 | 90 s | 60 s | 1:30 → 2:30 | 1 450 | 64 % | 1 |
| 2 | 70 s | 60 s | 3:40 → 4:40 | 950 | 42 % | 2 |
| 3 | 60 s | 60 s | 5:40 → 6:40 | 580 | 26 % | 3 |
| 4 | 50 s | 55 s | 7:30 → 8:25 | 320 | 14 % | 5 |
| 5 | 40 s | 55 s | 9:05 → 10:00 | 130 | 6 % | 8 |

Ensuite, la zone reste à 130 de rayon, **sans jamais se fermer**. Le nouveau cercle est déplacé de façon aléatoire à l'intérieur de l'ancien. Dégâts de zone : un coup par seconde.

**Boucle de jeu [LU]** : `requestAnimationFrame` sans plafond (un écran 120 Hz fait jusqu'à 120 images/s), pas de temps **variable** limité à 0,05 s (en dessous de 20 images/s, le jeu passe au ralenti).

## 5. Écarts v1 → v2 à garder en tête

1. **Zone** : rétrécissements de 55-60 s (v2 : 15 s), aucun avertissement à 30 s, pas de cercle final qui se ferme.
2. **Le gilet réduit aussi les dégâts de zone** en v1 (v2 : il les ignore).
3. **Ciblage** : la visée automatique ignore les murs ; il existe aussi une visée par glissement sur la moitié droite de l'écran (v2 : une seule façon de viser).
4. **Tir** : maintenir = viser sans tirer, relâcher = tirer. Pas de tap rapide, de visée manuelle ni de zone d'annulation (v2).
5. **Minimap v1** : tous les ennemis (points rouges), maisons et voitures. v2 : aucun ennemi.
6. **Soins** : le thé donne un gain de vitesse (v2 : c'est le rôle des dattes).
7. **Textes à retirer** : « COMMANDES — STYLE BRAWL STARS », « Booyah », « 10 JOUEURS », « 1 VS 9 BOTS », « /10 », « PORTRAIT OU PAYSAGE ».
8. **Hors ligne** : les polices viennent de Google (internet requis au premier chargement) et les fichiers `assets/manifest.webmanifest` et `assets/icon-192.png` n'existent pas dans le dépôt (l'installation comme appli ne marche pas).

## 6. Points de performance repérés (hypothèses, NON mesurées)

1. **Ombres floues sur le texte** (`shadowBlur`) : noms des combattants à l'écran, étiquettes d'armes, texte de visée. Coûteux sur mobile.
2. **Interface en HTML mise à jour à chaque image** : texte et barres de vie (une couleur de fond réécrite en continu), état du bouton de tir. Force le navigateur à recalculer l'affichage.
3. **Tableaux recréés à chaque image** (`fighters.filter(...)`, plusieurs fois par image).
4. **Minimap redessinée entièrement à chaque image** (208 × 208).
5. **Pas de plafond d'images** : chauffe et batterie sur un écran 120 Hz.
6. **Collisions par balayage complet** : sans problème à 10 combattants, **ne passera pas à 16 + lignes de vue + 3 600²** sans grille spatiale (déjà prévue dans ARCHITECTURE.md).
7. **Passage à la résolution réelle de l'écran** (densité jusqu'à 2) : le nombre de pixels à dessiner peut être multiplié par ~4. À mesurer au jalon M1.

Ces points sont des pistes. On ne corrige rien tant que la mesure n'a pas montré où est le vrai coût.

---

## 7. Mode de mesure : comment ça marche

**Outil : `perf-debug.js`**, un seul fichier. Il ne change aucune règle du jeu : il observe le temps entre deux images et le temps passé par le jeu à les calculer et les dessiner.

- Il s'accroche au rythme d'affichage du navigateur (`requestAnimationFrame`) sans toucher au code du jeu.
- Il affiche **une ligne en haut à droite**, en direct (images/s sur les 5 dernières secondes, pire image, nombre d'images au-dessus de 100 ms), et **4 petits boutons** : `S:` (change le nom du scénario), `RAZ` (remet à zéro), `RÉSUMÉ` (affiche le tableau pour la capture), `COPIER` (copie le résumé).
- **Résumé** : images/s moyen, fréquence de l'écran, durées des images (médiane, p95, p99, pire), images au-dessus de 33 ms et de 100 ms (par minute), temps JS par image, pauses, contexte du jeu (état, vivants, balles, phase de zone, temps), taille d'écran, densité de pixels, navigateur, mémoire, et un contrôle indicatif des **seuils v2**.
- **Options dans l'adresse** : `?rapide=1` accélère la zone ×4 pour tester la fin de partie (le résumé le signale) ; `?compte=1` compte les appels de dessin (légère surcharge : ne pas comparer les images/s de ce passage aux autres).

**Interprétation proposée** (à confirmer par ElMehdi) : « pires images ≥ 24 images/s » = **les 1 % d'images les plus lentes** (p99 de la durée d'image ≤ 41,7 ms). La pire image isolée est suivie à part (règle des 100 ms). **« Quelques fois par minute » = 3 au maximum.** Le « JS ≤ 20 ms » mesure le temps de calcul du jeu, pas celui du processeur graphique.

## 8. Protocole pour ElMehdi et Muse

### Mise en place (Muse, 10 minutes)
1. Créer le dossier `legacy/` dans le dépôt.
2. Y copier l'`index.html` actuel, **sans le modifier**, sous le nom `legacy/index_v1.html` (référence, intouchable).
3. Faire une 2e copie : `legacy/index_v1_mesure.html`. Y ajouter **une seule ligne**, juste après la ligne `<title>MarocBR Web Game</title>` :
   `<script src="perf-debug.js"></script>`
4. Ajouter `perf-debug.js` dans `legacy/`.
5. Publier, puis ouvrir la page de mesure sur un ordinateur : `<adresse du jeu>/legacy/index_v1_mesure.html`. Lancer une partie : la ligne de mesure doit s'afficher en haut à droite, et `RÉSUMÉ` doit montrer un tableau. **Le jeu lui-même doit se comporter comme avant.** Si ce n'est pas le cas, ne pas continuer, m'envoyer le problème.
6. Le `index.html` de la racine **n'est pas modifié**.

### Préparation du Redmi (ElMehdi)
- Batterie à plus de 50 %, **mode économie d'énergie désactivé** (il peut ramener l'écran de 120 à 60 Hz), luminosité moyenne, autres applis fermées, même Wi-Fi pour tous les passages.
- **Toujours le même navigateur.** Le résumé affiche « Chrome » et son numéro : s'il affiche « Chrome ? », c'est un autre navigateur, à noter.
- Téléphone en paysage, onglet neuf pour chaque scénario.

### Les 3 scénarios, adaptés à l'ancien jeu (10 combattants, pas de mode démo)

| Ordre | Scénario | Comment | Durée | À envoyer |
|---|---|---|---|---|
| 1 | **stress** (bouton `S:stress`) | Lancer un match, aller au **centre de la carte** (le pont central, là où les routes se croisent), appuyer sur `RAZ` en arrivant, puis se battre sans arrêt (viser/relâcher, ramasser, se soigner) | 60 s | capture du `RÉSUMÉ` |
| 2 | **match** (`S:match`) | Un match normal, `RAZ` juste après « GO ! », ouvrir `RÉSUMÉ` **juste avant de mourir** ou à la fin. Valable seulement s'il dure **au moins 3 minutes** (sinon recommencer et essayer de survivre) | jusqu'à 10 min | capture |
| 3 | **fin** (`S:fin`) | Ouvrir la page avec **`?rapide=1`** à la fin de l'adresse. Zone ×4 : tout le déroulé en environ 2 min 30. `RAZ` après « GO ! », `RÉSUMÉ` vers 2 minutes | 2 à 3 min | capture |
| 4 | **stress, 2e passage** (chauffe) | Refaire le scénario 1 **après avoir joué ~10 minutes d'affilée**, pour voir si le téléphone ralentit en chauffant | 60 s | capture |
| (5, facultatif) | stress + `?compte=1` | Même chose que le 1, avec **`?compte=1`** : compte les appels de dessin | 60 s | capture |

**Pour chaque capture** : la ligne « FPS moyen » et celles du dessous doivent être lisibles. Ajouter **une ligne de ressenti** : *fluide ? saccades ? le téléphone chauffe ?* Muse range les 4 captures dans le dépôt (`mesures/`) et note les résultats dans TACHES.md (version, scénario, FPS moyen, p99, pire image, ressenti).

### Ce qu'on fera des résultats
- Une **référence chiffrée** de l'ancien jeu (10 combattants) sur le Redmi, avec les images/s, les pires images et le temps de calcul.
- Savoir **si l'ancien jeu passe déjà les seuils v2** : si oui, on a de la marge. Sinon, les points de la partie 6 seront testés dans l'ordre pour trouver le vrai coût.
- Fixer au jalon M1 le **budget de temps** par image pour 16 personnages.

## 9. Limites de cette mesure

- L'ancien jeu a **10 combattants**, pas 16, et une carte de 3 000 : la référence n'est pas comparable à la v2, c'est un point de départ.
- On ne peut pas reproduire exactement la même partie d'un essai à l'autre (pas de graine fixe, pas de mode démo en v1) : les scénarios sont **indicatifs**. Le mode démo à graine fixe arrive avec les bots v2 (jalon M5).
- Le temps de calcul affiché est celui du **JavaScript**. Le coût du processeur graphique n'est pas mesuré, mais il se voit dans les images lentes.
- L'outil lui-même a été **testé dans un faux navigateur** (calculs et affichage du résumé), **pas encore sur le vrai Redmi** : le premier passage de Muse sur ordinateur est la vérification.

---
*M0 — relevé du 2026-11-13. Aucun code de jeu modifié. Fichiers : `M0_RELEVE.md`, `perf-debug.js`.*
