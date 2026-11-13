# DECISIONS.md — MarocBR (source de vérité) — VERSION 2

**Statut : VALIDÉ par ElMehdi le 13 novembre 2026 (version 2, révision 2). Source de vérité du projet.**
Remplace la v1 depuis cette validation.
Règle : on ne modifie pas une règle validée sans l'accord d'ElMehdi. Ce qui n'est pas écrit ici n'est pas décidé.

Légende : **[VALIDÉ]** décidé par ElMehdi · **[ACCEPTÉ]** proposé par Claude, relu par ChatGPT, retenu · **[À RÉGLER]** valeur de départ, à ajuster par des tests sur le Redmi · **[À CONFIRMER]** point ouvert, voir section 12.

---

## 1. Le jeu

- Jeu web 2D vu du dessus (HTML5 / JavaScript / Canvas), **hors ligne**. Version Unity plus tard, quand ElMehdi aura un PC. Multijoueur en ligne en Phase 3. **[VALIDÉ]**
- **16 participants** : 1 humain (ElMehdi) + **15 bots ennemis**. Brief d'ElMehdi : 15 joueurs ennemis. (v1 : 9 bots.) **[VALIDÉ]**
- Style de jeu inspiré de Brawl Stars (visée automatique en maintenant, tir au relâchement, sélection d'arme simple et rapide), **sans reprendre aucun nom, logo ni icône** d'un autre jeu. **[VALIDÉ]**
- Orientation : **paysage uniquement, verrouillé**. En portrait, le jeu se met en pause et demande de tourner le téléphone. **[VALIDÉ]**
- On démarre les mains nues (poings). Le butin est au sol, dans des caisses ou dans des maisons ouvertes. Un joueur éliminé laisse tomber son arme. **[VALIDÉ, repris de la v1]**
- Héros : 6 personnages chibi « style Dofus », équilibrés, mêmes statistiques, seule l'apparence change : Salma, Omar, Lina, Rayan, Nour, Adam. (Yassine retiré le 2026-11-11.) **[VALIDÉ v1, rouvert dans TACHES.md : voir section 12]**

## 2. Chronologie du match et de la zone **[VALIDÉ]**

**Les 10 minutes sont le moment où commence la dernière phase, pas un chronomètre de fin.** Le match se termine quand il ne reste qu'un survivant. Durée réelle visée : **entre 10 et 11 min 30**. Rythme de 2 minutes conservé.

| Phase | Avertissement (30 s avant) | Début du rétrécissement | Fin (15 s plus tard) | Rayon à la fin | Dégâts/s hors zone |
|---|---|---|---|---|---|
| 1 | 1:30 | 2:00 | 2:15 | 68 % | 1 |
| 2 | 3:30 | 4:00 | 4:15 | 44 % | 2 |
| 3 | 5:30 | 6:00 | 6:15 | 26 % | 4 |
| 4 | 7:30 | 8:00 | 8:15 | 13 % | 6 |
| 5 | 9:30 | 10:00 | 10:15 | 4 % | 10 |
| Cercle final | — | 10:15 | 11:00 | de 4 % à 0 %, lentement | 10 |

- **Rayons en pourcentage du rayon de départ.** Le rayon de départ est la demi-diagonale de la carte : toute la carte est dans la zone au début. Ainsi, le même tableau marche pour des cartes de formes différentes ; chaque carte déclare ses rayons en % dans son fichier.
- Le **nouveau cercle est toujours entièrement à l'intérieur de l'ancien**, à une **position aléatoire** : **le centre n'est pas fixe** (il est tiré au hasard dans la limite autorisée).
- **Pendant l'avertissement de 30 s** : bandeau (darija), prochain cercle affiché sur la carte et la minimap, flèche au bord de l'écran vers le centre sûr si le joueur est dehors.
- **Pendant les 15 s de rétrécissement** : bandeau rouge « zone en mouvement » (darija), bord d'écran qui pulse en rouge, alerte sonore, vibration si le navigateur l'autorise.
- **Les dégâts de zone ignorent le gilet** (il ne protège que des balles).
- **À 11:00, le cercle vaut 0** : tout le monde est hors zone et meurt en environ 10 s. Fin maximale : environ 11 min 10 à 11 min 30 (plus si quelqu'un se soigne).
- **Égalité** (deux morts à la même image) : gagne celui qui avait le plus de PV juste avant ; si égalité, tirage au sort.
- Quand le joueur meurt : écran « Éliminé », rang (#N sur 16), nombre d'éliminations, boutons Rejouer / Quitter.

## 3. Contrôles **[ACCEPTÉ, à valider par des tests]**

- **Un joystick flottant** à gauche (apparaît là où le pouce se pose, moitié gauche de l'écran). Déplacement.
- **Un seul bouton de tir** à droite, trois gestes :
  - **Tap** (appui de moins de 0,25 s, avec moins de ~12 px de glissement) : tir automatique sur la meilleure cible ; sans cible, tir dans la direction du regard.
  - **Tenir sans glisser** : verrouillage automatique de la meilleure cible (anneau autour d'elle). Rien n'est tiré tant qu'on n'a pas relâché. **Relâcher tire.**
  - **Tenir + glisser** (plus de ~12 px) : visée manuelle, ligne de visée de la longueur de la portée de l'arme. Relâcher tire ; **ramener le pouce au centre annule**.
- **Annulation** : ramener le pouce dans la zone d'annulation, centrée sur le bouton, **annule le tir** : ligne grise avec une croix, rien ne se tire, **aucune munition consommée, pas de cooldown**. Aucune action involontaire.
- **Seuil tap / maintien : 0,25 s** et **distance de glissement minimale : environ 12 pixels** : **[À RÉGLER]**, un seul réglage dans `config.js`. À tester avec **au moins 5 personnes autres que le développeur**.
- Il n'y a **plus de visée par glissement sur la moitié droite de l'écran** : une seule manière de viser.
- **Pas de bouton Dash.**
- **Doigts indépendants** : chaque doigt reçoit un rôle (déplacement, tir, boutons) quand il se pose et le garde jusqu'à ce qu'il se lève.
- **Interruptions** (appel, notification, changement d'appli, rotation, événement tactile annulé) : le jeu remet tous les doigts à zéro, annule les actions en cours et se met en pause. Aucun doigt « fantôme ».
- **Ramassage automatique** en marchant sur l'objet. Si les 3 emplacements d'armes sont pleins, un petit bouton « Échanger » apparaît. **Rechargement automatique** (petite barre sous le personnage).
- **3 emplacements d'armes** (petites icônes rondes). Un tap change d'arme (0,25 s). Les poings sont toujours disponibles et ne prennent pas d'emplacement. (v1 : 2 armes.)
- **Chaque relâchement tire une salve courte** (comme les attaques de Brawl Stars), pas de tir continu. **[À CONFIRMER par test]** pour les armes automatiques.
- **Choix de la cible** : seulement les ennemis **visibles et à portée** (jamais à travers un mur). Priorité : le plus proche de la ligne de visée, puis le plus proche en distance. La cible est gardée environ 0,3 s.
- Aimant de visée selon l'arme : voir section 8.
- Options : mode gaucher, légère vibration quand on touche une cible.

## 4. Unités et caméra **[ACCEPTÉ]**

- **Une seule unité de jeu** (« unité du monde ») pour toutes les distances : sons, portées d'armes, vitesses, buissons.
- **La caméra montre une hauteur fixe de 520 unités**, sur tous les téléphones. `zoom = hauteur de l'écran en pixels / 520`. La largeur visible dépend du format (environ 924 unités en 16:9, 1 155 en 20:9).
- **L'interface se mesure séparément**, en pourcentage de la hauteur de l'écran.
- **Vitesse du joueur : à confirmer, mesurée au jalon M0 puis réglée par des tests de sensation (jalon M2).** Décision d'ElMehdi du 13 novembre 2026. Aucune valeur n'est décidée (131 demandée par ElMehdi, ~190 suggérée par Claude). Relevé de l'ancien code : 212 unités du monde par seconde (voir `M0_RELEVE.md`).

## 5. Les 15 bots **[ACCEPTÉ]**

- **Profils** (15 bots) : 4 **Fonceurs**, 6 **Prudents**, 5 **Tireurs**. La personnalité se voit dans les **décisions**, pas seulement dans la précision.
  - **Fonceur** : chemin le plus court, traverse les espaces ouverts, poursuit, soigne peu.
  - **Prudent** : longe les murs, se soigne avant de ramasser, refuse un combat à armement inégal, se replie sous 40 % de vie.
  - **Tireur** : cherche les lieux à longue vue, recule pour garder la distance, utilise les couverts et le fusil de précision.
- **Paramètres par bot** : précision (35 à 65 %), temps de réaction (0,4 à 0,8 s), seuil de fuite, portée d'écoute. Trois niveaux de difficulté (Facile / Normal / Difficile) modifient précision et réaction. **[À RÉGLER]**
- **Hiérarchie de décisions**, de la plus forte à la plus faible : (1) survivre à la zone, (2) vie critique : fuir et soigner, (3) combat, (4) enquêter sur un bruit, (5) butin, (6) se placer pour la prochaine zone. Un événement prioritaire interrompt toujours une activité moins prioritaire. Un état dure au moins 0,8 s, sauf urgence (dégâts reçus).
- **Les bots ne trichent pas** : ils voient et entendent avec les mêmes règles que le joueur. Ils vont vers l'endroit d'où vient un bruit, pas vers la position exacte de l'ennemi. Ils donnent les mêmes commandes que le joueur.
- **Performance** : les 15 bots sont **tous simulés pleinement** au départ, avec décisions toutes les 0,2 s (pas à chaque image). **Plan B** seulement si le test de performance échoue : simulation simplifiée des bots lointains, sans téléportation (même position, même vie, même état), passage progressif à la simulation complète avec deux seuils (entrée à 1 500, sortie à 1 800 unités). Les duels entre bots lointains durent plusieurs secondes et font du bruit.
- **Rythme de survie** (objectif, **jamais une règle**, aucune élimination n'est forcée) : environ 14 vivants à 2:00, 11 à 4:00, 8 à 6:00, 4 à 8:00, 2 ou moins à 10:00. Mesuré sur beaucoup de parties en **mode démo** (bots seuls, graine aléatoire fixe pour rejouer le même match).
- Contrôles automatiques en mode démo : aucun bot plus rapide que sa vitesse maximale ; chaque perte de vie a une cause enregistrée ; chaque élimination dans la zone d'écoute produit un son ou une ligne dans le fil des éliminations.
- Prénoms de bots marocains : liste à demander à Gemini.

## 6. Visibilité et bruits de pas **[VALIDÉ + ACCEPTÉ]**

**Les ennemis ne sont JAMAIS affichés sur la minimap.** Dans le monde, ils ne sont visibles que s'il y a une ligne de vue dégagée. Les bruits de pas servent de radar.

Trois systèmes séparés : (1) la **minimap** (aucun ennemi), (2) la **vision réelle** dans le monde (ligne de vue), (3) la **distance de dessin** (ce qu'on affiche hors écran).

- Un ennemi est caché derrière un mur, dans une maison au toit fermé, dans un buisson, ou derrière un fumigène.
- **Portée des bruits** (en unités du monde) **[À RÉGLER]** :

| Action | Portée |
|---|---|
| Immobile | 0 (silence total) |
| Marche lente (joystick à moins de 50 %) | 350 |
| Course | 700 |
| Voiture | 1 000 |
| Ouverture d'une caisse | 400 |
| Tir | 1 100 |
| Tir à l'arbalète, poignard | 0 (silencieux) |

- **Volume** : décroissance progressive avec la distance. Le son est déplacé gauche/droite selon la direction. Un mur entre les deux **étouffe** le son (volume réduit, son plus sourd).
- **Sol** : pierre ×1,3, sable ×0,6, intérieur de maison ×0,8 (multiplicateurs de portée). Eau : bruit plus fort. Dunes : étouffent les pas. Valeurs précises dans le tableau commun des surfaces.
- **On n'entend que les 3 sons les plus forts à la fois.** Un son n'en remplace un autre que s'il est au moins 15 % plus fort, et chaque son garde sa place au moins 0,4 s.
- **Flèches de bruit à l'écran : actives par défaut, désactivables dans les réglages.** Petites flèches discrètes au bord de l'écran dans la direction du bruit. Légère vibration pour les bruits très proches. **[VALIDÉ]**
- **Coups de feu** audibles (portée 1 100) avec une flèche brève. **[À CONFIRMER par test]**
- **Buissons** : un joueur dans un buisson est invisible, sauf à moins de **180 unités mesurées de contour à contour** (pas de centre à centre). Entrée et sortie avec un fondu de 0,2 s. On l'entend quand même.
- **Option par carte** : une limite de vision indépendante des obstacles, à comparer à la vision par ligne de vue (surtout sur la Kasbah des Sables).
- **Sons générés par le navigateur** (Web Audio), pas de fichiers sous licence. L'audio ne démarre qu'après le premier appui sur « Jouer ».

## 7. Cartes **[VALIDÉ + ACCEPTÉ]**

**Règle : les cartes 2 et 3 ne commencent qu'après que la Médina a passé le test de performance ET que ElMehdi l'a validée en jeu.**

**Obstacles (4 types)** : mur plein (bloque déplacements et balles) · couvert bas (bloque déplacements et balles, contournable) · buisson (voir section 6) · eau (ralentit de 25 %, bruit plus fort).

### Carte 1 — Médina d'Ambre (carte de référence)
- **Taille de départ : 3 600 × 3 600** (la v1 faisait 3 000 × 3 000). Agrandie à 4 800 × 4 800 **seulement si les tests montrent une carte trop serrée.** La taille est un paramètre.
- **~16 maisons praticables, ~90 objets de butin**, 3 voitures, une avenue en anneau, des zones de buissons.
- Quartiers : **Souk central** (ruelles étroites, combat rapproché) · **Kasbah** au nord (fort aux murs épais, une entrée principale) · **Quartier des tanneurs** à l'ouest (grands bacs colorés comme obstacles) · **Palmeraie et oasis** à l'est (buissons, embuscades) · **Dunes et ruines** au sud (terrain ouvert, longue distance) · **Place des Conteurs** (carrefour dangereux).
- Les bâtiments sont inventés : **pas de mosquée ni de lieu sacré.**

### Carte 2 — Vallée du Ksar (village de l'Atlas) — après la carte 1
- Carte haute et étroite : **3 000 × 6 400**. Lisibilité de la caméra et limites de déplacement à tester sur téléphone.
- Rivière du nord au sud (ralentit de 25 %, double presque le bruit des pas), **6 passages** : 2 ponts, 3 gués, 1 passage étroit. Village en 3 terrasses reliées par 5 rampes, visibles sur la minimap (relief statique).
- Falaises : bloquent les déplacements mais pas les balles. Au nord, forêt de cèdres (buissons) et grenier fortifié ; au sud, petit marché. Départs : 6 au nord, 4 au milieu, 6 au sud.

### Carte 3 — Kasbah des Sables (désert) — après la carte 1
- Carte très ouverte : **4 400 × 4 400**. Kasbah ronde au centre (mur extérieur à 4 portes, couloir circulaire, 4 tours, puits central avec le meilleur butin), 6 petites oasis autour.
- Arcs de dunes de formes variées (ralentissent de 20 %, étouffent les pas), rangées de rochers, ruines intermédiaires, environ 12 cabanes, beaucoup de caisses. Longues lignes de vue : fusil de précision et arbalète valorisés.

### Idées en plus
- **Mirage** (Kasbah) : décor visuel seulement, plus tard. **[ACCEPTÉ]**
- **Volets du souk** (Médina) : **reportés**, pas avant que la Médina soit stable (changements toujours annoncés par animation et son).
- **Canal d'irrigation** (Ksar) : **refusé pour l'instant**, gardé dans la liste d'idées.

**Moteur unique** : les trois cartes utilisent le même moteur ; chacune est un fichier de données avec **les mêmes rubriques** : taille, obstacles, surfaces, maisons, points de butin, points de départ, véhicules, rayons de zone en %, option de limite de vision (détail dans ARCHITECTURE.md). Les surfaces (rivière bruyante, dunes silencieuses, eau…) sont dans **un tableau partagé**. Une mécanique propre à une carte devient un **type générique** du moteur, jamais un cas particulier. Une vérification automatique au chargement affiche les erreurs à l'écran.

## 8. Armes et butin **[ACCEPTÉ ; valeurs [À RÉGLER]]**

Style cartoon, sans sang (étincelles à l'impact). **Ce tableau n'a pas encore été relu pour l'équilibrage : Gemini le relit** (équilibrage seulement, sans code). ChatGPT a refusé cette relecture.

| Arme | Dégâts | Portée | Cadence | Munitions | Aimant | Particularité |
|---|---|---|---|---|---|---|
| Poings | 9 | 80 | 0,35 s | aucune | cible la plus proche (< 80) | tout automatique |
| Poignard (khanjar) | 22 | 70 | 0,5 s | aucune | idem | silencieux |
| Pistolet | 18 | 450 | 0,5 s | légères | ±20° | 1 tir |
| Mitraillette (SMG) | 5 × 7 | 380 | 0,7 s | légères | ±20° | rafale de 5 |
| Fusil d'assaut | 3 × 14 | 650 | 0,8 s | moyennes | ±15° | rafale de 3 |
| Fusil à pompe | 6 × 8 | 260 | 0,9 s | cartouches | ±35° | éventail de 40° |
| Fusil de précision (sniper) | 60 | 1 100 | 1,6 s | lourdes | ±8° | perforant (traverse les cibles) |
| Arbalète | 30 | 700 | 0,9 s | flèches | à définir | silencieuse |

- **Objets lancés** (4e petit bouton, visée par glissement) : **grenade** (50 dégâts, rayon 120) et **fumigène** (bloque la vue 6 s).
- **Raretés** : Commun / Rare / Épique : +0 / +12 % / +25 % de dégâts et +0 / +20 % / +40 % de munitions. Contour de couleur autour de l'icône.
- **Soins et protection** : bandage +25 PV ; **thé à la menthe** +50 PV sur quelques secondes ; dattes +10 PV et petit gain de vitesse 5 s ; trousse de soin (rare, soin complet, interrompue si touché) ; **gilet** niveau 1 (−20 % de dégâts) et niveau 2 (−35 %). (v1 : un gilet à −30 %.)
- **Limites de transport** : 2 chargeurs par type de munitions, 5 bandages, 3 thés.
- **Quantité de butin** : **~90 objets sur la Médina** (3 600², décision d'ElMehdi). Le repère de **~150 objets** valait pour une carte de 4 800² ; pour le Ksar et la Kasbah (environ 1,5 fois la surface de la Médina), de l'ordre de 130 à 150, à fixer à leur création. **[VALIDÉ]**
- **Butin de la Médina (~90 objets)**, répartition indicative : ~30 au sol (surtout commun), ~20 caisses (plus de rare), ~32 dans les maisons (soins, gilets), ~5 coffres de quartier riche (épique), plus **2 ravitaillements parachutés par match**, annoncés sur la minimap 20 s avant (le seul repère visible de tous), avec une arme épique et un gilet niveau 2. Les caisses s'ouvrent en restant à côté environ 1 s (anneau de progression). Les maisons s'ouvrent : porte, toit transparent à l'intérieur, murs qui bloquent déplacements et balles.
- **Ordre de réalisation** : d'abord les 6 armes de base (poings, pistolet, mitraillette, fusil d'assaut, pompe, précision), puis arbalète, poignard, grenades, fumigènes.

## 9. Interface (HUD épuré, esprit Brawl Stars) **[VALIDÉ + ACCEPTÉ]**

**Six éléments permanents seulement** :
1. **Minimap** en haut à gauche (~20 % de la hauteur) : le joueur, le cercle de zone actuel, le prochain cercle, les repères de quartiers, le ravitaillement. **Aucun ennemi.** (v1 : la minimap montrait aussi butin, caisses et maisons : retiré en v2, voir section 12.)
2. **Une pastille** en haut au centre : 👥 survivants et ☠ éliminations.
3. **Pause**, petite, en haut à droite, loin des pouces.
4. **Bouton de tir** en bas à droite.
5. **3 emplacements d'armes** (icônes rondes) et **1 bouton de soin**, près du bouton de tir.
6. **Joystick** invisible tant qu'on ne touche pas l'écran (un cercle discret au tout premier match seulement).

- **Au-dessus du personnage** : barre de vie (gilet en bleu) et barre de munitions. Pas de chiffres de santé.
- **Seulement quand c'est utile** : message de ramassage (1,5 s), anneau de progression d'une caisse, bandeaux de zone, flèches de pas, direction d'un coup reçu, bord rouge quand la vie est basse. Fil des éliminations limité à 2 lignes qui disparaissent après 4 s.
- **Supprimé** : barres de stats des héros, longs textes, doublons de santé, panneau du bas, guide permanent (déplacé derrière un bouton « Aide »).
- **Tailles** en pourcentage de la hauteur de l'écran (joystick ~20 %, bouton de tir ~15 %, emplacements ~7 %, texte minimum ~3,2 %) **[À RÉGLER]**. Zones sûres autour de l'encoche. À tester sur 3 formats : 6", 6,5" et écran étroit.
- **Aucune mention d'un autre jeu à l'écran.** « Brawl Stars » et « Booyah » sont retirés de tous les textes visibles. **[VALIDÉ]**
- **Langue** : étiquettes en **français**, **grands messages (bandeaux) en darija**. Pas de réglage FR/darija. **[VALIDÉ]**
- **Victoire** : grand bandeau en darija « **RBE7TI !** » (étiquette « Victoire »). Les autres textes darija (zone dans 30 s, zone en mouvement, éliminé…) viennent de la mission d'essai de Gemini, jugés par ElMehdi. **[ElMehdi décide du texte final]**

## 10. Performance et méthode **[ACCEPTÉ]**

- **Objectif : moyenne ≥ 30 images/s sur le Redmi, pires images ≥ 24 images/s**, aucune image à plus de 100 ms plus de quelques fois par minute, **cible de 20 ms ou moins par image** (pour garder de la marge). Plafond à 60 images/s pour économiser la batterie sur un écran 120 Hz. **ElMehdi teste sur son Redmi et envoie des captures d'écran** du résumé de chaque scénario.
- **Mode debug** (activé par un paramètre dans le lien) : FPS moyen, pire image, objets dessinés, calculs de ligne de vue par seconde.
- **Trois scénarios à chaque étape** : *stress* (16 personnages à moins de 600 unités, zone dense, tirs) · *match complet* (10 min en mode démo, graine fixe) · *fin de match* (rétrécissement avec beaucoup d'effets). Plus un **test de durée** (un match après 10 minutes de jeu, pour la chauffe et la mémoire).
- **Aucune étape n'est validée tant qu'elle ne passe pas ces tests.** Pas de promesse.
- **Ordre de travail** : (1) DECISIONS.md v2 validé → (2) ARCHITECTURE.md validé → (3) mesure de performance (jalon M0, voir `M0_RELEVE.md`) → (4) contrôles → (5) Médina d'Ambre, avec le **mode démo** (bots seuls, graine fixe) → (6) tests → (7) seulement ensuite les cartes 2 et 3.
- **Numéro de version** affiché dans le jeu et en haut du code. Une ligne dans TACHES.md à chaque mise à jour (date, version, ce qui change).
- **Découpage du code** en plusieurs fichiers : voir ARCHITECTURE.md. L'ancien `index.html` est conservé dans `legacy/` pour comparer.
- **Pas de simulation de duel ni de téléportation** pour économiser la performance, sans validation d'ElMehdi.

## 11. Équipe

- **ElMehdi** : chef de projet, game design, tests sur son téléphone, dernier mot.
- **Muse** : intermédiaire entre ElMehdi et les IA, coordination, fichiers, mise en ligne, retours de test. ElMehdi ne parle qu'à Muse, **sans copier-coller**. Muse recopie les fichiers validés dans le dépôt et peut simuler différents écrans et ralentir le processeur sur son ordinateur.
- **Claude** : seul codeur et architecte. **Une seule personne écrit le code.** Claude ne peut ni écrire sur GitHub ni lancer le jeu.
- **Gemini** : créatif et relecteur uniquement (textes en darija, noms de lieux et de bots, ambiances sonores, relecture sans réécrire le fichier, recherche). **À l'essai depuis le 2026-11-11.** Mission d'essai : (1) 12 messages du jeu en darija, en lettres latines, avec le français à côté ; (2) relecture du plan A–I, 5 remarques maximum, sans code. Il relit aussi le tableau des armes (équilibrage seulement). ElMehdi juge le darija ; Claude répond « accepté » ou « refusé » à chaque remarque. Définitif seulement si l'essai se passe bien.
- **ChatGPT** : relecteur technique, ne code pas. A relu la proposition v2 le 2026-11-12. A refusé de relire l'équilibrage des armes.
- **Désaccords** : chacun écrit ses arguments en quelques lignes ; ElMehdi tranche sur le jeu ; on tranche la technique par un **test** sur le Redmi.

## 12. Points ouverts et décisions

1. **Les 4 villes du lobby** (Fès, Casablanca, Marrakech, Tanger) : c'étaient 4 recolorations de la même carte. Elles sont **remplacées par les 3 cartes** de la section 7 (leurs noms peuvent inspirer des quartiers). **→ Validé avec le document (2026-11-13).**
2. **Minimap** : la v1 montrait butin, caisses et maisons. La v2 ne montre que la zone, les repères de quartiers et le ravitaillement. **→ Validé avec le document (2026-11-13).**
3. **Héros** : la v1 les valide équilibrés (même statistiques) ; TACHES.md rouvre la question. **Reste ouvert** : on garde équilibrés tant qu'ElMehdi n'a pas tranché.
4. **Lien public du jeu** : laisser public, repo privé (Claude ne pourrait plus lire le code par lien, Muse devrait le coller), ou lien peu connu. Un code secret écrit dans le jeu ne protège pas, car le code est public. **Reste ouvert** (TACHES.md).
5. **3 emplacements d'armes** (v1 : 2) et **gilet à deux niveaux** (v1 : un gilet à −30 %). **→ Validé avec le document (2026-11-13).**
6. **Valeurs d'armes** : provisoires, en attente de la relecture de Gemini. **Reste ouvert.**
7. **Quantité de butin** : **tranché par ElMehdi (2026-11-13)** : environ **90 objets sur la Médina** (3 600²), **130 à 150 sur le Ksar et la Kasbah**.
8. **Vitesse du joueur** : **tranché par ElMehdi (2026-11-13)** : « à confirmer ». Mesurée au jalon M0, puis réglée par des tests de sensation. Aucune valeur n'est décidée.

## 13. Hors du périmètre actuel

Pas de multijoueur, de comptes, de boutique, d'achats intégrés, de modes équipe, de classement, de saisons, de 3D, d'assets d'autres jeux. Le canal d'irrigation et les volets du souk sont reportés. Pas de publication sur les stores avant la version Unity.

## 14. Leo et Lumi (autre projet, même équipe)

- Série YouTube pour enfants, 5 saisons × 10 épisodes, 9 scènes de 10 s par épisode. S1E1 V3 : scènes 1 à 6 générées ; scènes 7 à 9 écrites, pas encore générées.
- Verrou de continuité : chaque scène commence exactement là où la précédente s'est terminée. Uniquement les dialogues français écrits, aucun dialogue ni personnage inventé.

---
*v2 (révision 2) — validé par ElMehdi le 2026-11-13. Remplace la v1.*
