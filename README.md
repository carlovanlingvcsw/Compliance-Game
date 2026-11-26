# AVG-game Ruimtestation Orion

Een AVG-training van VCSW in de vorm van een game. Spelers zijn Cadet van de Datawacht op Ruimtestation Orion. Ze vliegen langs zes modules van het station en spelen daar vijf levels, een eindmissie en vier arcaderondes over het beschermen van persoonsgegevens.

Status: prototype. Alle namen, planeten en gegevens in het spel zijn fictief. De goede antwoorden, stappen en termijnen wachten nog op goedkeuring van de Privacy Officer. Het 3D-station en ARIA zijn een concept: het VCSW-merk heeft nog geen goedgekeurde illustraties, dus marketing moet de beeldtaal nog goedkeuren.

## Zo werkt het spel

- **Station als wereld.** Het startscherm toont Ruimtestation Orion in 3D, met de stationskaart ernaast. Elke missie hoort bij een module. Kies je een missie, dan vliegt de camera naar die module en opent de missie in een paneel ernaast.
- **Toegangspoort.** Het spel opent in de aankomsthal van het station. Links staat wat de bedoeling is en wat score, schild, kristallen en tijd betekenen. Rechts houd je je pas voor de lezer: in de demo kies je een verzonnen account, in de eindversie komt hier de Microsoft-inlog. Daarna gaan de deuren open.
- **Statusbalk.** Boven elk level staat een vaste balk met de stappen van het level, de score met de grens van 70 procent, het schild en de kristallen. Na elk antwoord toont de balk vijf seconden wat erbij kwam of eraf ging. Op het laatste scherm staat hier de knop naar het volgende onderdeel.
- **Aanwijzingen.** In een luchtsluis vraag je ARIA om een aanwijzing. Elk kristal uit het level is één aanwijzing zonder kosten, daarna kost een aanwijzing 10 procent schild.
- **Eindmissie in drie delen.** Het bericht, de aanval van de Zwarte Nevel (rook over de modules in het station, zes vragen op tijd) en de hoofdsluis met vijf grendels van drie kernregels.
- **Logboek.** De route eindigt bij een logboek met de uitslag per missie. Je bewaart het als pdf via de afdrukfunctie van de browser.
- **ARIA** is de boordcomputer. Ze vliegt mee naar elke module en zegt in één zin wat er speelt.
- **Combo's, sterren en badges.** Goede antwoorden op rij verhogen je combo tot ×4 en leveren XP op. Per level en per arcaderonde verdien je tot drie sterren. Er zijn elf badges.
- **Voortgang** blijft alleen in de browser van de speler bewaard. Er worden geen gegevens verstuurd.
- **Zonder 3D.** Kan de browser geen WebGL, of zet je `?3d=uit` achter het adres, dan speel je hetzelfde spel met een vlakke sterrenachtergrond. Bij de instelling "minder beweging" staat het station stil en springt de camera zonder vlucht.

| Route | Onderwerp | Module | Map |
| --- | --- | --- | --- |
| Level 1 | Aankomst op het station | Aankomsthal | [levels/level-1-aankomst](levels/level-1-aankomst) |
| Bonus | Holokaarten-sprint | Aankomsthal | in `assets/js/orion.js` |
| Level 2 | De passagiersmodule | Passagiersmodule | [levels/level-2-passagiersmodule](levels/level-2-passagiersmodule) |
| Level 3 | De medische ziekenboeg | Ziekenboeg | [levels/level-3-ziekenboeg](levels/level-3-ziekenboeg) |
| Bonus | Wie mag dit zien? | Ziekenboeg | in `assets/js/orion.js` |
| Level 4 | Het vrachtdok | Vrachtdok | [levels/level-4-vrachtdok](levels/level-4-vrachtdok) |
| Bonus | Phishing Invaders | Vrachtdok | in `assets/js/orion.js` |
| Level 5 | Alarm in module Kepler | Module Kepler | [levels/level-5-hullbreuk](levels/level-5-hullbreuk) |
| Bonus | Lekken dichten | Module Kepler | in `assets/js/orion.js` |
| Eindmissie | Een bericht van de aarde | Communicatietoren | [levels/eindmissie-bericht-van-de-aarde](levels/eindmissie-bericht-van-de-aarde) |

## Opbouw

