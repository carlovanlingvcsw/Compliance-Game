# Checks every level screen for movement while nobody touches anything. usage: still.py [w h] [base]
import asyncio, sys
from playwright.async_api import async_playwright
W=int(sys.argv[1]) if len(sys.argv)>1 else 1440; H=int(sys.argv[2]) if len(sys.argv)>2 else 900
BASE=sys.argv[3] if len(sys.argv)>3 else 'http://localhost:8090/index.html'
S={1:(0,['start','briefing','dienst','dienst2','sorteren','dienst4','luchtsluis','hut','debriefing','aarde']),
   2:(2,['briefing','dienst','sluisstart','sluis','debriefing','aarde','uitslag']),
   3:(3,['briefing','dienst','situatie2','luchtsluis','sluis','sluisopen','resultaat','aarde']),
   4:(5,['start','briefing','dienst','mail','luchtsluis','berichten','code','debriefing','aarde','uitslag']),
   5:(7,['briefing','incident','dienst','log','luchtsluis','sluis','sluisdicht','resultaat','aarde']),
   6:(9,['briefing','fase1','fase2','fase3','fase4','aanval-start','aanval','aanval-klaar','sluis','sluis-open','afsluiting','spiekbrief','aarde'])}
SNAP='''(function(){var f=[].filter.call(document.querySelectorAll("#stage iframe"),function(x){return !x.hidden})[0];if(!f)return null;var d=f.contentDocument;if(!d||!d.body)return null;
 var o={}; o["#frame"]=Math.round(f.getBoundingClientRect().top)+"/"+Math.round(f.getBoundingClientRect().height); var st=document.getElementById("status"); o["#status"]=st&&!st.hidden?Math.round(st.getBoundingClientRect().top)+"/"+st.offsetHeight:"-";
 o["#over"]=d.documentElement.scrollHeight-f.contentWindow.innerHeight;
 var els=d.body.querySelectorAll("h1,h2,h3,p,button,li,section,article,.vcsw-alert,.opt,.option,.choice");
 for(var i=0;i<els.length&&i<500;i++){var e=els[i]; if(!e.offsetParent) continue; var r=e.getBoundingClientRect(); if(!r.height) continue; o[e.tagName.toLowerCase()+(typeof e.className==="string"&&e.className?"."+e.className.trim().split(/\\s+/)[0]:"")+"@"+i]=Math.round(r.top)+"/"+Math.round(r.height)+"/"+Math.round(r.left);}
 return o;})()'''
async def one(b,lv,ri,name):
    pg=await b.new_page(viewport={'width':W,'height':H}); res=None
    try:
        await pg.goto(BASE+'?boot=uit&paniek=uit&3d=uit&ls=%d&scherm=%s'%(lv,name),wait_until='load'); await pg.wait_for_timeout(700)
        await pg.evaluate("document.querySelector('.stop[data-i=\"%d\"]').click()"%ri); await pg.wait_for_timeout(3000)
        prev=await pg.evaluate(SNAP); n=0; who={}; hs=set(); over=0
        for i in range(28):
            await pg.wait_for_timeout(200); cur=await pg.evaluate(SNAP)
            if cur and prev:
                ch=[k for k in cur if k in prev and prev[k]!=cur[k] and k!="#over"]
                if ch: n+=1
                for k in ch: who[k.split('@')[0]]=who.get(k.split('@')[0],0)+1
                hs.add(cur["#frame"]); over=max(over,cur["#over"])
            prev=cur
        res=(n,who,sorted(hs),over)
    except Exception as e: res=('fout',str(e)[:80])
    await pg.close(); return (lv,name,res)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        out=[]
        for lv,(ri,names) in S.items():
            for k in range(0,len(names),5): out+=await asyncio.gather(*[one(b,lv,ri,n) for n in names[k:k+5]])
        still=0; fit=0
        for lv,name,r in out:
            if r[0]=='fout': print(lv,name,'FOUT',r[1]); continue
            n,who,hs,over=r
            if n==0: still+=1
            else: print(lv,name,'beweegt op',n,'van 28 metingen; paneel',hs,';',dict(sorted(who.items(),key=lambda x:-x[1])[:4]))
            if over<=2: fit+=1
            else: print(lv,name,'scrolt',over,'px')
        print('schermen',len(out),'bij',W,'x',H,'; stil',still,'; zonder scroll',fit)
        await b.close()
asyncio.run(main())
