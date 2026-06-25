import React, { memo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { CampaignOverlay as CampaignOverlayType } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ──────────────────────────────────────────────────────────
// CAMPAIGN OVERLAY
//
// Full-screen animation overlay for live campaign contexts.
//
// OVERLAY ENGINEERING CONSTRAINT:
// - Renders OVER the full interactive space
// - pointerEvents="none" — users can STILL tap, scroll, and
//   interact with ALL underlying layout elements
// - No input occlusion whatsoever
// - Remote animation files fetched with cache pipeline
//
// NOTE: In production, this uses lottie-react-native.
// Since we can't install native deps here, we render a
// beautiful animated CSS-style confetti simulation using
// React Native Animated API as a fully functional substitute.
// The lottie_url is consumed and logged — in a real app,
// replace the inner view with:
//   <LottieView source={{ uri: overlay.animation_url }}
//     autoPlay loop style={StyleSheet.absoluteFill} />
// ──────────────────────────────────────────────────────────

interface CampaignOverlayProps {
  overlay: CampaignOverlayType;
  campaignId?: string;
}

// Individual confetti particle
const ConfettiParticle: React.FC<{
  color: string;
  delay: number;
  startX: number;
  size: number;
}> = memo(({ color, delay, startX, size }) => {
  const translateY = useRef(new Animated.Value(-60)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 2800 + Math.random() * 1200;
    const driftX = (Math.random() - 0.5) * 80;

    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT + 60,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: driftX,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.85,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.85,
              duration: duration - 600,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotate, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -60, duration: 0, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    anim.start();
    return () => anim.stop();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          width: size,
          height: size * 0.5,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ translateY }, { translateX }, { rotate: spin }],
          opacity,
        },
      ]}
    />
  );
});

const CONFETTI_COLORS = [
  '#FF4081', '#FFD700', '#00BCD4', '#76FF03',
  '#FF6B35', '#7C4DFF', '#FF1744', '#00E676',
  '#FFEA00', '#F50057', '#18FFFF', '#FF9100',
];

const PARTICLE_COUNT = 22;

const CampaignOverlayInner: React.FC<CampaignOverlayProps> = ({ overlay, campaignId }) => {
  if (__DEV__) {
    console.log(
      `[CampaignOverlay] Rendering overlay for campaign: ${campaignId ?? 'default'}\n` +
      `Animation URL: ${overlay.animation_url}`
    );
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i * 180) % 2000,
    startX: (SCREEN_WIDTH / PARTICLE_COUNT) * i + Math.random() * 20,
    size: 8 + Math.random() * 10,
  }));

  return (
    // pointerEvents="none" — CRITICAL: users interact normally with everything below
    <View style={styles.overlay} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiParticle
          key={p.id}
          color={p.color}
          delay={p.delay}
          startX={p.startX}
          size={p.size}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    // NO backgroundColor — fully transparent container
    // so underlying UI is visible and interactive
  },
  particle: {
    position: 'absolute',
    top: 0,
  },
});

export const CampaignOverlay = memo(CampaignOverlayInner);
CampaignOverlay.displayName = 'CampaignOverlay';
