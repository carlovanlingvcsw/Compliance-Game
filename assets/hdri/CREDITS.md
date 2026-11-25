# Credits

HDRI-omgevingskaarten voor belichting en reflecties, als aanvulling op orion-assets.zip en orion-assets-extra.zip. Alle HDRI's zijn CC0 1.0 Universal (publiek domein). De licentie is op 2026-11-25 per HDRI op de bronpagina gecontroleerd. De bestanden zijn ongewijzigd (MD5 gecontroleerd tegen de Poly Haven API) en alleen hernoemd.

Datum van ophalen: 2026-11-25.

## HDRI's

| Naam | Origineel (ID) | Bron | URL | Licentie | Resolutie | Formaat | Gebruik | Auteurs |
|---|---|---|---|---|---|---|---|---|
| env_studio | Ferndale Studio 11 (ferndale_studio_11) | Poly Haven | https://polyhaven.com/a/ferndale_studio_11 | CC0 | 2K (2048x1024) | .hdr (RGBE) | Algemene belichting en reflecties, ook voor buitenopnamen van het station (donker plafond met lichtbuizen) | Dimitrios Savva (Photography), Greg Zaal (Processing) |
| env_corridor | Metro: Vijzelgracht (metro_vijzelgracht) | Poly Haven | https://polyhaven.com/a/metro_vijzelgracht | CC0 | 1K (1024x512) | .hdr (RGBE) | Gangen en verbindingsbuizen (gebogen moderne tunnel) | Greg Zaal (All) |
| env_medbay | Hospital Room 2 (hospital_room_2) | Poly Haven | https://polyhaven.com/a/hospital_room_2 | CC0 | 1K (1024x512) | .hdr (RGBE) | Ziekenboeg (lichte, klinische ruimte) | Dimitrios Savva (Photography), Jarod Guest (Processing) |
| env_hangar | Hangar Interior (hangar_interior) | Poly Haven | https://polyhaven.com/a/hangar_interior | CC0 | 1K (1024x512) | .hdr (RGBE) | Vrachtruim en containerhal | Dimitrios Savva (Photography), Jarod Guest (Processing) |

env_studio is 2K omdat die het vaakst in reflecties van metaal en chroom te zien is. De andere drie zijn 1K om de totale omvang onder 15 MB te houden.

## three.js r170

`assets/vendor/addons/loaders/RGBELoader.js` uit `examples/jsm/` van three.js, tag r170, ongewijzigd. Nodig om .hdr-bestanden te laden. Importeert alleen uit `three`.

- Bron: https://github.com/mrdoob/three.js/tree/r170
- Licentie: MIT, zie `LICENSE-three.txt` (Copyright © 2010-2024 three.js authors)
- Opgehaald: 2026-11-25


## Bewerking voor het spel

De bestanden in deze map zijn verkleind met OpenCV: env_studio naar 512 x 256, de andere drie naar 256 x 128. Voor reflecties op ruw metaal is dat genoeg, en het losse HTML-bestand blijft zo klein. CC0 staat bewerken toe.
