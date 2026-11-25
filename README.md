# AVG-game Ruimtestation Orion

Een AVG-training van VCSW in de vorm van een game. Spelers zijn Cadet van de Datawacht op Ruimtestation Orion en doorlopen vijf levels en een eindmissie over het beschermen van persoonsgegevens.

Status: prototype. Alle namen, planeten en gegevens in het spel zijn fictief. De goede antwoorden, stappen en termijnen wachten nog op goedkeuring van de Privacy Officer.

## Levels

| Level | Onderwerp | Map |
| --- | --- | --- |
| Level 1 | Aankomst op het station | [levels/level-1-aankomst](levels/level-1-aankomst) |
| Level 2 | De passagiersmodule | [levels/level-2-passagiersmodule](levels/level-2-passagiersmodule) |
| Level 3 | De medische ziekenboeg | [levels/level-3-ziekenboeg](levels/level-3-ziekenboeg) |
| Level 4 | Het vrachtdok | [levels/level-4-vrachtdok](levels/level-4-vrachtdok) |
| Level 5 | Hullbreuk! Alarmfase | [levels/level-5-hullbreuk](levels/level-5-hullbreuk) |
| Eindmissie | Een bericht van de aarde | [levels/eindmissie-bericht-van-de-aarde](levels/eindmissie-bericht-van-de-aarde) |

## Opbouw

```
index.html                 Startpagina met de levelbalk, toont elk level in een iframe
assets/
  css/vcsw-brand.css       VCSW-huisstijl (kleuren, typografie, knoppen, kaarten), gedeeld door alles
  css/launcher.css         Opmaak van de levelbalk
  js/launcher.js           Lijst met levels en de navigatie ertussen
  img/                     VCSW-woordmerk voor lichte en donkere achtergrond
levels/<level>/
  index.html               Pagina van het level (statusbalk, speelveld)
  style.css                Opmaak die alleen voor dit level geldt
  game.js                  Spellogica en alle teksten, vragen en antwoorden van dit level
tools/
  serve.mjs                Lokale webserver
  bundle.mjs               Maakt weer één los HTML-bestand van het hele spel
```

Elk level werkt op zichzelf. Je kunt `levels/<level>/index.html` dus ook los openen en testen.

## Lokaal draaien

Je hebt alleen [Node.js](https://nodejs.org) 18 of nieuwer nodig, er zijn geen andere pakketten.

```powershell
npm start
```

Open daarna <http://localhost:8080>. Na een wijziging ververs je de pagina in de browser.

Dubbelklikken op `index.html` werkt in de meeste browsers ook, maar via de server gedraagt het spel zich hetzelfde als online.

## Aanpassen

- Teksten, vragen, antwoorden en feedback van een level staan in `game.js` van dat level. Zoek op de zin die je wilt wijzigen.
- Opmaak van één level wijzig je in `style.css` van dat level. Kleuren en lettertypen voor alles komen uit `assets/css/vcsw-brand.css`; pas die alleen aan als de huisstijl verandert.
- Een level toevoegen, weghalen of de volgorde wijzigen doe je in de lijst `LEVELS` bovenin `assets/js/launcher.js`. Een nieuw level is het makkelijkst te maken door een bestaande levelmap te kopiëren.
- Level 2, level 5 en de eindmissie zijn op dezelfde manier opgebouwd. Level 1, 3 en 4 hebben elk een eigen opbouw. Kijk bij twijfel naar een level dat op het jouwe lijkt.

## Eén bestand maken

Wil je het spel als één bestand versturen of in een leeromgeving zetten:

```powershell
npm run bundle
```

Het resultaat staat in `dist/AVG-game_Ruimtestation_Orion.html`. De map `dist/` gaat niet mee naar GitHub.

## Publiceren op GitHub

1. Maak een nieuwe repository aan, bij voorkeur privé binnen de VCSW-organisatie.
2. Zet de bestanden erin:

   ```powershell
   git init -b main
   ```

   ```powershell
   git add .
   ```

   ```powershell
   git commit -m "Eerste versie AVG-game Ruimtestation Orion"
   ```

   ```powershell
   git remote add origin https://github.com/<organisatie>/<repository>.git
   ```

   ```powershell
   git push -u origin main
   ```

3. Wil je het spel online spelen, zet dan GitHub Pages aan via Settings, Pages, Deploy from a branch, `main` en map `/ (root)`. Let op: een Pages-site is standaard voor iedereen te bezoeken, ook als de repository privé is. Alleen met GitHub Enterprise Cloud kun je de toegang tot de site beperken.

Wijzigingen daarna gaan via een branch en een pull request met review door een collega.

## Gebruikte bronnen

- Lettertypen Figtree en Source Sans 3 via Google Fonts (SIL Open Font License).
- Iconen in de stijl van Lucide (ISC-licentie), als inline SVG in de code.
