// Simulation of the pace of the station during a mission on a 60 Hz screen, old and new code. No rendering, only the timing rules.
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const raf = []; let t = 0; for (let i = 0; i < 3600; i++) { t += 16.667 + (rnd() - 0.5) * 1.2; raf.push(t); }   // one minute, 0.6 ms of jitter either way
function run(mode) {
  let acc = 0, skipped = 0, rawAvg = 1 / 60, prev = 0, last = 0; const gaps = [], cam = []; let x = 0, base = 0;
  for (const now of raf) {
    let dt = (now - prev) / 1000; prev = now;
    if (mode === "oud") { acc += dt; if (acc < 1 / 30) continue; dt = acc; acc = 0; }
    else { rawAvg += (Math.min(dt, 0.05) - rawAvg) * 0.05; const every = Math.max(1, Math.round((1 / 30) / rawAvg)); acc += dt; skipped++; if (skipped < every) continue; dt = acc; acc = 0; skipped = 0; }
    gaps.push(now - last); last = now;
    const k = 1 - Math.pow(0.001, dt), s = Math.sin(now / 1000 * 0.21);
    if (mode === "oud") { x += (0 - x) * k; x += s * 0.03; cam.push(x); }          // float fed back into the eased position
    else { base += (0 - base) * k; cam.push(base + s * 0.1); }                       // float added on top
  }
  gaps.shift();
  const uneven = gaps.filter((g) => g > 40).length, jerk = [];
  for (let i = 2; i < cam.length; i++) jerk.push(Math.abs(cam[i] - 2 * cam[i - 1] + cam[i - 2]));
  jerk.sort((a, b) => a - b);
  console.log(mode.padEnd(6), "beelden", gaps.length, "| tussenpozen", Math.min(...gaps).toFixed(1), "tot", Math.max(...gaps).toFixed(1), "ms | langer dan 40 ms:", uneven, "(" + (100 * uneven / gaps.length).toFixed(0) + "%)",
    "| schok in camerastand, p95", jerk[Math.floor(jerk.length * 0.95)].toExponential(2), "max", jerk[jerk.length - 1].toExponential(2));
}
run("oud"); run("nieuw");
