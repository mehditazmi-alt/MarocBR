# TACHES.md — MarocBR

- [ ] ElMehdi: real-device test on Redmi — Brawl Stars hold-to-aim / release-to-shoot, movement, punch, city choice, cars
- [ ] ElMehdi: ask Gemini (in the Gemini app) for the trial mission, bring the answers back to Muse
- [ ] Muse: relay Gemini's trial answers to Claude for point-by-point review
- [ ] Decide: keep the 6 heroes all-balanced, or go back to per-character characteristics
- [ ] Decide: restrict the public game link (remove it / add a secret code / leave public)
- [ ] Decide: language — French labels + darija big messages, or a FR/Darija setting
- [ ] Later: Unity version when ElMehdi has a PC; online multiplayer in Phase 3

## M0 (2026-11-13) — relevé terminé, mesures à faire
- [x] Claude: relevé de l'ancien code (M0_RELEVE.md) + outil perf-debug.js ; DECISIONS.md v2 et ARCHITECTURE.md v2 validés par ElMehdi le 2026-11-13
- [x] Muse: legacy/ créé (index_v1.html = copie intouchable de l'ancien jeu, index_v1_mesure.html = copie + perf-debug.js, index.html racine non modifié)
- [ ] ElMehdi: protocole M0 sur le Redmi (legacy/index_v1_mesure.html) — 4 captures de RÉSUMÉ (stress 60 s, match ≥ 3 min, fin avec ?rapide=1, stress 2e passage après ~10 min) + une ligne de ressenti par scénario ; Muse les range dans mesures/
- [ ] ElMehdi: confirmer l'interprétation « pires images ≥ 24 images/s » = p99 ≤ 41,7 ms (règle des 100 ms à part, max 3 dépassements/min) — proposée par Claude, pas encore décidée
- [ ] ElMehdi: confirmer les 3 points que Claude a considérés comme validés avec le document (§12) : 4 villes remplacées par les 3 cartes, minimap sans ennemis, 3 emplacements d'armes + gilet à deux niveaux
- [ ] ElMehdi: d'où vient le « 131 » de la vitesse ? (M0 : 212 × 0,62 = 131,4 = vitesse en rivière)
