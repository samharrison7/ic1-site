# UKCEH at IC1 — Website

A one-page site showcasing UKCEH's involvement in the first International Conference of the Global Framework on Chemicals (IC1). It uses the UKCEH Quarto template from the [LLM SIG site](https://nerc-ceh.github.io/llmsig/).

## Setup

Install [Pixi](https://pixi.sh/), then:

```bash
pixi run preview   # live preview while editing
pixi run render    # build the site into _output/ for deployment
```

Pixi installs Quarto into a project-local environment (`.pixi/`) on first run.

## Editing the page

All content lives in `index.qmd`:

- The title banner comes from the `title`, `subtitle` (shown as the bracket label) and `description` front matter.
- The **About** section's first paragraph is wrapped in `::: {.lead}` for larger intro text.
- Each link in **Find Out More** is a `.link-card` inside the `.link-grid`. Copy a card block to add another; the whole card is clickable.
- Card photos live in `assets/images/` and are cropped to 3:2 automatically. Use images at least ~800px wide so they stay sharp on high-resolution screens.

Branding (colours, logos) is set in `_brand.yml`, and component styles in `styles.css`.

## Publishing to GitHub Pages

```bash
pixi run publish
```

This renders the site and pushes it to a `gh-pages` branch.
