# usage: moves.py <levelNo> <routeIndex> "<query>" w h [seconds] [base]
# Lists every moment an element inside the level changes position or size while nobody touches anything.
import sys, asyncio
from playwright.async_api import async_playwright
lv, ri, q, w, h = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5])
secs = float(sys.argv[6]) if len(sys.argv) > 6 else 12
base = sys.argv[7] if len(sys.argv) > 7 else 'http://localhost:8090/index.html'
SNAP = '''(function(){var f=[].filter.call(document.querySelectorAll("#stage iframe"),function(x){return !x.hidden})[0]; if(!f) return null;
 var d=f.contentDocument; if(!d||!d.body) return null; var out={}, fr=f.getBoundingClientRect(); out["#frame"]=[Math.round(fr.top),Math.round(fr.height)];
 var st=document.getElementById("status"); out["#status"]=st&&!st.hidden?[Math.round(st.getBoundingClientRect().top),Math.round(st.offsetHeight)]:[-1,-1];
 var els=d.body.querySelectorAll("h1,h2,h3,p,button,li,.speech,.opt,.option,.choice,.stage,.line,section,article,.vcsw-alert,svg");
 for(var i=0;i<els.length&&i<400;i++){var e=els[i]; if(!e.offsetParent&&e.tagName!=="svg") continue; var r=e.getBoundingClientRect(); if(!r.height) continue;
  var k=e.tagName.toLowerCase()+(e.id?"#"+e.id:"")+(typeof e.className==="string"&&e.className?"."+e.className.trim().split(/\\s+/).slice(0,2).join("."):"")+"@"+i; out[k]=[Math.round(r.top),Math.round(r.height)];}
 return out;})()'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': w, 'height': h})
        await pg.goto(f'{base}?boot=uit&paniek=uit&ls={lv}&{q}', wait_until='load', timeout=60000)
        await pg.wait_for_timeout(2500)
        await pg.evaluate(f'document.querySelector(\'.stop[data-i="{ri}"]\').click()')
        await pg.wait_for_timeout(600)
        prev = None; t = 0.6; events = 0
        while t < secs:
            cur = await pg.evaluate(SNAP)
            if prev and cur:
                ch = [(k, prev[k], cur[k]) for k in cur if k in prev and prev[k] != cur[k]]
                new = [k for k in cur if k not in prev]; gone = [k for k in prev if k not in cur]
                if ch or new or gone:
                    events += 1
                    print(f't={t:4.1f}s  verplaatst {len(ch)}, nieuw {len(new)}, weg {len(gone)}')
                    for k, a, c in ch[:4]: print(f'      {k[:46]:46} top {a[0]}>{c[0]}  h {a[1]}>{c[1]}')
                    for k in new[:2]: print('      + ' + k[:60])
            prev = cur; await pg.wait_for_timeout(150); t += 0.15
        print(f'{lv} {q} {w}x{h}: {events} momenten met beweging in {secs:.0f} s')
        await b.close()
asyncio.run(main())
