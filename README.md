# UKCEH at IC1 — Website

A one-page site showcasing UKCEH's involvement in the first International Conference of the Global Framework on Chemicals (IC1). It uses the UKCEH Quarto template from the [LLM SIG site](https://nerc-ceh.github.io/llmsig/).

## Setup

Install [Pixi](https://pixi.sh/), then:

```bash
pixi run preview   # live preview while editing
pixi run render    # build the site into _output/ for deployment
```

Pixi installs Quarto into a project-local environment (`.pixi/`) on first run.

## Pages

- `index.qmd`: the home page, with links to the pages below
- `monitoring.qmd`: Monitoring chemicals in the environment
- `analysis.qmd`: Advanced chemical analysis (placeholder)
- `actions.qmd`: Prioritising actions

Each subpage's `subtitle` is shown as the bracket label above its title. On the actions page, each case study is a `### Heading {.case}` section, which renders as a card.

## Editing the home page

The home page lives in `index.qmd`:

- The title banner comes from the `title`, `subtitle` (shown as the bracket label) and `description` front matter.
- The **About** section's first paragraph is wrapped in `::: {.lead}` for larger intro text.
- Each link in **Find Out More** is a `.link-card` inside the `.link-grid`. Copy a card block to add another; the whole card is clickable.
- Card photos live in `assets/images/` and are cropped to 3:2 automatically. Use images at least ~800px wide so they stay sharp on high-resolution screens.

Branding (colours, logos) is set in `_brand.yml`, and component styles in `styles.css`.

## Analytics and cookie consent

Google Analytics only loads after a visitor accepts it in the cookie banner (`assets/js/consent.js`). The choice is remembered for six months, and the **Cookie preferences** link in the footer reopens the banner. Rejecting after accepting deletes the Google Analytics cookies.

The measurement ID is set on the script tag in `_quarto.yml` (`data-ga-id`). It is currently the placeholder `G-XXXXXXXXXX`, so the banner works but nothing is sent to Google. Replace it with the GA4 ID from the web team, or use `data-gtm-id="GTM-..."` instead for Google Tag Manager.

## Publishing to GitHub Pages

```bash
pixi run publish
```

This renders the site and pushes it to a `gh-pages` branch.