```
index.html                   Het spel: station, opdrachtbalk, stationskaart en missiepaneel
assets/
  css/vcsw-brand.css         VCSW-huisstijl (kleuren, typografie, knoppen, kaarten), gedeeld door alles
  css/orion.css              Opmaak van het spel rond de levels: balk, stationskaart, paneel, arcade, prestaties
  css/orion-theme.css        Ruimte-thema voor level 2 tot en met de eindmissie
  css/orion-level.css        Aanpassingen voor level 1, dat zijn eigen thema in style.css heeft
  js/orion.js                Route, combo's, sterren, badges, de vier arcaderondes en de koppeling met het station
  js/orion-bridge.js         Staat in elk level: meldt elk gekozen antwoord aan het spel, voor combo's en sterren
  js/station.js              Het 3D-station, in code gebouwd met three.js, met CC0-texturen en bloom
  js/arcade3d.js             De 3D-speelvelden achter de vier arcaderondes
  js/tex.js                  Laadt de texturen voor station en arcade
  textures/                  Texturen van ambientCG (CC0), zie CREDITS.md in die map
  vendor/three.module.js     three.js r170 (MIT-licentie), zonder internet bruikbaar
  img/                       VCSW-woordmerk voor lichte en donkere achtergrond
levels/<level>/
  index.html                 Pagina van het level (statusbalk, speelveld)
  style.css                  Opmaak die alleen voor dit level geldt
  game.js                    Spellogica en alle teksten, vragen en antwoorden van dit level
tools/
  serve.mjs                  Lokale webserver
  bundle.mjs                 Maakt één los HTML-bestand van het hele spel
```

Elk level werkt ook op zichzelf. Je kunt `levels/<level>/index.html` los openen en testen; combo's, sterren en badges werken alleen in het spel zelf.

## Lokaal draaien

