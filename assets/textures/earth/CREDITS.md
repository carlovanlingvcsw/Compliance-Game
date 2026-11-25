# Credits

Texturen voor de aarde achter het station, als aanvulling op orion-assets.zip, orion-assets-extra.zip en orion-hdri.zip.

**Afwijking van de bronregel.** ambientCG en Poly Haven hebben geen aardtexturen, en NASA Visible Earth was niet bereikbaar. Met akkoord van de opdrachtgever zijn daarom NASA-beelden via Wikimedia Commons gebruikt. Die zijn publiek domein als werk van de Amerikaanse overheid (geen formele CC0-verklaring, wel vrij bruikbaar). De licentie is op 2026-11-25 per bestand op de Commons-bestandspagina gecontroleerd (sjabloon PD-NASA of PD-USGov-NASA). Wolkenkaarten met een CC BY-licentie (Solar System Scope) zijn bewust overgeslagen.

**NASA-voorwaarden.** NASA vraagt om bronvermelding ("NASA") en het beeld mag niet suggereren dat NASA het product onderschrijft. Gebruik geen NASA-logo's.

**Geen HDR.** Geen van deze bronnen levert HDR- of floating-point-versies. Alle kaarten zijn 8-bit.

Alle kaarten zijn equirectangulair met Greenwich in het midden en lopen naadloos rond op de datumgrens (gecontroleerd). Datum van ophalen: 2026-11-25. Checksums (SHA-1) van de originelen zijn gecontroleerd tegen Commons.

| Bestand | Origineel | URL | Licentie | Resolutie | Gebruik | Bewerking | Maker |
|---|---|---|---|---|---|---|---|
| color.jpg | Blue Marble Next Generation + topography + bathymetry.jpg (3600x1800) | https://commons.wikimedia.org/wiki/File:Blue_Marble_Next_Generation_%2B_topography_%2B_bathymetry.jpg | Publiek domein (PD-NASA) | 3600x1800 | Dagkant van de aarde (colorMap), wolkenloos met reliëf en zeediepte | Ongewijzigd. | Reto Stöckli, NASA Earth Observatory (Blue Marble Next Generation, augustus 2004). Op Commons licht bewerkt door NordNordWest. |
| color_clouds.jpg | Land ocean ice cloud hires.jpg (8192x4096) | https://commons.wikimedia.org/wiki/File:Land_ocean_ice_cloud_hires.jpg | Publiek domein (PD-USGov-NASA) | 4096x2048 (verkleind van 8192x4096) | Alternatieve dagkant met wolken in het beeld (Blue Marble 2002) | Verkleind (bicubisch, horizontaal naadloos), JPG kwaliteit 90. | NASA Goddard Space Flight Center, Visible Earth (Blue Marble, MODIS). |
| night.jpg | The earth at night.jpg (13500x6750) | https://commons.wikimedia.org/wiki/File:The_earth_at_night.jpg | Publiek domein (PD-USGov-NASA) | 4096x2048 (verkleind van 13500x6750) | Nachtkant, stadslichten (emissiveMap) | Verkleind (bicubisch, horizontaal naadloos), JPG kwaliteit 90. | NASA Earth Observatory (Earth at Night, Suomi NPP VIIRS, 2012). |
| bump.jpg | Srtm ramp2.world.21600x10800.jpg (21600x10800) | https://commons.wikimedia.org/wiki/File:Srtm_ramp2.world.21600x10800.jpg | Publiek domein (PD-USGov-NASA) | 4096x2048 (verkleind van 21600x10800) | Hoogtekaart voor reliëf (bumpMap) | Verkleind (bicubisch, horizontaal naadloos), JPG kwaliteit 90. | Reto Stöckli, NASA Earth Observatory (SRTM-topografie). |
| ocean_mask.png | Land shallow topo alpha 2048.png (2048x1024) | https://commons.wikimedia.org/wiki/File:Land_shallow_topo_alpha_2048.png | Publiek domein (PD-USGov-NASA) | 2048x1024 | Watermasker, wit = oceaan (om oceanen glanzender te maken via roughness of een shader) | Alfakanaal uitgelicht en omgekeerd naar grijswaarden (wit = water). PNG omdat de bron PNG is. | NASA Goddard Space Flight Center (Blue Marble). Alfakanaal op Commons toegevoegd door een gebruiker, als afgeleid werk. |

Voorgestelde bronvermelding in de training: "Aardbeelden: NASA Earth Observatory / NASA Goddard Space Flight Center."


## Bewerking voor het spel

In het spel zitten drie verkleinde kaarten: color.jpg (2048 x 1024), night.jpg (1024 x 512) en ocean.jpg (1024 x 512, uit ocean_mask.png). De wolken worden in code getekend, zodat ze kunnen bewegen. bump.jpg en color_clouds.jpg zijn niet gebruikt. Bron van de beelden: NASA.
