# Frame pacing per phase, from the gate to a mission. usage: perf2.py [base] [w h]
# Runs on software rendering (no GPU in this container), so the numbers only compare versions with each other.
import asyncio, sys, statistics as st
from playwright.async_api import async_playwright
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8090/index.html'
W=int(sys.argv[2]) if len(sys.argv)>2 else 1440; H=int(sys.argv[3]) if len(sys.argv)>3 else 900
REC='''window.__f=[];window.__lt=[];(function loop(t){window.__f.push(t);requestAnimationFrame(loop)})(performance.now());
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){window.__lt.push([Math.round(e.startTime),Math.round(e.duration)])})}).observe({entryTypes:["longtask"]})}catch(e){}'''
TAKE='''(function(){var f=window.__f.splice(0),l=window.__lt.splice(0),d=[];for(var i=1;i<f.length;i++)d.push(f[i]-f[i-1]);var s=window.OrionStation&&OrionStation.stats?OrionStation.stats():{};return {d:d,l:l,fps:s.fps,calls:s.calls,tris:s.tris,fx:s.fx,pr:window.__pr?window.__pr():null}})()'''
def line(name,r):
    d=sorted(r['d']); n=len(d)
    if not n: print(f'{name:28} geen frames'); return
    avg=sum(d)/n; p95=d[int(n*.95)-1] if n>1 else d[0]; lt=sum(x[1] for x in r['l'])
    print(f'{name:28} schermverversing gem {avg:6.1f} ms, p95 {p95:6.1f} ms, langste {d[-1]:6.0f} ms | station {r["fps"]} beelden/s, {r["calls"]} tekenopdrachten, {r["tris"]} driehoeken, fx {r["fx"]} | lange taken {len(r["l"])} samen {lt} ms')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files'])
        pg=await b.new_page(viewport={'width':W,'height':H}); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)[:160]))
        await pg.add_init_script(REC)
        await pg.goto(BASE); await pg.wait_for_function('window.OrionStation',timeout=180000); await pg.wait_for_timeout(2500); await pg.evaluate(TAKE)
        await pg.wait_for_timeout(4000); line('poort, wachten op pas', await pg.evaluate(TAKE))
        await pg.evaluate('document.getElementById("gate-ms").click()'); await pg.wait_for_timeout(500); await pg.evaluate(TAKE)
        await pg.evaluate('document.querySelector(".pass-card").click()'); await pg.wait_for_function('document.getElementById("boot").hidden',timeout=60000)
        line('inloggen, deuren open', await pg.evaluate(TAKE))
        await pg.wait_for_timeout(1500); line('eerste 1,5 s na inloggen', await pg.evaluate(TAKE))
        await pg.wait_for_timeout(5000); line('overzicht', await pg.evaluate(TAKE))
        await pg.evaluate('document.querySelector(\'.stop[data-i="0"]\').click()'); await pg.wait_for_timeout(2500); line('missie openen (2,5 s)', await pg.evaluate(TAKE))
        await pg.wait_for_timeout(6000); line('missie, level 1', await pg.evaluate(TAKE))
        print('fouten', errs[:3]); await b.close()
asyncio.run(main())
