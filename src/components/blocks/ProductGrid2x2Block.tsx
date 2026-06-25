import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductGrid2x2Block as ProductGrid2x2BlockType, ActionSchema, ThemeConfig } from '../../types';
import { ProductCard } from '../common/ProductCard';

// ──────────────────────────────────────────────────────────
// PRODUCT_GRID_2X2 BLOCK
// Balanced 2x2 grid of product catalog items.
// Each ProductCard is independently memoized.
// ──────────────────────────────────────────────────────────

interface ProductGrid2x2BlockProps {
  block: ProductGrid2x2BlockType;
  theme: ThemeConfig;
  onAction: (action: ActionSchema) => void;
}

const ProductGrid2x2BlockInner: React.FC<ProductGrid2x2BlockProps> = ({
  block,
  theme,
  onAction,
}) => {
  // Pair items into rows of 2
  const rows = block.items.reduce<typeof block.items[]>((acc, item, i) => {
    if (i % 2 === 0) acc.push([item]);
    else acc[acc.length - 1].push(item);
    return acc;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background ?? '#FFF5E6' }]}>
      {block.title && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text ?? '#1A1A1A' }]}>
            {block.title}
          </Text>
        </View>
      )}

      {rows.map((row, rowIdx) => (
        <View key={`row-${rowIdx}`} style={styles.row}>
          {row.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              theme={theme}
              onAction={onAction}
              variant="grid"
            />
          ))}
          {/* Fill empty space if odd number of items */}
          {row.length === 1 && <View style={styles.emptySlot} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  emptySlot: {
    flex: 1,
    margin: 4,
  },
});

export const ProductGrid2x2Block = memo(
  ProductGrid2x2BlockInner,
  (prev, next) =>
    prev.block === next.block &&
    prev.theme === next.theme &&
    prev.onAction === next.onAction
);

ProductGrid2x2Block.displayName = 'ProductGrid2x2Block';
