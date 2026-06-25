# Kiddo SDUI

This is my submission for the Kiddo tech assignment. The task was to build a Server-Driven UI engine for Kiddo's homepage — where the entire screen is controlled by a JSON payload, with no app store updates needed to change the UI.

---

## What I Built

A React Native app (Expo) where the homepage is fully driven by a `payload.json` file. Swap the JSON, the whole UI changes — layouts, themes, campaigns, products, everything.

The app has:
- A dynamic homepage feed that renders different block types from JSON
- 3 live campaigns that change the entire app theme when switched
- A cart system that's carefully isolated so adding one product doesn't re-render the whole screen
- Full scroll performance work so horizontal carousels don't break vertical scrolling

---

## Getting Started

```bash
npm install
npx expo start
```

---

## How It Works

### The JSON Payload

Everything comes from `src/data/payload.json`. It contains the base theme, 3 campaign configs, and a list of blocks. Each block has a `type` field — the app reads that and decides what to render.

The payload also has a block the app doesn't know about (`NEW_COMPONENT_V2`) — that gets silently skipped without crashing anything.

### Component Registry

Instead of a big if/else or switch statement, I used a simple object map:

```typescript
const COMPONENT_REGISTRY = {
  BANNER_HERO: BannerHeroComponent,
  PRODUCT_GRID_2X2: ProductGridComponent,
  DYNAMIC_COLLECTION: DynamicCollectionComponent,
};
```

To add a new block type in the future, you just add one line here. Nothing else changes.

### Campaign Engine

There are 3 campaigns — Back to School, Summer Playhouse, and Mystery Carnival. Each one has its own theme colors, Lottie animation URL, and featured collection. Switching campaigns instantly changes the header color, badge colors, backgrounds, buttons — everything — with no app update.

The campaign switcher is shown at the top of the feed so you can try all three.

### Theming

The theme from the JSON gets injected into a React Context at the root. Every component reads colors from this context — nothing is hardcoded. When a campaign is active, its theme overrides the base one automatically.

### Cart State

This was the tricky part. The requirement was that adding a product to cart should NOT re-render all 30+ blocks on screen.

I solved this by splitting the cart into 3 separate contexts:
- One for the full cart state (only the cart screen needs this)
- One for dispatch (stable reference, never causes re-renders)
- One just for the count (only the header badge subscribes to this)

Each product card also has its own `useCartItem(id)` hook that only re-renders when that specific product's quantity changes. So if you add Product A to cart, only Product A's card and the header badge re-render. Nothing else moves.

### Horizontal Scroll Inside Vertical Scroll

The carousels are horizontal FlatLists inside a vertical FlatList. To make sure horizontal scrolling doesn't break vertical momentum I used:

- `nestedScrollEnabled={true}`
- `disableIntervalMomentum={true}`
- `getItemLayout` with fixed card widths so nothing needs to be measured at scroll time

### Campaign Overlay

When a campaign is active, an animated overlay runs over the full screen (confetti particles for Mystery Carnival etc). It uses `pointerEvents="none"` so it sits on top visually but doesn't block any taps or scrolls.

---

## Project Structure

```
src/
├── data/
│   └── payload.json          # The mock server payload
├── types/
│   └── index.ts              # All TypeScript types (strict mode)
├── context/
│   ├── ThemeContext.tsx       # App-wide theme from JSON
│   ├── CartContext.tsx        # Split cart contexts
│   └── CampaignContext.tsx    # Active campaign state
├── actions/
│   └── dispatcher.ts         # Central action handler
├── hooks/
│   └── useSDUI.ts            # Wires payload + dispatcher together
├── components/
│   ├── HomeFeed.tsx          # The main vertical FlatList
│   ├── registry.tsx          # Block type → component map
│   ├── blocks/
│   │   ├── BannerHeroBlock.tsx
│   │   ├── ProductGrid2x2Block.tsx
│   │   └── DynamicCollectionBlock.tsx
│   ├── campaign/
│   │   ├── CampaignOverlay.tsx
│   │   └── CampaignSwitcher.tsx
│   └── common/
│       ├── ProductCard.tsx
│       ├── HomeHeader.tsx
│       └── CategoryStrip.tsx
└── HomeScreen.tsx
```

---

## A Few Decisions Worth Mentioning

**Why a hash-map registry instead of switch/case** — switch blocks need to be edited every time a new block type is added, which is risky in production. With the map, it's one line and you're done.

**Why split CartContext into 3** — a single cart context would re-render every subscriber on every cart update. With 30+ blocks on screen that's a lot of wasted renders. Splitting it means only the components that actually need to update do.

**Why useRef for the dispatcher** — the action dispatcher is created once and stored in a ref. This keeps `onAction` reference stable across renders, which is important because it's a dependency of every memoized block's render check.

**TypeScript strict mode** — everything is typed. Block types are discriminated unions, action payloads are typed per action type, no `any` except where React Native's style system requires it for web CSS properties.