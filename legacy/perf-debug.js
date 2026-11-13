/* =====================================================================
   perf-debug.js — MarocBR, jalon M0 : mesure de performance
   Ce fichier MESURE seulement. Il ne change aucune règle du jeu.
   (Seule exception, et seulement si l'adresse contient ?rapide=1 : il
   accélère la zone x4 pour tester la fin de partie. Le résumé l'indique.)

   Branchement : une seule ligne dans le <head> de la COPIE de mesure :
       <script src="perf-debug.js"></script>
   Options dans l'adresse :  ?rapide=1   zone accélérée x4
                             ?compte=1   compte aussi les appels de dessin
   ===================================================================== */
(function () {
  "use strict";

  var CAP = 40000;                      // images gardées (environ 11 min à 60/s)
  var SCEN = ["stress", "match", "fin", "libre"];
  var scenIdx = 0;
  var S = null;                         // la mesure en cours
  var longTasks = 0;
  var rapide = /[?&]rapide=1/.test(location.search);
  var compte = /[?&]compte=1/.test(location.search);
  var calls = { total: 0, texte: 0 };

  /* ---------- 1. la mesure ---------- */
  function nouvelle() {
    S = {
      t0: performance.now(), last: null, n: 0,
      iv: new Float32Array(CAP), cost: new Float32Array(CAP),
      over33: 0, over100: 0, costOver20: 0, pauses: 0,
      maxIv: 0, maxCost: 0, sumIv: 0, sumCost: 0,
      longBase: longTasks, callsBase: calls.total, texteBase: calls.texte
    };
  }

  function record(ts, c0, c1) {
    var cost = c1 - c0;
    if (S.last !== null) {
      var iv = ts - S.last;
      if (iv > 1000) {                  // page cachée ou pause : pas une image
        S.pauses++;
      } else {
        if (S.n < CAP) { S.iv[S.n] = iv; S.cost[S.n] = cost; }
        S.n++;
        S.sumIv += iv; S.sumCost += cost;
        if (iv > S.maxIv) S.maxIv = iv;
        if (cost > S.maxCost) S.maxCost = cost;
        if (iv > 33.4) S.over33++;
        if (iv > 100) S.over100++;
        if (cost > 20) S.costOver20++;
      }
    }
    S.last = ts;
  }

  function stocked() { return Math.min(S.n, CAP); }

  function percentile(sorted, p) {
    if (!sorted.length) return 0;
    var i = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
    return sorted[i];
  }

  function sortedCopy(arr, n) {
    var a = Array.prototype.slice.call(arr, 0, n);
    a.sort(function (x, y) { return x - y; });
    return a;
  }

  function f1(x) { return x.toFixed(1).replace(".", ","); }

  /* ---------- 2. affichage en direct (5 dernières secondes) ---------- */
  function live() {
    var n = stocked(), sum = 0, count = 0, worst = 0, i;
    for (i = n - 1; i >= 0 && sum < 5000; i--) {
      sum += S.iv[i]; count++;
      if (S.iv[i] > worst) worst = S.iv[i];
    }
    if (!count) return "mesure en attente…";
    var fps = 1000 / (sum / count);
    return "FPS " + Math.round(fps) + "  pire " + Math.round(worst) + " ms  >100ms: " + S.over100;
  }

  /* ---------- 3. contexte du jeu (lu seulement) ---------- */
  function contexteJeu() {
    try {
      var w = window, p = [];
      if (typeof w.state !== "undefined") p.push("état " + w.state);
      if (w.fighters && w.fighters.length) {
        var a = 0, j;
        for (j = 0; j < w.fighters.length; j++) if (w.fighters[j].alive) a++;
        p.push("vivants " + a + "/" + w.fighters.length);
      }
      if (w.bullets) p.push("balles " + w.bullets.length);
      if (typeof w.zonePhase !== "undefined") p.push("zone phase " + (w.zonePhase + 1) + " (" + w.zoneMode + ")");
      if (typeof w.matchTime === "number") p.push("t=" + Math.round(w.matchTime) + " s");
      return p.length ? p.join(" | ") : "n/a";
    } catch (e) { return "n/a"; }
  }

  /* ---------- 4. le résumé (pour la capture d'écran) ---------- */
  function resume() {
    var n = stocked();
    if (n < 10) return "Pas assez d'images mesurées.\nJoue quelques secondes puis rouvre le résumé.";
    var ivs = sortedCopy(S.iv, n), css = sortedCopy(S.cost, n);
    var dur = (performance.now() - S.t0) / 1000;
    var avgFps = 1000 / (S.sumIv / S.n);
    var p05 = percentile(ivs, 0.05), p50 = percentile(ivs, 0.5), p95 = percentile(ivs, 0.95), p99 = percentile(ivs, 0.99);
    var hz = [30, 48, 60, 90, 120], best = 60, bd = 1e9, k;
    for (k = 0; k < hz.length; k++) { var d = Math.abs(1000 / p05 - hz[k]); if (d < bd) { bd = d; best = hz[k]; } }
    var perMin = S.over100 / Math.max(dur / 60, 1 / 60);
    var jsAvg = S.sumCost / S.n;
    var c = document.getElementById("game");
    var ua = navigator.userAgent, m = /Chrome\/(\d+)/.exec(ua);
    var mem = (performance && performance.memory) ? Math.round(performance.memory.usedJSHeapSize / 1048576) + " Mo" : "n/a";
    var p99fps = 1000 / p99;

    var ok1 = avgFps >= 30, ok2 = p99fps >= 24, ok3 = perMin <= 3, ok4 = jsAvg <= 20;
    function v(x) { return x ? "OK" : "NON"; }

    var L = [];
    L.push("=== MESURE MarocBR (ancien jeu v1) ===");
    L.push("Scénario : " + SCEN[scenIdx] + (rapide ? "  [ZONE ACCÉLÉRÉE x4]" : "") +
           " | durée " + Math.round(dur) + " s | images " + S.n);
    L.push("FPS moyen : " + f1(avgFps) + " | écran ≈ " + best + " Hz");
    L.push("Image (ms) : médiane " + f1(p50) + " | p95 " + f1(p95) + " | p99 " + f1(p99) + " | pire " + f1(S.maxIv));
    L.push("Images > 33 ms : " + f1(100 * S.over33 / S.n) + " % | > 100 ms : " + S.over100 + " (" + f1(perMin) + " /min)");
    L.push("JS par image (ms) : moyen " + f1(jsAvg) + " | p95 " + f1(percentile(css, 0.95)) + " | pire " + f1(S.maxCost) + " | >20 ms : " + f1(100 * S.costOver20 / S.n) + " %");
    L.push("Pauses (>1 s) : " + S.pauses + " | tâches longues : " + (longTasks - S.longBase));
    if (compte) {
      L.push("Dessin par image : " + Math.round((calls.total - S.callsBase) / S.n) + " appels dont " +
             Math.round((calls.texte - S.texteBase) / S.n) + " textes");
    }
    L.push("Jeu : " + contexteJeu());
    L.push("Écran : " + innerWidth + "×" + innerHeight + " px CSS | DPR " + (window.devicePixelRatio || 1) +
           " | canevas " + (c ? c.width + "×" + c.height : "n/a"));
    L.push("Appareil : " + (navigator.hardwareConcurrency || "?") + " cœurs | RAM ≥ " + (navigator.deviceMemory || "?") +
           " Go | Chrome " + (m ? m[1] : "?") + " | mémoire JS " + mem);
    L.push("Seuils v2 (infos) : moyenne ≥30 " + v(ok1) + " | p99 ≥24 FPS " + v(ok2) +
           " | >100ms ≤3/min " + v(ok3) + " | JS moyen ≤20 ms " + v(ok4));
    L.push("(le JS ne mesure pas le temps du processeur graphique)");
    return L.join("\n");
  }

  /* ---------- 5. branchement sur requestAnimationFrame ---------- */
  nouvelle();
  var realRAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (cb) {
    return realRAF(function (ts) {
      var c0 = performance.now();
      try { cb(ts); } finally { record(ts, c0, performance.now()); }
    });
  };

  try {
    new PerformanceObserver(function (l) { longTasks += l.getEntries().length; }).observe({ entryTypes: ["longtask"] });
  } catch (e) { /* non disponible : sans importance */ }

  /* compte des appels de dessin (seulement avec ?compte=1) */
  if (compte && window.CanvasRenderingContext2D) {
    ["fill", "stroke", "fillRect", "strokeRect", "fillText", "strokeText", "arc", "ellipse", "clearRect"].forEach(function (name) {
      var proto = CanvasRenderingContext2D.prototype, orig = proto[name];
      if (!orig) return;
      var isText = (name === "fillText" || name === "strokeText");
      proto[name] = function () {
        calls.total++; if (isText) calls.texte++;
        return orig.apply(this, arguments);
      };
    });
  }

  /* zone accélérée x4 (seulement avec ?rapide=1), après le chargement du jeu */
  window.addEventListener("load", function () {
    if (!rapide) return;
    try {
      if (window.PHASES) window.PHASES.forEach(function (p) { p.wait = p.wait / 4; p.shrink = p.shrink / 4; });
    } catch (e) { /* le jeu a peut-être changé : on ignore */ }
  });

  /* ---------- 6. l'interface : 4 petits boutons + 1 ligne ---------- */
  function ui() {
    var box = document.createElement("div");
    box.style.cssText = "position:fixed;top:4px;right:4px;z-index:99999;font:11px/1.25 monospace;" +
                        "color:#fff;text-align:right;pointer-events:none";
    var line = document.createElement("div");
    line.style.cssText = "background:rgba(0,0,0,.55);padding:2px 5px;border-radius:4px;display:inline-block;margin-bottom:3px";
    var row = document.createElement("div");
    function btn(label, fn) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = label;
      b.style.cssText = "pointer-events:auto;font:11px monospace;margin-left:3px;padding:4px 7px;" +
                        "border:1px solid #888;border-radius:4px;background:rgba(0,0,0,.6);color:#fff";
      b.addEventListener("touchstart", function (e) { e.stopPropagation(); }, { passive: true });
      b.addEventListener("click", function (e) { e.stopPropagation(); fn(b); });
      row.appendChild(b); return b;
    }
    var panel = document.createElement("pre");
    panel.style.cssText = "display:none;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);" +
      "z-index:100000;margin:0;padding:8px 10px;max-width:96vw;max-height:92vh;overflow:auto;" +
      "background:rgba(0,0,0,.9);color:#fff;font:11px/1.3 monospace;white-space:pre-wrap;" +
      "border:1px solid #888;border-radius:6px;pointer-events:none";

    var bScen = btn("S:" + SCEN[scenIdx], function (b) { scenIdx = (scenIdx + 1) % SCEN.length; b.textContent = "S:" + SCEN[scenIdx]; });
    btn("RAZ", function () { nouvelle(); panel.style.display = "none"; });
    btn("RÉSUMÉ", function () {
      if (panel.style.display === "block") { panel.style.display = "none"; return; }
      panel.textContent = resume(); panel.style.display = "block";
    });
    btn("COPIER", function (b) {
      var t = resume(), old = b.textContent;
      try { navigator.clipboard.writeText(t).then(function () { b.textContent = "copié"; setTimeout(function () { b.textContent = old; }, 1200); }); }
      catch (e) { b.textContent = "non"; setTimeout(function () { b.textContent = old; }, 1200); }
    });
    box.appendChild(line); box.appendChild(row);
    document.body.appendChild(box); document.body.appendChild(panel);
    setInterval(function () {
      line.textContent = live();
      if (panel.style.display === "block") panel.textContent = resume();
    }, 500);
    void bScen;
  }

  function demarrer() { try { ui(); } catch (e) { /* jamais bloquer le jeu */ } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

  /* petite porte d'entrée pour les tests */
  window.__perf = { record: record, resume: resume, reset: nouvelle };
})();
