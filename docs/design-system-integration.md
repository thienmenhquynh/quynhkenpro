# Foundation 9tek / 9Proptech v2.1

The attached specification is preserved in `9proptech-design-system-v2.1.md`.

This portfolio remains a static HTML/CSS/JavaScript site. `assets/design-system.css` defines the source's light and dark token palettes and aliases the original portfolio variables to them. Component rules apply the source's fonts, typography, 4px spacing, 6/8/10/14px radii, button variants, accessible input names, focus rings and accessible touch targets without changing product data or introducing CRM navigation.

- Themes: `light`, `dark` on `html[data-theme]`. All themed sections, featured cards and the detail dialog follow the page theme.
- The navigation moon/sun button is the only appearance control. The CV menu contains CV choices only; the footer contains the brand and right-aligned copyright only. Explicit choices persist; an unset preference uses Light. The existing moon/sun button toggles light/dark. Previous high-contrast preferences migrate to the matching light or dark theme.
- Project filters keep their labels available to assistive technology while displaying only the select controls, as requested.
- Lexend, Mona Sans and Be Vietnam Pro are self-hosted from Fontsource 5.3.0, including Vietnamese subsets, so font rendering does not require Google Fonts access. SIL OFL licenses are in `assets/fonts/`.
- SVG symbols use `lucide-static@0.460.0`; its license is in `assets/LUCIDE-LICENSE.txt`.
- The original screenshots, product content, analytics, native controls, view switching, free-height tables, sticky controls and 8–4 detail layout are retained.
- Brand gradient matches the supplied token exactly: `linear-gradient(100deg, #DEFEFF 0%, #2EE4FF 48%, #A2FF00 100%)`. It appears only in the brand mark and decorative landing-hero field. Text, buttons, AI icons, tools cards, product cards and selected tabs use semantic solid colors. Neutral photo overlays serve legibility rather than brand coloring.

- Section headings use a 32px gap before content on desktop and 24px on tablet/mobile.
- `assets/hero.css` gives the hero one restrained brand light field, stronger typography and a raised portrait. The career lap and checkpoint markers remain; circuit layers, repeated typewriter loops and pointer tilt have been retired; content and grid order stay intact.
- Section backgrounds alternate semantic `card`, `muted`, `background` and `secondary` surfaces; the contact section uses `accent`. The landing hero's brand field stays around the portrait and fades before the copy. Both themes retain their own tokens and all sections continue to follow the selected theme.

- `assets/components.css` defines distinct quiet, card, raised and media elevations in each theme. Supporting capability cards stay subdued; profile narratives, featured products and screenshots carry the main visual weight. Component grids, native interactions and sticky offsets are unchanged.
