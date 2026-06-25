import React, { memo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { DynamicCollectionBlock as DynamicCollectionBlockType, ProductItem, ActionSchema, ThemeConfig } from '../../types';
import { ProductCard } from '../common/ProductCard';

// ──────────────────────────────────────────────────────────
// DYNAMIC_COLLECTION BLOCK
//
// Horizontal FlatList nested inside the vertical FlashList.
//
// VIRTUALIZATION CONSTRAINT:
// Horizontal scroll MUST NOT steal vertical momentum from
// the parent feed, nor cause memory leaks.
//
// Achieved via:
// 1. nestedScrollEnabled={true}
// 2. disableIntervalMomentum={true}
// 3. Stable keyExtractor
// 4. getItemLayout for fixed-width items (avoids measurement)
// 5. removeClippedSubviews={true}
// 6. maxToRenderPerBatch / windowSize tuned conservatively
// ──────────────────────────────────────────────────────────

const ITEM_WIDTH = 158; // card width + margin

interface DynamicCollectionBlockProps {
  block: DynamicCollectionBlockType;
  theme: ThemeConfig;
  onAction: (action: ActionSchema) => void;
}

const DynamicCollectionBlockInner: React.FC<DynamicCollectionBlockProps> = ({
  block,
  theme,
  onAction,
}) => {
  const listRef = useRef<FlatList<ProductItem>>(null);

  // Stable key extractor — critical for preventing list re-renders
  const keyExtractor = useCallback((item: ProductItem) => `carousel-${block.id}-${item.id}`, [block.id]);

  // Fixed item layout — avoids measurement, maximizes frame rate
  const getItemLayout = useCallback(
    (_: ProductItem[] | null | undefined, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    []
  );

  const renderItem: ListRenderItem<ProductItem> = useCallback(
    ({ item }) => (
      <ProductCard
        item={item}
        theme={theme}
        onAction={onAction}
        variant="carousel"
      />
    ),
    [theme, onAction]
  );

  const handleSeeAll = useCallback(() => {
    if (block.see_all_action) {
      onAction(block.see_all_action);
    }
  }, [block.see_all_action, onAction]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background ?? '#FFF5E6' }]}>
      {/* Section Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text ?? '#1A1A1A' }]}>
            {block.title}
          </Text>
          {block.subtitle && (
            <Text style={[styles.subtitle, { color: theme.textSecondary ?? '#666' }]}>
              {block.subtitle}
            </Text>
          )}
        </View>

        {block.see_all_action && (
          <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Carousel
          nestedScrollEnabled: allows horizontal scroll without breaking vertical parent
          disableIntervalMomentum: prevents momentum from "bleeding" into vertical list
          showsHorizontalScrollIndicator: hidden for clean UI
      */}
      <FlatList
        ref={listRef}
        data={block.items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        disableIntervalMomentum={true}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={4}
        windowSize={5}
        initialNumToRender={3}
        contentContainerStyle={styles.listContent}
        // Prevent FlatList from being "stolen" by vertical scroll
        // by setting directionalLockEnabled equivalent
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  marginVertical: 12,

  borderRadius: 28,

  backgroundColor: '#FFFFFF',

  shadowColor: '#000',

  shadowOffset: {
    width: 0,
    height: 4,
  },

  shadowOpacity: 0.05,
  shadowRadius: 12,

  elevation: 6,
},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    paddingTop: 2,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
});

export const DynamicCollectionBlock = memo(
  DynamicCollectionBlockInner,
  (prev, next) =>
    prev.block === next.block &&
    prev.theme === next.theme &&
    prev.onAction === next.onAction
);

DynamicCollectionBlock.displayName = 'DynamicCollectionBlock';
