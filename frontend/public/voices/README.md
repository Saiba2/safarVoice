# Photos des voix de démonstration

Déposez ici les portraits affichés dans l'aperçu produit de la page d'accueil
(`components/landing/LandingHero.tsx`).

## Fichiers attendus

| Fichier      | Voix   | Pays affiché |
|--------------|--------|--------------|
| `awa.svg`    | Awa    | Sénégal      |
| `thadee.svg` | Thadée | Mali         |
| `zuri.svg`   | Zuri   | Kenya        |
| `jamal.svg`  | Jamal  | Maroc        |

## Format

- **Carré**, 256 × 256 pixels minimum (elles sont affichées en 32 px, mais les
  écrans à haute densité en consomment deux à trois fois plus).
- **JPG** ou **WebP**. Pour changer d'extension, adaptez le chemin dans
  `PREVIEW_VOICES`, dans `LandingHero.tsx`.
- Cadrage centré sur le visage : l'image est rognée en cercle.
- Poids conseillé : moins de 80 Ko par fichier.

## Si un fichier manque

Rien ne casse : `PersonAvatar` détecte l'échec de chargement et affiche les
initiales sur fond de marque à la place. Vous pouvez donc en ajouter une seule
et compléter plus tard.

## Droits

Ces portraits sont associés à des **voix de synthèse fictives**. Assurez-vous
de détenir les droits d'usage commercial des images, et que les personnes
représentées ont consenti à cette utilisation.
