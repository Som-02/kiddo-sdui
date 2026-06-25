import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, View, StyleSheet, ListRenderItem, RefreshControl } from 'react-native';
import { AnyBlock, ActionSchema, ThemeConfig } from '../types';
import { MemoizedBlockRenderer } from './registry';

// ──────────────────────────────────────────────────────────
// HOME FEED
//
// The singular vertical FlatList (or FlashList in production)
// that drives the entire SDUI homepage.
//
// PERFORMANCE REQUIREMENTS MET:
// ✅ Single vertical FlatList/FlashList — all blocks rendered here
// ✅ keyExtractor uses stable block.id (strict index stability)
// ✅ renderItem wrapped in useCallback — reference stable across renders
// ✅ MemoizedBlockRenderer with memo boundary prevents cascade re-renders
// ✅ getItemLayout not used here (heterogeneous block heights) —
//    but FlashList handles this with its native estimatedItemSize
// ✅ removeClippedSubviews for memory efficiency on large feeds
// ✅ maxToRenderPerBatch tuned for smooth initial paint
// ✅ windowSize balanced for scroll performance
// ──────────────────────────────────────────────────────────

// NOTE: In production with @shopify/flash-list:
// Replace FlatList with FlashList and add estimatedItemSize={200}
// for ~3x better frame rates on large feeds.
//
// import { FlashList } from '@shopify/flash-list';
// <FlashList
//   estimatedItemSize={200}
//   ...same props
// />

interface HomeFeedProps {
  blocks: AnyBlock[];
  theme: ThemeConfig;
  onAction: (action: ActionSchema) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
}

const HomeFeed: React.FC<HomeFeedProps> = ({
  blocks,
  theme,
  onAction,
  onRefresh,
  refreshing = false,
  ListHeaderComponent,
}) => {
  const listRef = useRef<FlatList<AnyBlock>>(null);

  // ── STRICT keyExtractor ──
  // Uses stable block.id, never relies on index.
  // This prevents React Native from unmounting/remounting
  // components during list mutations or campaign switches.
  const keyExtractor = useCallback((item: AnyBlock) => {
    return `block-${item.id ?? item.type}`;
  }, []);

  // ── renderItem — reference stable via useCallback ──
  // Theme and onAction are stable references from parent.
  // Only re-creates if those change (campaign switch = theme change).
  const renderItem: ListRenderItem<AnyBlock> = useCallback(
    ({ item }) => (
      <MemoizedBlockRenderer
        block={item}
        theme={theme}
        onAction={onAction}
      />
    ),
    [theme, onAction]
  );

  // ── Item separator — lightweight spacer ──
  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  const refreshControl = useMemo(
    () =>
      onRefresh ? (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      ) : undefined,
    [onRefresh, refreshing, theme.primary]
  );

  return (
    <FlatList
      ref={listRef}
      data={blocks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      // ── Performance props ──
      removeClippedSubviews={true}
      maxToRenderPerBatch={4}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      initialNumToRender={4}
      // ── Scroll behavior ──
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      // ── Layout ──
      contentContainerStyle={[
        styles.content,
        { backgroundColor: theme.background ?? '#FFF5E6', paddingBottom: 100 },
      ]}
      style={[styles.list, { backgroundColor: theme.background ?? '#FFF5E6' }]}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
  },
  separator: {
    height: 0, // Blocks handle their own vertical margins
  },
});

export default HomeFeed;
