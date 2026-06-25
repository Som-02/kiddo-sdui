import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Campaign, CampaignId, CampaignOverlay } from '../types';

// ──────────────────────────────────────────────────────────
// CONTEXT SHAPE
// ──────────────────────────────────────────────────────────
interface CampaignContextValue {
  activeCampaign: Campaign | null;
  activeCampaignId: CampaignId | null;
  overlay: CampaignOverlay | null;
  switchCampaign: (id: CampaignId) => void;
  clearCampaign: () => void;
}

const CampaignContext = createContext<CampaignContextValue>({
  activeCampaign: null,
  activeCampaignId: null,
  overlay: null,
  switchCampaign: () => {},
  clearCampaign: () => {},
});

// ──────────────────────────────────────────────────────────
// PROVIDER
// ──────────────────────────────────────────────────────────
interface CampaignProviderProps {
  campaigns: Campaign[];
  initialCampaignId?: CampaignId;
  children: React.ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({
  campaigns,
  initialCampaignId,
  children,
}) => {
  const campaignMap = useMemo(
    () => new Map<CampaignId, Campaign>(campaigns.map((c) => [c.id, c])),
    [campaigns]
  );

  const [activeCampaignId, setActiveCampaignId] = useState<CampaignId | null>(
    initialCampaignId ?? null
  );

  const activeCampaign = useMemo(
    () => (activeCampaignId ? (campaignMap.get(activeCampaignId) ?? null) : null),
    [activeCampaignId, campaignMap]
  );

  const overlay = useMemo(
    () => activeCampaign?.overlay ?? null,
    [activeCampaign]
  );

  const switchCampaign = useCallback((id: CampaignId) => {
    setActiveCampaignId(id);
  }, []);

  const clearCampaign = useCallback(() => {
    setActiveCampaignId(null);
  }, []);

  const value = useMemo<CampaignContextValue>(
    () => ({ activeCampaign, activeCampaignId, overlay, switchCampaign, clearCampaign }),
    [activeCampaign, activeCampaignId, overlay, switchCampaign, clearCampaign]
  );

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

// ──────────────────────────────────────────────────────────
// HOOKS
// ──────────────────────────────────────────────────────────
export const useCampaign = (): CampaignContextValue => useContext(CampaignContext);
export const useCampaignOverlay = (): CampaignOverlay | null =>
  useContext(CampaignContext).overlay;
export const useActiveCampaign = (): Campaign | null =>
  useContext(CampaignContext).activeCampaign;
