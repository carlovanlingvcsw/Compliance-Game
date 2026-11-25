# AVG-game Ruimtestation Orion

Een AVG-training van VCSW in de vorm van een game. Spelers zijn Cadet van de Datawacht op Ruimtestation Orion. Ze vliegen langs zes modules van het station en spelen daar vijf levels, een eindmissie en vier arcaderondes over het beschermen van persoonsgegevens.

Status: prototype. Alle namen, planeten en gegevens in het spel zijn fictief. De goede antwoorden, stappen en termijnen wachten nog op goedkeuring van de Privacy Officer. Het 3D-station en ARIA zijn een concept: het VCSW-merk heeft nog geen goedgekeurde illustraties, dus marketing moet de beeldtaal nog goedkeuren.

## Zo werkt het spel

- **Station als wereld.** Het startscherm toont Ruimtestation Orion in 3D, met de stationskaart ernaast. Elke missie hoort bij een module. Kies je een missie, dan vliegt de camera naar die module en opent de missie in een paneel ernaast.
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
| Level 5 | Hullbreuk! Alarmfase | Module Kepler | [levels/level-5-hullbreuk](levels/level-5-hullbreuk) |
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

Het resultaat staat in `dist/AVG-game_Ruimtestation_Orion.html` (ongeveer 2,6 MB). Het werkt met dubbelklikken en zonder internet; alleen de lettertypen komen dan uit het systeem. De map `dist/` gaat niet mee naar GitHub.

## Wijzigingen

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
- De aarde gebruikt een landmasker dat met de hand is ingevoerd in `tools/make-earth.py`. Het is een schets en geen kaartdata. De witte stip staat op Den Haag (52,07 noord, 4,34 oost).
- Het spel en de teksten zijn gemaakt met hulp van AI (Claude). De inhoud wacht op goedkeuring van de Privacy Officer.
