import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BannerHeroBlock as BannerHeroBlockType, ActionSchema, ThemeConfig } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ──────────────────────────────────────────────────────────
// BANNER_HERO BLOCK
// Full-width promotional graphic card for heroic marketing.
// ──────────────────────────────────────────────────────────

interface BannerHeroBlockProps {
  block: BannerHeroBlockType;
  theme: ThemeConfig;
  onAction: (action: ActionSchema) => void;
}

const BannerHeroBlockInner: React.FC<BannerHeroBlockProps> = ({ block, theme, onAction }) => {
  const handlePress = useCallback(() => {
    if (block.action) {
      onAction(block.action);
    }
  }, [block.action, onAction]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.95}
      disabled={!block.action}
    >
      <Image
        source={{ uri: block.image_url }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        {block.badge && (
  <View style={[styles.badge, { backgroundColor: theme.accent ?? theme.primary }]}>
    <Text style={[styles.badgeText, { color: theme.accent === '#FFD93D' ? '#111' : '#fff' }]}>
      {block.badge}
    </Text>
  </View>
)}

        {block.title && (
          <Text style={styles.title} numberOfLines={2}>
            {block.title}
          </Text>
        )}

        {block.subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {block.subtitle}
          </Text>
        )}

        {block.cta_label && block.action && (
          <View style={[styles.cta, { backgroundColor: theme.primary }]}>
            <Text style={styles.ctaText}>{block.cta_label}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 24,
    height: 240,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.18)',
},
  content: {
  flex: 1,
  padding: 22,
  justifyContent: 'center',
},
  badge: {
  alignSelf: 'flex-start',

  backgroundColor: '#FFD54F',

  paddingHorizontal: 12,
  paddingVertical: 6,

  borderRadius: 20,

  marginBottom: 10,
},
  badgeText: {
    color: '#111',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    maxWidth: '55%',
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 17,
    maxWidth: '50%',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
    lineHeight: 18,
  },
  cta: {
  alignSelf: 'flex-start',

  backgroundColor: '#FFFFFF',

  paddingHorizontal: 22,
  paddingVertical: 12,

  borderRadius: 30,

  marginTop: 12,
},
  ctaText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
});

export const BannerHeroBlock = memo(
  BannerHeroBlockInner,
  (prev, next) =>
    prev.block === next.block &&
    prev.theme === next.theme &&
    prev.onAction === next.onAction
);


BannerHeroBlock.displayName = 'BannerHeroBlock';
