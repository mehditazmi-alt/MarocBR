# DECISIONS.md — MarocBR (single source of truth)

Decisions validated by ElMehdi. Do not change a validated rule without his agreement.

## Game
- 2D top-down web game (HTML5/JavaScript), 1 player vs 9 bots, offline V1. Unity later, when ElMehdi has a PC.
- Match: 10 minutes, zone shrinks every 2 minutes, warning 30 s before, shrink lasts 15 s. 5 phases. Game ends only when one survivor remains.
- Map: 3000x3000, 4 city choices in the lobby — Fès (old medina), Casablanca (modern city / corniche), Marrakech (red medina / palms), Tanger (port / sea).
- Start bare-handed (fists only). Loot on the ground, in crates (20) or in open houses (8). Max 2 carried weapons + fists. Killed enemy drops its weapon.
- Weapons: Pistolet, Fusil, Pompe, Sniper. Heals: bandage (+25), mint tea / atay (+50). Vest (-30% damage). Ammo.
- Heroes: 6 Dofus-style chibi heroes, balanced, same stats, only appearance differs — Salma, Omar, Lina, Rayan, Nour, Adam. (Yassine removed 2026-11-11.)
- Controls (Brawl Stars style): one movement joystick (left thumb); hold TIRER = auto-aim locks on the nearest enemy, NO shot fired; release TIRER = one shot, auto-aimed at the nearest enemy. Fists punch is visible when unarmed.
- 3 cars on the map as solid obstacles. Loot, crates, houses and zone shown on the minimap.
- Language: French labels, darija for big messages.

## Team
- ElMehdi: project lead, game design, tests on his phone, last word.
- Muse: intermediary between ElMehdi and Claude, coordination, files, test feedback. ElMehdi talks only to Muse — no copy-paste by him.
- Claude: sole coder and architect. Only one person writes the code.
- Gemini: creative and reviewer only (darija texts, place names, sound/ambiance ideas, independent code/plan review without rewriting the file, research). Accepted ON TRIAL 2026-11-11. Trial mission: (1) translate 12 game messages into Latin-script darija with French beside each; (2) review plan A–I, max 5 remarks ranked by importance, reason + solution idea in words, no code. ElMehdi judges the darija; Claude answers each remark accepted/refused. Permanent only if the trial goes well.

## Leo and Lumi (separate project, same team)
- Children's YouTube series, 5 seasons x 10 episodes, 9 scenes x 10 s per episode. S1E1 V3 scenes 1–6 generated; scenes 7–9 scripted, not yet generated.
- Continuity lock: each scene starts exactly where the previous ended. Only the exact scripted French dialogue, no invented dialogue or characters.
