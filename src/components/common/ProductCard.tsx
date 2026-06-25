import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ProductItem, ActionSchema, ThemeConfig } from '../../types';
import { useCartItem, useAddToCart, useIncrementCart, useDecrementCart } from '../../context/CartContext';

// ──────────────────────────────────────────────────────────
// PRODUCT CARD
//
// ARCHITECTURAL RENDERING MANDATE:
// This component is fully memo-isolated. Mutating cart qty
// on THIS card only re-renders THIS card via useCartItem(id).
// The other 30+ feed blocks are NOT affected.
// ──────────────────────────────────────────────────────────

interface ProductCardProps {
  item: ProductItem;
  theme: ThemeConfig;
  onAction: (action: ActionSchema) => void;
  style?: ViewStyle;
  variant?: 'grid' | 'carousel';
}

const ProductCardInner: React.FC<ProductCardProps> = ({
  item,
  theme,
  onAction,
  style,
  variant = 'carousel',
}) => {
  // ── Per-item cart subscription ──
  // ONLY this card re-renders when ITS quantity changes.
  // Other product cards are completely unaffected.
  const { quantity } = useCartItem(item.id);
  const addToCart = useAddToCart();
  const increment = useIncrementCart();
  const decrement = useDecrementCart();

  const handlePrimaryAction = useCallback(() => {
  onAction(item.action);
}, [item.action, onAction]);

  const handleIncrement = useCallback(() => {
    increment(item.id);
  }, [item.id, increment]);

  const handleDecrement = useCallback(() => {
    decrement(item.id);
  }, [item.id, decrement]);

  const isGrid = variant === 'grid';
  const discount =
    item.original_price && item.original_price > item.price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : null;

  return (
    <View
      style={[
        styles.card,
        isGrid ? styles.cardGrid : styles.cardCarousel,
        { backgroundColor: theme.surface ?? '#FFFFFF', borderColor: theme.border ?? '#eee' },
        style,
      ]}
    >
      {/* Badge */}
      {item.badge && (
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}

      {/* Product Image */}
      <Image
        source={{ uri: item.image_url }}
        style={isGrid ? styles.imageGrid : styles.imageCarousel}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text ?? '#1A1A1A' }]} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.primary }]}>₹{item.price}</Text>
          {item.original_price && (
            <Text style={[styles.originalPrice, { color: theme.textSecondary ?? '#999' }]}>
              ₹{item.original_price}
            </Text>
          )}
          {discount && (
            <Text style={[styles.discount, { color: '#2E7D32' }]}>{discount}% off</Text>
          )}
        </View>

        {/* Rating */}
        {item.rating && (
          <Text style={[styles.rating, { color: theme.textSecondary ?? '#666' }]}>
            ★ {item.rating}
          </Text>
        )}
      </View>

      {/* Cart Controls */}
      {quantity === 0 ? (
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={handlePrimaryAction}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>
            {item.action.type === 'APPLY_MYSTERY_GIFT_COUPON'
              ? '🎁 Apply'
              : item.action.type === 'BOOK_EVENT'
              ? '📅 Book'
              : '+ Add'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.quantityControl, { borderColor: theme.primary }]}>
          <TouchableOpacity
            style={[styles.qtyBtn, { backgroundColor: theme.primary }]}
            onPress={handleDecrement}
            activeOpacity={0.8}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: theme.primary }]}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.qtyBtn, { backgroundColor: theme.primary }]}
            onPress={handleIncrement}
            activeOpacity={0.8}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
  borderRadius: 22,

  overflow: 'hidden',

  backgroundColor: '#FFFFFF',

  elevation: 8,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },

  shadowOpacity: 0.08,
  shadowRadius: 12,
},
  cardCarousel: {
  width: 190,
  marginRight: 14,
},
  cardGrid: {
    flex: 1,
    margin: 4,
  },
  imageCarousel: {
  width: '100%',
  height: 160,
},
  imageGrid: {
    width: '100%',
    height: 135,
  },
  badge: {
  position: 'absolute',

  top: 10,
  left: 10,

  zIndex: 10,

  backgroundColor: '#FF3D57',

  paddingHorizontal: 10,
  paddingVertical: 5,

  borderRadius: 20,
},
  badgeText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '800',
},
  info: {
    padding: 8,
  },
  name: {
  fontSize: 18,
  fontWeight: '700',
  lineHeight: 20,
  marginBottom: 6,
},
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  price: {
  fontSize: 28,
  fontWeight: '900',
},
  originalPrice: {
  fontSize: 14,
  textDecorationLine: 'line-through',
},
  discount: {
    fontSize: 14,
    fontWeight: '700',
  },
  rating: {
    fontSize: 11,
    marginTop: 2,
  },
 addBtn: {
  margin: 12,

  paddingVertical: 12,

  borderRadius: 24,

  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },

  shadowOpacity: 0.1,
  shadowRadius: 6,
},
  addBtnText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '800',
},
  quantityControl: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  margin: 12,
  marginTop: 6,

  borderWidth: 2,
  borderRadius: 24,

  overflow: 'hidden',
},
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  qtyText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
});

// CRITICAL: memo with deep prop equality check on item.id
// Each product card is independently memoized
export const ProductCard = memo(
  ProductCardInner,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item === next.item &&
    prev.theme === next.theme &&
    prev.onAction === next.onAction &&
    prev.variant === next.variant
);

ProductCard.displayName = 'ProductCard';
