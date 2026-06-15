# ProAbono API Live — Documentation

Reference documentation for the [ProAbono](https://www.proabono.com) API Live.

## About ProAbono

ProAbono is a subscription billing platform.

## About the API Live

The ProAbono API Live is the integration surface for developers embedding subscription management into their products. It covers the full subscription lifecycle: customers, offers, subscriptions, features, usage tracking, quoting, and invoicing.

## Running the website

```bash
cd website
npm install   # first time only
npm start
```

The site is served at `http://localhost:3000`. By default the dev server runs the English locale only.

### Running with a specific locale

```bash
npx docusaurus start --locale fr
```

The site is then served at `http://localhost:3000/fr/`. See [description/i18n.md](description/i18n.md) for details on the single-locale dev server limitation.
