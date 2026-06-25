// ============================================================
// KIDDO SDUI — Full Type System (Strict Mode)
// ============================================================

// ──────────────────────────────────────────────────────────
// THEME
// ──────────────────────────────────────────────────────────
export interface ThemeConfig {
  primary: string;
  secondary?: string;
  background: string;
  surface?: string;
  text?: string;
  textSecondary?: string;
  accent?: string;
  border?: string;
}

// ──────────────────────────────────────────────────────────
// ACTIONS
// ──────────────────────────────────────────────────────────
export type ActionType =
  | 'ADD_TO_CART'
  | 'DEEP_LINK'
  | 'OPEN_CATEGORY'
  | 'APPLY_MYSTERY_GIFT_COUPON'
  | 'BOOK_EVENT'
  | 'OPEN_SEARCH'
  | 'SHARE';

export interface AddToCartPayload {
  id: string;
  name?: string;
  price?: number;
  quantity?: number;
}

export interface DeepLinkPayload {
  url: string;
}

export interface OpenCategoryPayload {
  categoryId: string;
  title?: string;
}

export interface ApplyGiftCouponPayload {
  couponCode: string;
  productId?: string;
}

export interface BookEventPayload {
  eventId: string;
  title?: string;
}

export type ActionPayload =
  | AddToCartPayload
  | DeepLinkPayload
  | OpenCategoryPayload
  | ApplyGiftCouponPayload
  | BookEventPayload
  | Record<string, unknown>;

export interface ActionSchema {
  type: ActionType | string;
  payload: ActionPayload;
}

// ──────────────────────────────────────────────────────────
// COMPONENT BLOCKS
// ──────────────────────────────────────────────────────────

// BANNER_HERO
export interface BannerHeroBlock {
  type: 'BANNER_HERO';
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  cta_label?: string;
  action?: ActionSchema;
  badge?: string;
}

// PRODUCT ITEM (used in grids and carousels)
export interface ProductItem {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  badge?: string;
  rating?: number;
  action: ActionSchema;
}

// PRODUCT_GRID_2X2
export interface ProductGrid2x2Block {
  type: 'PRODUCT_GRID_2X2';
  id: string;
  title?: string;
  items: ProductItem[];
}

// DYNAMIC_COLLECTION
export interface DynamicCollectionBlock {
  type: 'DYNAMIC_COLLECTION';
  id: string;
  title: string;
  subtitle?: string;
  items: ProductItem[];
  see_all_action?: ActionSchema;
}

// CAMPAIGN OVERLAY
export interface CampaignOverlay {
  type: 'FULL_SCREEN_OVERLAY';
  animation_url: string;
}

// Union of all known block types
export type KnownBlock =
  | BannerHeroBlock
  | ProductGrid2x2Block
  | DynamicCollectionBlock;

// Unknown block — arrives from server but not registered
export interface UnknownBlock {
  type: string;
  id: string;
  [key: string]: unknown;
}

// Any block that may arrive
export type AnyBlock = KnownBlock | UnknownBlock;

// ──────────────────────────────────────────────────────────
// CAMPAIGN
// ──────────────────────────────────────────────────────────
export type CampaignId = 'back_to_school' | 'summer_playhouse' | 'mystery_carnival';

export interface Campaign {
  id: CampaignId;
  name: string;
  theme: ThemeConfig;
  overlay?: CampaignOverlay;
  lottie_url?: string;
  featured_collection_title?: string;
}

// ──────────────────────────────────────────────────────────
// ROOT PAYLOAD
// ──────────────────────────────────────────────────────────
export interface SDUIPayload {
  version: string;
  theme: ThemeConfig;
  active_campaign?: CampaignId;
  campaigns: Campaign[];
  blocks: AnyBlock[];
}

// ──────────────────────────────────────────────────────────
// COMPONENT REGISTRY
// ──────────────────────────────────────────────────────────
export type BlockRenderer<T extends AnyBlock = AnyBlock> = React.ComponentType<{
  block: T;
  theme: ThemeConfig;
  onAction: (action: ActionSchema) => void;
}>;

export type ComponentRegistry = Partial<Record<string, BlockRenderer<any>>>;

// ──────────────────────────────────────────────────────────
// CART
// ──────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface CartState {
  items: Record<string, CartItem>;
  totalCount: number;
  totalPrice: number;
}
