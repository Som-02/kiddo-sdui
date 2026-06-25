import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { CartProvider } from './src/context/CartContext';
import { CampaignProvider } from './src/context/CampaignContext';
import HomeScreen from './src/HomeScreen';
import payload from './src/data/payload.json';
import { SDUIPayload } from './src/types';

// ──────────────────────────────────────────────────────────
// APP ROOT
//
// Provider hierarchy (order matters):
// 1. ThemeProvider — base OTA theme from payload
// 2. CartProvider — isolated cart state (split contexts)
// 3. CampaignProvider — campaign engine with overlay + theme override
// 4. HomeScreen — renders the SDUI feed
//
// Campaign theme override happens in HomeScreen via
// merging activeCampaign.theme over base theme.
// ──────────────────────────────────────────────────────────

const typedPayload = payload as unknown as SDUIPayload;

export default function App() {
  return (
    <ThemeProvider theme={typedPayload.theme}>
      <CartProvider>
        <CampaignProvider
          campaigns={typedPayload.campaigns}
          initialCampaignId={typedPayload.active_campaign}
        >
          <HomeScreen />
        </CampaignProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
