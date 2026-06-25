import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { CampaignId } from '../../types';
import { useCampaign } from '../../context/CampaignContext';
import { useTheme } from '../../context/ThemeContext';

// ──────────────────────────────────────────────────────────
// CAMPAIGN SWITCHER
// Demonstrates live OTA campaign switching without app update.
// ──────────────────────────────────────────────────────────

const CAMPAIGNS: { id: CampaignId; label: string; emoji: string }[] = [
  { id: 'back_to_school', label: 'Back to School', emoji: '✏️' },
  { id: 'summer_playhouse', label: 'Summer Playhouse', emoji: '🏖️' },
  { id: 'mystery_carnival', label: 'Mystery Carnival', emoji: '🎉' },
];

const CampaignSwitcherInner: React.FC = () => {
  const { activeCampaignId, switchCampaign, clearCampaign } = useCampaign();
  const campaignStyles = {
  back_to_school: {
  bg: '#EEF3FF',
  border: '#4A6FE3',
  activeChip: '#4A6FE3',
  chipText: '#FFFFFF',
},
  summer_playhouse: {
    bg: '#E8FBF5',
    border: '#2DBD94',
    activeChip: '#2DBD94',
    chipText: '#FFFFFF',
  },
  mystery_carnival: {
    bg: '#FFF0F6',
    border: '#E06FA5',
    activeChip: '#E06FA5',
    chipText: '#FFFFFF',
  },
};
  const theme = useTheme();

  const handleSwitch = useCallback((id: CampaignId) => {
    if (activeCampaignId === id) {
      clearCampaign();
    } else {
      switchCampaign(id);
    }
  }, [activeCampaignId, switchCampaign, clearCampaign]);

  const currentTheme = activeCampaignId
  ? campaignStyles[activeCampaignId as keyof typeof campaignStyles]
 : { bg: '#F5F5F5', border: '#AAAAAA', activeChip: '#FF9933', chipText: '#FFFFFF' };
  return (
    <View
  style={[
    styles.container,
    {
      backgroundColor: currentTheme.bg,
      borderColor: currentTheme.border,
    },
  ]}
>
      <Text style={[styles.label, { color: theme.text }]}>
  ✨ Choose Your Campaign
</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {CAMPAIGNS.map((campaign) => {
          const isActive = activeCampaignId === campaign.id;
          return (
            <TouchableOpacity
              key={campaign.id}
              style={[
  styles.chip,
  {
    backgroundColor: isActive ? currentTheme.activeChip : '#FFFFFF',
    borderColor: currentTheme.border,
  },
]}
              onPress={() => handleSwitch(campaign.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
  styles.chipText,
  { color: isActive ? currentTheme.chipText : '#333333' },
]}
              >
                {campaign.emoji} {campaign.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  marginHorizontal: 14,
  marginTop: 10,
  marginBottom: 12,

  paddingVertical: 16,
  paddingHorizontal: 16,

  borderRadius: 28,

  borderWidth: 1,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.06,
  shadowRadius: 16,

  elevation: 6,
},
  label: {
  fontSize: 13,
  fontWeight: '800',

  letterSpacing: 0.3,

  marginBottom: 14,
  marginLeft: 4,
},
  row: {
  paddingLeft: 2,
  paddingRight: 10,
},
  chip: {
  paddingHorizontal: 18,
  paddingVertical: 12,

  borderRadius: 30,
  borderWidth: 1,
  marginRight: 10,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.06,
  shadowRadius: 10,

  elevation: 4,
},
  chipText: {
  fontSize: 14,
  fontWeight: '700',
},
});

export const CampaignSwitcher = memo(CampaignSwitcherInner);
CampaignSwitcher.displayName = 'CampaignSwitcher';
