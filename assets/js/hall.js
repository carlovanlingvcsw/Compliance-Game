/* The arrival hall behind the opening screen: a back wall and a deck with real textures,
   lit by the blue light from the door seam and the warm beacon above the door.
   It is drawn once when the station's textures are in, and again when the window changes size,
   so it costs nothing while the player reads. The door itself stays HTML and CSS on top. */
import * as THREE from "three";
import { loadTextures, pbr } from "orion/tex.js";

const gate = document.getElementById("boot");
const wall = gate && gate.querySelector(".wall");
if (wall) {
  const canvas = document.createElement("canvas");
  canvas.className = "hall3d"; canvas.setAttribute("aria-hidden", "true");
  wall.insertBefore(canvas, wall.firstChild);
  let renderer = null;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" }); } catch (e) { renderer = null; }
  if (renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x02060e);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    camera.position.set(0, 2.2, 18); camera.lookAt(0, 0.6, 0);

    scene.add(new THREE.HemisphereLight(0x284a78, 0x05080f, 0.55));
    const seam = new THREE.PointLight(0x4fb6ff, 60, 22, 1.6); scene.add(seam);
    const seamLow = new THREE.PointLight(0x67caff, 40, 12, 1.6); scene.add(seamLow);
    const beacon = new THREE.SpotLight(0xffb44d, 160, 22, 0.6, 0.75, 1.3); scene.add(beacon); scene.add(beacon.target);
    const fill = new THREE.PointLight(0x1d5fb0, 18, 34, 1.1); scene.add(fill);
    const fillL = new THREE.PointLight(0x2a4f86, 10, 30, 1.2); scene.add(fillL);
    const lampL = new THREE.PointLight(0xffb900, 8, 5, 1.8), lampR = lampL.clone(); scene.add(lampL, lampR);
    const haloL = new THREE.PointLight(0x3fa9ff, 16, 7, 1.6), haloR = haloL.clone(); scene.add(haloL, haloR);
    /* the halos come from wall lights you can see: a lit bar in a dark bracket on each side of the housing */
    const barGeo = new THREE.BoxGeometry(0.16, 2.2, 0.12), barMat = new THREE.MeshBasicMaterial({ color: 0x9fdcff });
    const bracketGeo = new THREE.BoxGeometry(0.34, 2.5, 0.16), bracketMat = new THREE.MeshStandardMaterial({ color: 0x1a2638, metalness: 0.7, roughness: 0.5 });
    const fixtures = [0, 1].map(() => { const g = new THREE.Group(); const br = new THREE.Mesh(bracketGeo, bracketMat); const bar = new THREE.Mesh(barGeo, barMat); bar.position.z = 0.06; g.add(br, bar); scene.add(g); return g; });

    let built = false, wallMesh, floorMesh;
    function build() {
      // a matte bulkhead with plates, not a glossy tile
      wallMesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 34), pbr("hull_light", { repeat: [8, 4.6], color: 0x4a6288, metalness: 0.35, roughness: 1, normalScale: 2.2 }));
      scene.add(wallMesh);
      floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), pbr("grate", { repeat: [20, 10], color: 0x6f86a8, metalness: 0.7, roughness: 0.82, normalScale: 1.3 }));
      floorMesh.rotation.x = -Math.PI / 2; scene.add(floorMesh);
      const ceil = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), pbr("hull_dark", { repeat: [10, 5], color: 0x3a4c66, metalness: 0.6, roughness: 1 }));
      ceil.rotation.x = Math.PI / 2; ceil.userData.ceil = true; scene.add(ceil);
      // structure: pilasters at a steady rhythm, a skirting with a light strip, a conduit run with brackets
      const steel = pbr("hull_light", { repeat: [0.3, 3], color: 0x55698a, metalness: 0.25, roughness: 0.8, normalScale: 2 });
      const darkSteel = pbr("hull_dark", { repeat: [6, 1], color: 0x2c3d58, metalness: 0.7, roughness: 0.9 });
      props = new THREE.Group(); scene.add(props);
      for (let i = -6; i <= 6; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.9, 34, 0.5), steel); p.position.set(i * 5.2, 0, 0.25); p.userData.pilaster = i; props.add(p); }
      skirting = new THREE.Mesh(new THREE.BoxGeometry(60, 0.55, 0.5), pbr("hull_light", { repeat: [12, 0.4], color: 0x7590bb, metalness: 0.3, roughness: 0.75, normalScale: 1.6 })); skirting.material.emissive = new THREE.Color(0x0c1a30); props.add(skirting);
      strip = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0x3f9be0 })); props.add(strip);
      conduit = new THREE.Group(); props.add(conduit);
      [0, 0.42].forEach((dy, k) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.16 - k * 0.04, 0.16 - k * 0.04, 60, 12), steel); c.rotation.z = Math.PI / 2; c.position.set(0, dy, 0.75); conduit.add(c); });
      for (let i = -6; i <= 6; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 0.9), darkSteel); b.position.set(i * 5.2 + 2.6, 0.2, 0.5); conduit.add(b); }
      built = true;
    }
    let props, skirting, strip, conduit;
    /* The door's position on screen, as the gate measures it, becomes a point on the back wall. */
    const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3();
    function onWall(px, py, w, h) {
      ray.setFromCamera(new THREE.Vector2(px / w * 2 - 1, -(py / h) * 2 + 1), camera);
      return ray.ray.intersectPlane(plane, hit) ? hit.clone() : new THREE.Vector3();
    }
    function draw() {
      if (!built) return;
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      const st = getComputedStyle(gate);
      const hx = parseFloat(st.getPropertyValue("--hx")) || w * 0.62, hy = parseFloat(st.getPropertyValue("--hy")) || h * 0.15;
      const hw = parseFloat(st.getPropertyValue("--hw")) || w * 0.3, hh = parseFloat(st.getPropertyValue("--hh")) || h * 0.6;
      const top = onWall(hx + hw / 2, hy, w, h), mid = onWall(hx + hw / 2, hy + hh / 2, w, h), foot = onWall(hx + hw / 2, hy + hh + 40, w, h);
      floorMesh.position.y = foot.y; scene.children.forEach((o) => { if (o.userData && o.userData.ceil) o.position.y = top.y + 3.4; });
      skirting.position.set(0, foot.y + 0.27, 0.25);
      /* the lit edge of the kick plate runs from the end of the text column to the right edge, never through the text */
      const copy = document.querySelector(".gate-copy"), cr = copy ? copy.getBoundingClientRect() : null;
      const sL = onWall(cr && w >= 1280 ? cr.right + 24 : w, hy + hh, w, h).x, sR = onWall(w, hy + hh, w, h).x + 2;
      strip.visible = false; strip.scale.x = Math.max(sR - sL, 0.01); strip.position.set((sL + sR) / 2, foot.y + 0.56, 0.52); conduit.position.set(0, top.y + 1.6, 0);
      /* no pilaster behind the door, and one on each side of it */
      props.children.forEach((o) => { if (o.userData.pilaster !== undefined) { const x = o.userData.pilaster * 5.2 + (mid.x % 5.2); o.position.x = x; o.visible = Math.abs(x - mid.x) > 4.2; } });
      seam.position.set(mid.x, mid.y, 1.6);
      seamLow.position.set(mid.x, foot.y + 0.6, 2.4);
      beacon.position.set(top.x, top.y + 1.2, 3.2); beacon.target.position.set(top.x, foot.y, 0);
      fill.position.set(mid.x - 14, mid.y + 4, 8); fillL.position.set(mid.x - 26, mid.y - 2, 10);
      const fl = onWall(hx - 20, hy + hh + 30, w, h), fr = onWall(hx + hw + 20, hy + hh + 30, w, h);
      lampL.position.set(fl.x, foot.y + 0.3, 1); lampR.position.set(fr.x, foot.y + 0.3, 1);
      const hl = onWall(hx - 110, hy + hh * 0.45, w, h), hr = onWall(hx + hw + 110, hy + hh * 0.45, w, h);
      haloL.position.set(hl.x, hl.y, 0.7); haloR.position.set(hr.x, hr.y, 0.7);
      fixtures[0].position.set(hl.x, hl.y, 0.1); fixtures[1].position.set(hr.x, hr.y, 0.1); haloL.intensity = haloR.intensity = 12;
      /* a wall light the screen edge would cut in half is left out, with its halo */
      const rOut = hx + hw + 110 + 40 > w; fixtures[1].visible = !rOut; haloR.intensity = rOut ? 0 : 12;
      renderer.render(scene, camera);
    }
    let queued = false;
    const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; draw(); }); };
    loadTextures().then(() => { build(); later(); setTimeout(later, 300); document.documentElement.classList.add("has-hall"); });
    window.addEventListener("resize", later);
    gate.addEventListener("scroll", later, { passive: true });
    /* When the gate closes for good, the hall gives its GPU memory back. */
    new MutationObserver(() => { if (gate.hidden) { renderer.setSize(1, 1, false); } else later(); }).observe(gate, { attributes: true, attributeFilter: ["hidden"] });
  }
}

