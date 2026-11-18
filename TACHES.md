# TACHES.md — MarocBR

*Mis à jour le 18 novembre 2026. L'ancienne version (7 tâches en anglais) est remplacée ; ce fichier est maintenant en français comme les autres documents.*

## Terminé
- [x] Révision 3 de DECISIONS.md validée par ElMehdi (13 novembre 2026)
- [x] Révision 4 de DECISIONS.md et ARCHITECTURE.md validées par ElMehdi (14 novembre 2026)
- [x] **Point 20 validé (15 novembre 2026)** : un buisson ne bloque ni la vue ni les dégâts ; **la discrétion reste** (un joueur dans un buisson est invisible au-delà de 180 unités, mesurées de contour à contour)
- [x] Langue : étiquettes en français + bandeaux en darija, sans réglage FR/darija
- [x] Test sur le Redmi de la version de mesure v1 : retours intégrés en révisions 3 et 4
- [x] **Dégâts des armes : +25 % confirmé par ElMehdi (18 novembre 2026)**, pas +30 % (DECISIONS §8)
- [x] **Couleur des portes : ROUGE (18 novembre 2026)**, à la place du cadre turquoise de la rév. 4 (DECISIONS §7). Rappels de la même date : 22 bots en Difficile par défaut et aucun dégât sans ligne dégagée, déjà dans la rév. 4

## En cours : jalon M0 (relevé et mesure)
- [ ] **ElMehdi** : refaire les 4 scénarios **en paysage** et envoyer les captures des panneaux **RÉSUMÉ** (stress, match, fin avec `?rapide=1`, stress après ~10 min de jeu). **Toujours en attente au 18 novembre.**
- [ ] **Muse** : mettre en ligne la nouvelle version de `perf-debug.js` (suivi des bots, 18 novembre) dans `legacy/`, et vérifier que la page hébergée sur muse.ai est bien `legacy/index_v1_mesure.html`
- [ ] **Muse** : ranger les captures dans `mesures/` et noter les résultats ici (version, scénario, FPS moyen, p99, pire image, ressenti)
- [ ] **ElMehdi** : retest du 18 novembre noté : les bots restent passifs (ne lootent pas, ne se battent pas). À vérifier avec la ligne « bots fixes X/Y » et la distance parcourue par bot dans le RÉSUMÉ

## Décisions en attente
- [ ] Héros : équilibrés (même statistiques) ou par personnage (la rév. 4 les garde équilibrés)
- [ ] Lien public du jeu : laisser public, repo privé ou lien peu connu
- [ ] Valeurs d'armes (tableau DECISIONS §8, +25 %) : relecture d'équilibrage par Gemini
- [ ] Liseré clair (blanc cassé) autour des portes rouges, pour qu'elles se distinguent des murs terracotta (DECISIONS §12 point 21). Proposition de Claude à valider
- [ ] Ordre des jalons : garder M1 → M9 tel quel, ou voir les bots plus tôt (arène de test + mode démo) ? Proposition de Claude à valider
- [ ] Gemini : mission d'essai (12 messages en darija + relecture du plan, 5 remarques maximum). Réponses à rapporter par ElMehdi, à relayer par Muse pour revue point par point

## Prochains jalons (ARCHITECTURE.md §12)
- [ ] M1 Squelette : découpage en fichiers, boucle à pas fixe, caméra 520, numéro de version. **Démarre sur feu vert d'ElMehdi** ; le critère de passage attend la référence M0
- [ ] M2 Contrôles, M3 Médina (base), M4 Bruit et visibilité, **M5 Bots**, M6 Armes et butin, M7 Zone et fin, M8 Finition Médina
- [ ] M9+ Cartes 2 et 3 (Vallée du Ksar, Kasbah des Sables) : seulement après la validation de la Médina

## Plus tard
- [ ] Version Unity quand ElMehdi aura un PC
- [ ] Multijoueur en ligne (Phase 3)
