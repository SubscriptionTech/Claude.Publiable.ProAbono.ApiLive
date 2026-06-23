# ProAbono API Live — Documentation

Reference documentation for the [ProAbono](https://www.proabono.com) API Live.

## About ProAbono

ProAbono is a subscription billing platform.

## About the API Live

The ProAbono API Live is the integration surface for developers embedding subscription management into their products. It covers the full subscription lifecycle: customers, offers, subscriptions, features, usage tracking, quoting, and invoicing.

## Running the website

### Development mode (no search)

```bash
cd website
npm install   # first time only
npm start
```

The site is served at `http://localhost:3000`. Search is not available in this mode.

### Production mode (with search)

The search engine (Pagefind) requires a production build to work.

```bash
cd website
npm install   # first time only
npm run build
npm run serve
```

The site is served at `http://localhost:3000`.