Je hebt alleen [Node.js](https://nodejs.org) 18 of nieuwer nodig, er zijn geen andere pakketten.

```powershell
npm start
```

Open daarna <http://localhost:8080>. Na een wijziging ververs je de pagina in de browser.

Dubbelklikken op `index.html` werkt niet goed: de browser laat het 3D-station dan niet laden. Gebruik `npm start`, of maak het losse bestand hieronder. Dat werkt wel met dubbelklikken.

## Aanpassen

- **Teksten, vragen, antwoorden en feedback** van een level staan in `game.js` van dat level. Zoek op de zin die je wilt wijzigen.
- **Wat ARIA per missie zegt**, de naam van de module en de volgorde van levels staan in de lijst `LEVELS` bovenin `assets/js/orion.js`. De volgorde van levels en arcaderondes staat in `ROUTE` in hetzelfde bestand.
- **Arcaderondes**: regels, kaarten en berichten staan in `GAMES`, `CARDS`, `PACKETS`, `MSGS` en `EVENTS` in `assets/js/orion.js`.
- **Het station**: modules, kleuren en camerastandpunten staan in `assets/js/station.js`. Elke module heeft een eigen blok met een korte uitleg erboven.
- **Opmaak** van één level wijzig je in `style.css` van dat level. Kleuren en lettertypen komen uit `assets/css/vcsw-brand.css`; pas die alleen aan als de huisstijl verandert.

## Eén bestand maken

Wil je het spel als één bestand versturen of in een leeromgeving zetten:

```powershell
npm run bundle
```

Het resultaat staat in `dist/AVG-game_Ruimtestation_Orion.html` (ongeveer 6,4 MB). Het werkt met dubbelklikken en zonder internet; alleen de lettertypen komen dan uit het systeem. De map `dist/` gaat niet mee naar GitHub.

## Wijzigingen

### 26 november 2026: nieuwe voorpagina, rustig paneel en meer tempo (ronde 29)

- **Voorpagina.** Het openingsscherm is de aankomsthal van het station: een deur met twee bladen en een lichtnaad in een nis, met vloer, leidingen en lampen. De stijl staat in `assets/css/gate.css`, de hal en de gang achter de deur in `assets/js/hall.js`. Op schermen vanaf 1280 pixels breed hangt de paslezer als losse terminal aan de wand, op kleinere schermen zit hij op de deur. De knop Inloggen met Microsoft opent in de demo een keuze uit verzonnen pasjes. Met `?traag=10` speel je de opening tien keer zo langzaam af.
- **Paneel staat stil.** De hoogte van het missiepaneel hing af van de hoogte van het paneel zelf, waardoor het in level 1 elke halve seconde tien pixels groeide en na ruim twee seconden terugsprong. De meting in `assets/js/orion-bridge.js` kijkt nu alleen naar de inhoud. In level 1 reserveert de sprekende tekst vooraf de ruimte van de hele zin en staat de knop Tekst direct tonen in de hoek van het tekstvak, zodat de antwoorden niet meer verspringen.
- **Station beweegt gelijkmatig.** Tijdens een missie tekende het station om en om na 33 en 50 milliseconden een beeld. Dat is nu elk tweede beeld van het scherm. De zweefbeweging van de camera is een vaste functie van de tijd en hangt niet meer af van het beeldritme.
- **Tempo.** Achter de gesloten poort tekent het station twee beelden per seconde. De gang achter de deur bouwt zijn tekenbuffer niet meer bij elk beeld opnieuw op. De vlakken boven het 3D-beeld vervagen de achtergrond niet meer. Schaduwen worden alleen opnieuw getekend als er iets zichtbaar bewogen heeft. Het eerste level laadt op de achtergrond zodra je binnen bent.
- **Kwaliteit volgt de machine.** Zakt het scherm onder ongeveer 45 beelden per seconde, dan wordt het beeld eerst minder scherp. Onder ongeveer 28 gaat de gloed uit. Het bereikte niveau blijft een week bewaard in de browser. Met `?fx=nieuw` meet het spel opnieuw, met `?perf=1` zie je een meter.

- Ronde 23 tot en met 25 (25 november 2026): statusbalk in de schil, route met de eindmissie in drie delen en een resultaatvlag, welkomstscherm met scanpoort, cryo-archief als archiefkast, luiken met een keuze per gegeven, aanwijzingen via ARIA, hoofdsluis met vijf grendels, de Zwarte Nevel als rook in het station, level 5 dat met alarm opent, logboek als eindscherm, portretten bij alle personen, een startkaart bij elke oefenronde, Phishing Invaders tien procent rustiger en de losse HTML als één script zodat die ook in een afgeschermde voorvertoning start.
- Testsprong: `index.html?boot=uit&ls=3&scherm=sluis` opent level 3 direct op de luchtsluis. De schermnamen staan onderaan elke `game.js`. Met `?paniek=uit` sla je de alarmopening van level 5 over.
- Oude taal aangepast: soldij is loon, hint is aanwijzing, hullbreuk is alarm in module Kepler.

- Ronde 17: het station is het menu op het startscherm, een demo-inlog met verzonnen accounts, een beheerpagina met voortgang per label en afdeling (fictieve testgegevens), de aarde uit NASA-beelden die langzaam draait, een rustiger einde van Lekken dichten en een prestatiemeter via `?perf=1`.
- Ronde 18: de sprintruimte kreeg wanden rond een raam, de containers kregen de merkkleuren en de bovenbalk verloor zijn kaders.
- Ronde 19: Phishing Invaders speelt in een dok met containers, de sprint kreeg raamlicht en een projectie onder de kaart, de hullbreuk werd breder, elke module kreeg een eigen camerastand en het missiepaneel eindigt waar de inhoud eindigt.
- Ronde 20: de zon staat opzij zodat het station een schaduwkant heeft, de hullbreuk toont het binnenwerk, de schotel is naar de camera gedraaid en de regels van een level staan als korte lijst.
- Ronde 21: dokwand achter de containers en dekplaten als vloer. De rustiger rompstructuur en het lagere vullicht van deze ronde scoorden lager en zijn in ronde 22 teruggedraaid.
- Ronde 22: romp en licht terug naar ronde 20, de brede zonneglans op zee is klein gemaakt, het dok is donkerder, de afzender van een bericht staat op leesgrootte en de beheerpagina heeft een rustiger achtergrond.
- Beoordeling door twee critici zonder voorkennis, gemiddelde van 0 tot 100: ronde 17 65,9, ronde 18 66,2, ronde 19 67,2, ronde 20 68,8, ronde 21 64,2 en ronde 22 66,8. Het zijn schattingen, geen metingen.

- Ronde 16: Nalezen. Elk half goed of fout antwoord, in de levels en in de arcade, komt met de uitleg in een lijst die je via de knop Nalezen waarom opent. Witte teksten boven de aarde staan op een donkere sluier en op dichtere kaarten.

- Ronde 15: reflecties uit echte omgevingskaarten (vier HDRI's van Poly Haven, CC0, verkleind, zie `assets/hdri/CREDITS.md`) en een rustige vraagweergave. Zolang een vraag openstaat toont het level alleen de vraag, en een antwoord geeft één rustig signaal.

- Ronde 14: beginscherm met uitleg tijdens het laden, de aarde met de plek van VCSW, een vaste camerastand per module, rijkere modellen (shuttle, ziekenboeg, passagiersmodule, geschut), contactschaduw, de knop Tijdsdruk die alle timers stilzet, een skiplink, en foute antwoorden die even concreet zijn als de goede.

- Ronde 12: echte texturen op het station, bloom, de vier arcaderondes in een 3D-speelveld, antwoorden in level 2, level 5 en de eindmissie per poging in een andere volgorde. Met `?fx=uit` zet je de bloom uit, met `?3d=uit` speel je zonder 3D.

Wijzigingen gaan via een branch en een pull request met review door een collega. Een Pages-site is standaard voor iedereen te bezoeken, ook als de repository privé is. Zet GitHub Pages dus alleen aan als dat de bedoeling is.

## Gebruikte bronnen

- three.js r170, MIT-licentie, zie `assets/vendor/LICENSE-three.txt`.
- Lettertypen Figtree en Source Sans 3 via Google Fonts (SIL Open Font License).
- Iconen in de stijl van Lucide (ISC-licentie), als inline SVG in de code.
- De vormen van het station, ARIA, de planeet en de sterren zijn in code gemaakt. Er worden geen modellen of foto's geladen.
- De oppervlakken gebruiken acht texturen van ambientCG onder CC0 1.0. Bron, ID en bewerking per textuur staan in `assets/textures/CREDITS.md`.
- De bloom en de contactschaduw (GTAO) komen uit de three.js addons (r170, MIT), in `assets/vendor/addons/`.
- De aarde gebruikt beelden van NASA (publiek domein), zie `assets/textures/earth/CREDITS.md`. De witte stip staat op Den Haag (52,07 noord, 4,34 oost).
- Het spel en de teksten zijn gemaakt met hulp van AI (Claude). De inhoud wacht op goedkeuring van de Privacy Officer.
