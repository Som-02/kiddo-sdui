import React, { memo } from 'react';
import { AnyBlock, ComponentRegistry, ActionSchema, ThemeConfig } from '../types';

// ──────────────────────────────────────────────────────────
// COMPONENT IMPORTS (lazy-loaded per block type)
// ──────────────────────────────────────────────────────────
import { BannerHeroBlock as BannerHeroComponent } from './blocks/BannerHeroBlock';
import { ProductGrid2x2Block as ProductGridComponent } from './blocks/ProductGrid2x2Block';
import { DynamicCollectionBlock as DynamicCollectionComponent } from './blocks/DynamicCollectionBlock';

// ──────────────────────────────────────────────────────────
// COMPONENT FACTORY REGISTRY
//
// Uses a hash-map (Record) pattern — NOT switch/case blocks.
// This is scalable: new component types are added by inserting
// one entry into COMPONENT_REGISTRY without touching any other
// code. Evaluated as O(1) lookup.
// ──────────────────────────────────────────────────────────
const COMPONENT_REGISTRY: ComponentRegistry = {
  BANNER_HERO: BannerHeroComponent as any,
  PRODUCT_GRID_2X2: ProductGridComponent as any,
  DYNAMIC_COLLECTION: DynamicCollectionComponent as any,
  // Future components are added here:
  // FLASH_SALE_TIMER: FlashSaleTimer,
  // CATEGORY_CHIPS: CategoryChipsBlock,
  // TESTIMONIAL_CAROUSEL: TestimonialCarousel,
};

// ──────────────────────────────────────────────────────────
// BLOCK RENDERER
//
// RESILIENCE CRITICAL RULE: If an unsupported type is parsed,
// we silently drop the node and preserve the surrounding
// view tree stability — zero crashes, zero visible errors.
// ──────────────────────────────────────────────────────────
export interface BlockRendererProps {
  block: AnyBlock;
  theme: ThemeConfig;
  onAction: (action: ActionSchema) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, theme, onAction }) => {
  if (!block || typeof block.type !== 'string') {
    if (__DEV__) {
      console.warn('[Registry] Invalid block — missing type field. Block dropped.');
    }
    return null;
  }

  const BlockComponent = COMPONENT_REGISTRY[block.type];

  if (!BlockComponent) {
    // RESILIENCE: Unknown component type — silently drop, log in dev only
    if (__DEV__) {
      console.warn(
        `[Registry] Unregistered block type: "${block.type}" (id: ${block.id ?? 'no-id'}). Dropped safely.`
      );
    }
    return null;
  }

  return <BlockComponent block={block as any} theme={theme} onAction={onAction} />;
};

// ──────────────────────────────────────────────────────────
// memo boundary — BlockRenderer itself won't re-render
// unless block reference, theme, or onAction changes
// ──────────────────────────────────────────────────────────
export const MemoizedBlockRenderer = memo(
  BlockRenderer,
  (prev, next) =>
    prev.block === next.block &&
    prev.theme === next.theme &&
    prev.onAction === next.onAction
);

// ──────────────────────────────────────────────────────────
// REGISTRY UTILITIES
// ──────────────────────────────────────────────────────────

// Register a new component type at runtime (extensible)
export function registerComponent(type: string, component: React.ComponentType<any>): void {
  COMPONENT_REGISTRY[type] = component;
  if (__DEV__) {
    console.log(`[Registry] Registered new block type: "${type}"`);
  }
}

// Check if a block type is supported
export function isBlockTypeSupported(type: string): boolean {
  return type in COMPONENT_REGISTRY;
}

// Validate and filter a payload's blocks — pre-flight check
export function filterSupportedBlocks(blocks: AnyBlock[]): {
  supported: AnyBlock[];
  dropped: string[];
} {
  const supported: AnyBlock[] = [];
  const dropped: string[] = [];

  for (const block of blocks) {
    if (block?.type && COMPONENT_REGISTRY[block.type]) {
      supported.push(block);
    } else {
      dropped.push(block?.type ?? 'UNKNOWN');
    }
  }

  if (__DEV__ && dropped.length > 0) {
    console.warn(`[Registry] Dropping ${dropped.length} unsupported blocks:`, dropped);
  }

  return { supported, dropped };
}
