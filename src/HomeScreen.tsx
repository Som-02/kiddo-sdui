import React, { useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { useCampaign, useCampaignOverlay } from './context/CampaignContext';
import { useSDUI } from './hooks/useSDUI';
import HomeFeed from './components/HomeFeed';
import { HomeHeader } from './components/common/HomeHeader';
import { CampaignOverlay } from './components/campaign/CampaignOverlay';
import { CampaignSwitcher } from './components/campaign/CampaignSwitcher';
import payload from './data/payload.json';
import { SDUIPayload } from './types';
import CategoryStrip from './components/common/CategoryStrip';
// ──────────────────────────────────────────────────────────
// HOME SCREEN
//
// The root screen of the Kiddo SDUI engine.
// Orchestrates: payload ingestion → theme injection →
// campaign resolution → overlay rendering → feed display.
// ──────────────────────────────────────────────────────────

const typedPayload = payload as unknown as SDUIPayload;

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { activeCampaign, activeCampaignId } = useCampaign();
  const overlay = useCampaignOverlay();

  // Resolve effective theme: campaign theme overrides base payload theme
  const effectiveTheme = useMemo(
    () => (activeCampaign?.theme ? activeCampaign.theme : theme),
    [activeCampaign, theme]
  );
  const { blocks, isRefreshing, onAction, refresh } = useSDUI({
    payload: typedPayload,
  });

  // Campaign switcher as list header — avoids extra renders outside the feed
  const ListHeaderComponent = useMemo(
  () => (
    <>
      <CampaignSwitcher />
      <CategoryStrip />
    </>
  ),
  []
);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: effectiveTheme.primary, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={[styles.container, { backgroundColor: effectiveTheme.background ?? '#FFF5E6' }]}>
        {/* Header */}
        <HomeHeader/>

        {/* Main SDUI Feed */}
        <HomeFeed
          blocks={blocks}
          theme={effectiveTheme}
          onAction={onAction}
          onRefresh={refresh}
          refreshing={isRefreshing}
          ListHeaderComponent={ListHeaderComponent}
        />

        {/* Full-screen Campaign Overlay
            pointerEvents="none" is set INSIDE CampaignOverlay
            so all underlying elements remain interactive */}
        {/* {overlay && (
          <CampaignOverlay
            overlay={overlay}
            campaignId={activeCampaignId ?? undefined}
          />
        )} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default HomeScreen;
