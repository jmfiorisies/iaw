(function () {
  if (window.__mapasIAW) return;
  window.__mapasIAW = true;
  function abrir(svgOriginal) {
    var vb0 = svgOriginal.viewBox.baseVal, vb = { x: vb0.x, y: vb0.y, w: vb0.width, h: vb0.height };
    var modal = document.createElement("div");
    modal.className = "uml-modal";
    modal.innerHTML = '<div class="uml-barra"><button class="uml-btn" data-z="1.25">+ Acercar</button>' +
      '<button class="uml-btn" data-z="0.8">− Alejar</button><button class="uml-btn" data-z="0">⟲ Ver entero</button>' +
      '<span class="uml-ayuda">Rueda o pellizco: zoom · Arrastra: mover · Doble clic: acercar · Esc: cerrar</span>' +
      '<button class="uml-btn" data-cerrar>✕ Cerrar</button></div><div class="uml-zona"></div>';
    var zona = modal.querySelector(".uml-zona");
    var svg = svgOriginal.cloneNode(true);
    svg.removeAttribute("style");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    zona.appendChild(svg);
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    function pinta() { svg.setAttribute("viewBox", vb.x + " " + vb.y + " " + vb.w + " " + vb.h); }
    function punto(cx, cy) {
      var r = zona.getBoundingClientRect(), esc = Math.max(vb.w / r.width, vb.h / r.height);
      var ox = (r.width * esc - vb.w) / 2, oy = (r.height * esc - vb.h) / 2;
      return { x: vb.x - ox + (cx - r.left) * esc, y: vb.y - oy + (cy - r.top) * esc, esc: esc };
    }
    function zoom(f, cx, cy) {
      var r = zona.getBoundingClientRect();
      if (cx === undefined) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
      var p = punto(cx, cy), nw = Math.min(Math.max(vb.w / f, vb0.width / 12), vb0.width * 1.5), k = nw / vb.w;
      vb.x = p.x - (p.x - vb.x) * k; vb.y = p.y - (p.y - vb.y) * k; vb.w = nw; vb.h = vb.h * k;
      pinta();
    }
    function cerrar() { modal.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", tecla); }
    function tecla(e) {
      if (e.key === "Escape") cerrar();
      if (e.key === "+" || e.key === "=") zoom(1.25);
      if (e.key === "-") zoom(0.8);
      if (e.key === "0") { vb = { x: vb0.x, y: vb0.y, w: vb0.width, h: vb0.height }; pinta(); }
    }
    document.addEventListener("keydown", tecla);
    modal.querySelector(".uml-barra").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-cerrar")) return cerrar();
      var z = parseFloat(b.getAttribute("data-z"));
      if (z === 0) { vb = { x: vb0.x, y: vb0.y, w: vb0.width, h: vb0.height }; pinta(); } else zoom(z);
    });
    zona.addEventListener("wheel", function (e) { e.preventDefault(); zoom(e.deltaY > 0 ? 0.88 : 1.14, e.clientX, e.clientY); }, { passive: false });
    zona.addEventListener("dblclick", function (e) { zoom(1.6, e.clientX, e.clientY); });
    var dedos = new Map(), distancia = 0;
    zona.addEventListener("pointerdown", function (e) { e.preventDefault(); zona.setPointerCapture(e.pointerId); dedos.set(e.pointerId, e); zona.classList.add("arrastrando"); });
    zona.addEventListener("pointermove", function (e) {
      if (!dedos.has(e.pointerId)) return;
      var antes = dedos.get(e.pointerId); dedos.set(e.pointerId, e);
      if (dedos.size === 2) {
        var d = Array.from(dedos.values()), nd = Math.hypot(d[0].clientX - d[1].clientX, d[0].clientY - d[1].clientY);
        if (distancia) zoom(nd / distancia, (d[0].clientX + d[1].clientX) / 2, (d[0].clientY + d[1].clientY) / 2);
        distancia = nd; return;
      }
      var esc = punto(0, 0).esc;
      vb.x -= (e.clientX - antes.clientX) * esc; vb.y -= (e.clientY - antes.clientY) * esc; pinta();
    });
    function suelta(e) { dedos.delete(e.pointerId); distancia = 0; if (!dedos.size) zona.classList.remove("arrastrando"); }
    zona.addEventListener("pointerup", suelta);
    zona.addEventListener("pointercancel", suelta);
    pinta();
  }
  document.addEventListener("click", function (e) {
    var caja = e.target.closest(".mapa-iaw");
    if (caja && (e.target.closest("[data-uml-abrir]") || e.target.closest(".uml-lienzo"))) abrir(caja.querySelector(".uml-lienzo svg"));
  });
})();