/* The gangway behind the doors, in 3D: octagonal ribs in the hall's own metal, light strips, fog and a bright end.
   It is drawn once when the doors unlock and animated only while they open and the camera moves in. */
const bay = document.getElementById("bay");
if (bay && gate) {
  const cv = document.createElement("canvas");
  cv.className = "tunnel3d"; cv.setAttribute("aria-hidden", "true");
  gate.insertBefore(cv, gate.firstChild);
  let r = null;
  try { r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: "low-power", preserveDrawingBuffer: true }); } catch (e) { r = null; }
  if (r) {
    r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.78;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const sc = new THREE.Scene(); sc.background = new THREE.Color(0x061428); sc.fog = new THREE.FogExp2(0x0d3366, 0.04);
    const cam = new THREE.PerspectiveCamera(52, 1, 0.05, 120); cam.position.set(0, 0, 3);
    let ready = false, t0 = 0, running = false, proj = null, sizeW = 0, sizeH = 0;
    const LEN = 44, R = 2.4;
    const SLOW = Number((location.search.match(/[?&]traag=(\d+)/) || [])[1]) || 1;
    function octShape(rad, holeRad) {
      const s = new THREE.Shape(), h = new THREE.Path();
      for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; const p = [Math.cos(a) * rad, Math.sin(a) * rad]; i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1]); }
      for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; const p = [Math.cos(a) * holeRad, Math.sin(a) * holeRad]; i ? h.lineTo(p[0], p[1]) : h.moveTo(p[0], p[1]); }
      s.holes.push(h); return s;
    }
    /* the end of the gangway is a window: stars and the blue edge of the planet the station circles */
    function spaceWindow() {
      const c = document.createElement("canvas"); c.width = c.height = 512; const g = c.getContext("2d");
      g.fillStyle = "#020a1a"; g.fillRect(0, 0, 512, 512);
      let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < 260; i++) { const a = rnd(); g.fillStyle = "rgba(220,235,255," + (0.25 + a * 0.75) + ")"; g.fillRect(rnd() * 512, rnd() * 300, a > 0.92 ? 2 : 1, a > 0.92 ? 2 : 1); }
      const cx = 300, cy = 980, rad = 640;
      const atm = g.createRadialGradient(cx, cy, rad - 6, cx, cy, rad + 40); atm.addColorStop(0, "rgba(120,200,255,.9)"); atm.addColorStop(1, "rgba(40,120,255,0)");
      g.fillStyle = atm; g.beginPath(); g.arc(cx, cy, rad + 40, 0, Math.PI * 2); g.fill();
      const body = g.createRadialGradient(cx - 120, cy - rad + 40, 20, cx, cy, rad); body.addColorStop(0, "#5fb4ff"); body.addColorStop(0.18, "#1f6ed0"); body.addColorStop(0.55, "#0b2f72"); body.addColorStop(1, "#04112e");
      g.fillStyle = body; g.beginPath(); g.arc(cx, cy, rad, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 0.18; g.fillStyle = "#e8f4ff";
      for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(80 + rnd() * 380, 380 + rnd() * 120, 30 + rnd() * 70, 4 + rnd() * 6, -0.15, 0, Math.PI * 2); g.fill(); }
      g.globalAlpha = 1;
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }
    function buildTunnel() {
      const shell = pbr("hull_light", { repeat: [8, 10], color: 0x3f68a8, metalness: 0.35, roughness: 0.85, normalScale: 2.2 });
      shell.side = THREE.BackSide;
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(R, R, LEN, 8, 1, true), shell);
      tube.rotation.x = Math.PI / 2; tube.rotation.y = Math.PI / 8; tube.position.z = -LEN / 2 + 2; sc.add(tube);
      const ribMat = pbr("hull_dark", { repeat: [1, 1], color: 0x546f98, metalness: 0.6, roughness: 0.75, normalScale: 1.4 });
      const ribGeo = new THREE.ExtrudeGeometry(octShape(R + 0.05, R - 0.32), { depth: 0.28, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 });
      const heavyMat = pbr("hull_dark", { repeat: [1, 1], color: 0x3a4f70, metalness: 0.7, roughness: 0.6, normalScale: 1.6 });
      const glow = new THREE.MeshBasicMaterial({ color: 0x3d93e6 }), warm = new THREE.MeshBasicMaterial({ color: 0xffb340 });
      for (let i = 0; i < 16; i++) {
        const z = -i * 2.6;
        const rib = new THREE.Mesh(ribGeo, i % 4 === 2 ? heavyMat : ribMat); rib.position.z = z; if (i % 4 === 2) rib.scale.set(1, 1, 3.2); sc.add(rib);
        /* every fourth frame is a heavy bulkhead with an amber marker band, so the run has a rhythm and a sense of speed */
        if (i % 4 === 2) { const band = new THREE.Mesh(new THREE.TorusGeometry(R - 0.36, 0.025, 4, 8), warm); band.rotation.z = Math.PI / 8; band.position.z = z + 0.95; sc.add(band); }
        if (i > 0 && i % 4 !== 2) [-1, 1].forEach((sx) => { const s = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.7), glow); s.position.set(sx * (R - 0.3), 0, z - 1.3); sc.add(s); });
        const top = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.2), warm); top.position.set(0, R - 0.3, z - 0.2); sc.add(top);
        if (i % 3 === 0) { const l = new THREE.PointLight(0x8fd0ff, 3.2, 8, 1.8); l.position.set(0, 0.6, z - 1.3); sc.add(l); }
      }
      /* handrails along both walls */
      [-1, 1].forEach((sx) => { const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, LEN, 8), heavyMat); rail.rotation.x = Math.PI / 2; rail.position.set(sx * (R - 0.42), -0.2, -LEN / 2 + 2); sc.add(rail); });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(2.6, LEN), pbr("grate", { repeat: [2, 34], color: 0x7d93b5, metalness: 0.8, roughness: 0.55 }));
      floor.rotation.x = -Math.PI / 2; floor.position.set(0, -R * 0.92 + 0.05, -LEN / 2 + 2); sc.add(floor);
      const guide = new THREE.Mesh(new THREE.PlaneGeometry(0.08, LEN), glow); guide.rotation.x = -Math.PI / 2; guide.position.set(0, -R * 0.92 + 0.07, -LEN / 2 + 2); sc.add(guide);
      const end = new THREE.Mesh(new THREE.CircleGeometry(R, 8), new THREE.MeshBasicMaterial({ map: spaceWindow(), fog: false })); end.position.z = -LEN + 3; end.rotation.z = Math.PI / 8; sc.add(end);
      const endLight = new THREE.PointLight(0x9fd4ff, 12, 30, 1.2); endLight.position.z = -LEN + 5; sc.add(endLight);
      sc.add(new THREE.HemisphereLight(0x2f64b8, 0x060a14, 0.6));
      ready = true;
    }
    /* The canvas covers the screen behind the hall; the projection centre sits in the middle of the door bay,
       and the field of view makes the gangway fill the bay the way a real doorway would. */
    function frame(now) {
      const W = window.innerWidth, H = window.innerHeight;
      /* Only when the window really changed: setting the size clears and rebuilds the drawing buffer, and doing that
         on every picture of the push through the gangway cost more than drawing the gangway itself. */
      if (W !== sizeW || H !== sizeH) { r.setSize(W, H, false); sizeW = W; sizeH = H; }
      /* while the hall pushes in, the projection stays as it was: the opening grows around a steady view */
      if (!running || !proj) { const b = bay.getBoundingClientRect(), bh = Math.max(b.height, 1); proj = { bh: bh, cx: b.left + b.width / 2, cy: b.top + bh * 0.52 }; }
      const bh = proj.bh, cx = proj.cx, cy = proj.cy;
      cam.fov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(26)) * H / bh) * 180 / Math.PI;
      cam.aspect = W / H; cam.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H); cam.updateProjectionMatrix();
      if (running) {
        const t = Math.min((now - t0) / (1900 * SLOW), 1), e = t * t * (3 - 2 * t);
        cam.position.z = 3 - e * 20; cam.position.y = Math.sin(t * Math.PI * 6) * 0.015 * (1 - t);
      }
      r.render(sc, cam);
      if (running && !gate.hidden) requestAnimationFrame(frame); else running = false;
    }
    /* for checking the push frame by frame: window.OrionTunnelAt(0..1) */
    window.OrionTunnelAt = (f) => { running = false; const e = f * f * (3 - 2 * f); frame(performance.now()); cam.position.z = 3 - e * 20; r.render(sc, cam); };
    const still = () => { if (ready && !running && !gate.hidden) requestAnimationFrame(frame); };
    window.addEventListener("resize", still); gate.addEventListener("scroll", still, { passive: true });
    loadTextures().then(() => { buildTunnel(); document.documentElement.classList.add("has-tunnel"); still(); setTimeout(still, 400); });
    new MutationObserver(() => {
      if (!ready) return;
      const c = gate.classList;
      if (!c.contains("leaving") && !running) { cam.position.set(0, 0, 3); still(); }
      if (c.contains("leaving") && !running) { proj = null; frame(performance.now()); running = true; t0 = performance.now(); requestAnimationFrame(frame); }
      if (gate.hidden) { running = false; r.setSize(1, 1, false); sizeW = sizeH = 0; }
    }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });
  }
}
