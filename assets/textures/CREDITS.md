# Credits

Opgehaald op 2026-11-25.

## Texturen

Alle texturen komen van ambientCG en vallen onder Creative Commons CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/). De licentie is per textuur gecontroleerd op de assetpagina zelf.

| Naam | Origineel (ID) | URL | Bron | Licentie | Resolutie | Kaarten | Opgehaald |
|---|---|---|---|---|---|---|---|
| hull_light | Metal Plates 004 (MetalPlates004) | https://ambientcg.com/view?id=MetalPlates004 | ambientCG | CC0 1.0 | 1024 x 1024 (1K) | color, normal, roughness, metalness | 2026-11-25 |
| hull_dark | Metal 028 (Metal028) | https://ambientcg.com/view?id=Metal028 | ambientCG | CC0 1.0 | 1024 x 1024 (1K, origineel) | color, normal, roughness, metalness | 2026-11-25 |
| hull_white | Metal 016 (Metal016) | https://ambientcg.com/view?id=Metal016 | ambientCG | CC0 1.0 | 1024 x 1024 (1K, origineel) | color, normal, roughness, metalness | 2026-11-25 |
| foil | Foil 002 (Foil002) | https://ambientcg.com/view?id=Foil002 | ambientCG | CC0 1.0 | 1024 x 1024 (1K, origineel) | color, normal, roughness, metalness, ao | 2026-11-25 |
| truss | Metal 009 (Metal009) | https://ambientcg.com/view?id=Metal009 | ambientCG | CC0 1.0 | 512 x 512 (verkleind van 1K) | color, normal, roughness, metalness | 2026-11-25 |
| grate | Diamond Plate 001 (DiamondPlate001) | https://ambientcg.com/view?id=DiamondPlate001 | ambientCG | CC0 1.0 | 512 x 512 (verkleind van 1K) | color, normal, roughness, metalness | 2026-11-25 |
| container | Corrugated Steel 005 (CorrugatedSteel005) | https://ambientcg.com/view?id=CorrugatedSteel005 | ambientCG | CC0 1.0 | 512 x 512 (verkleind van 1K) | color, normal, roughness, metalness, ao | 2026-11-25 |
| solar | Solar Panel 003 (SolarPanel003) | https://ambientcg.com/view?id=SolarPanel003 | ambientCG | CC0 1.0 | 512 x 512 (verkleind van 1K) | color, normal, roughness, metalness | 2026-11-25 |

Normal maps zijn de OpenGL-variant (ambientCG "NormalGL"). Displacement en NormalDX zijn niet meegenomen. Texturen met resolutie 512 zijn door ons verkleind van de 1K-JPG-download om binnen de 15 MB te blijven. De overige bestanden zijn ongewijzigde kopieën van de 1K-JPG-download, alleen hernoemd.

## three.js r170

Bestanden in `assets/vendor/addons/` zijn ongewijzigde kopieën uit `examples/jsm/` van three.js, tag r170 (commit 232de0cb2d49a3f28d84a8ca9cc4bbf806771736).

- Bron: https://github.com/mrdoob/three.js/tree/r170/examples/jsm
- Tag: https://github.com/mrdoob/three.js/releases/tag/r170
- Licentie: MIT, Copyright © 2010-2024 three.js authors. Zie LICENSE-three.txt.
- Opgehaald: 2026-11-25

## Aanvulling uit orion-assets-extra.zip

| Naam | Origineel (ID) | URL | Bron | Licentie | Kaarten | Opgehaald |
|---|---|---|---|---|---|---|
| scifi_panel | Metal Plates 015 A (MetalPlates015A) | https://ambientcg.com/view?id=MetalPlates015A | ambientCG | CC0 1.0 | color, normal, roughness, metalness, ao | 2026-11-25 |
| rubber_floor | Rubber Tiles (rubber_tiles), auteur Amal Kumar | https://polyhaven.com/a/rubber_tiles | Poly Haven | CC0 1.0 | color, normal, roughness, ao | 2026-11-25 |
| heat_shield | Tiles 138 (Tiles138) | https://ambientcg.com/view?id=Tiles138 | ambientCG | CC0 1.0 | color, normal, roughness, ao | 2026-11-25 |
| plastic_white | Plastic 013 A (Plastic013A) | https://ambientcg.com/view?id=Plastic013A | ambientCG | CC0 1.0 | color, normal, roughness | 2026-11-25 |

De overige zes texturen uit die zip (scifi_vent, carbon, copper, brass_trim, chrome, perforated) zijn niet in het spel opgenomen.

## Bewerking voor het spel

De bestanden in deze map zijn webversies, gemaakt met `tools/prepare-textures.py`: verkleind naar 512 x 512, ruwheid, metaal en ambient occlusion samengevoegd in één bestand (`orm.jpg`), en de kleur van hull_light, hull_dark, hull_white, container en truss aangepast aan de kleuren van het station. CC0 staat bewerken toe. Van three.js r170 zijn alleen de addons meegenomen die het spel gebruikt (EffectComposer, RenderPass, ShaderPass, MaskPass, Pass, UnrealBloomPass, OutputPass, GTAOPass, SimplexNoise en de bijbehorende shaders).

De map `earth` bevat geen textuur van derden. `land.jpg` is gemaakt met `tools/make-earth.py` uit kustlijnen die met de hand zijn ingevoerd.
