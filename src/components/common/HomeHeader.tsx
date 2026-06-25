import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCartCount } from '../../context/CartContext';
import { useActiveCampaign } from '../../context/CampaignContext';
import { ThemeConfig } from '../../types';

const HomeHeaderInner: React.FC = () => {
  const cartCount = useCartCount();
  const activeCampaign = useActiveCampaign();
  const baseTheme = useTheme();
  const theme = activeCampaign?.theme
    ? { ...baseTheme, ...activeCampaign.theme }
    : baseTheme;

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.primary }]}>
      {/* <StatusBar barStyle="light-content" backgroundColor={theme.primary} translucent={false} /> */}
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>📍 Gurgaon</Text>
          <Text style={styles.delivery}>Delivery in 10 mins</Text>
        </View>

        <TouchableOpacity style={styles.cartBtn} activeOpacity={0.85}>
          <Text style={styles.cartIcon}>🛒</Text>

          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Brand */}
      <Text style={styles.logo}>kiddo 💛</Text>

      <Text style={styles.subtitle}>
        Everything your little one needs
      </Text>

      {/* Campaign Pill */}
      {activeCampaign && (
        <View style={[styles.campaignPill, { opacity: activeCampaign ? 1 : 0 }]}>
  <Text style={styles.campaignText} numberOfLines={1}>
    🔥 {activeCampaign?.name ?? 'placeholder'}
  </Text>
</View>
      )}

      {/* Search Bar */}
      <View style={styles.searchBar}>
  <View style={styles.searchInner}>
    <Text style={styles.searchIcon}>🔍</Text>
    <TextInput
  style={[styles.searchText, { outline: 'none' } as any]}
  placeholder="Search diapers, toys, snacks..."
  placeholderTextColor="#8A8A8A"
  returnKeyType="search"
  autoFocus={false}
  autoCorrect={false}
  underlineColorAndroid="transparent"
  onSubmitEditing={(e) => {
    if (__DEV__) console.log('[Search]', e.nativeEvent.text);
  }}
/>
  </View>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
  paddingHorizontal: 18,
  paddingTop: 14,
  paddingBottom: 18,
  borderBottomLeftRadius: 28,
  borderBottomRightRadius: 28,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 8,
  minHeight: 263,
},

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  locationContainer: {
    flex: 1,
  },

 location: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 16,
},

  delivery: {
  color: 'rgba(255,255,255,0.9)',
  fontSize: 12,
  marginTop: 2,
},

  logo: {
  fontSize: 34,
  fontWeight: '900',
  color: '#fff',

  marginTop: 12,

  letterSpacing: -1,
},
  subtitle: {
  color: 'rgba(255,255,255,0.95)',
  marginTop: 4,

  fontSize: 15,
},

  campaignPill: {
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(255,255,255,0.2)',
  marginTop: 10,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
  height: 28,
},

  campaignText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '700',
},

  searchBar: {
  backgroundColor: '#fff',

  marginTop: 14,

  borderRadius: 18,

  paddingVertical: 14,
  paddingHorizontal: 16,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.06,
  shadowRadius: 8,

  elevation: 4,
},
searchInner: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
searchIcon: {
  fontSize: 16,
},
  searchText: {
  color: '#333',
  fontSize: 15,
  flex: 1,
} as any,

  cartBtn: {
  width: 48,
  height: 48,

  borderRadius: 24,

  backgroundColor: 'rgba(255,255,255,0.22)',

  alignItems: 'center',
  justifyContent: 'center',

  position: 'relative',
},

  cartIcon: {
  fontSize: 24,
},

  badge: {
  position: 'absolute',

  top: -2,
  right: -2,

  backgroundColor: '#FF3D57',

  minWidth: 24,
  height: 24,

  borderRadius: 12,

  justifyContent: 'center',
  alignItems: 'center',

  borderWidth: 2,
  borderColor: '#fff',
},

  badgeText: {
  color: '#fff',
  fontWeight: '900',
  fontSize: 11,
},
});

export const HomeHeader = memo(HomeHeaderInner);
HomeHeader.displayName = 'HomeHeader';