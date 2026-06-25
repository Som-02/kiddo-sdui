import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCampaign } from '../../context/CampaignContext';

const CATEGORIES = [
  { icon: '🧸', label: 'Toys' },
  { icon: '👶', label: 'Diapers' },
  { icon: '🍼', label: 'Feeding' },
  { icon: '👕', label: 'Fashion' },
  { icon: '📚', label: 'Learning' },
  { icon: '🎉', label: 'More' },
];

const CategoryStrip = () => {
  const { activeCampaignId } = useCampaign();

  const campaignTheme = {
  back_to_school: {
  cardBg: '#EEF3FF',
  iconBg: '#B8C9F8',
  border: '#4A6FE3',
},
  summer_playhouse: {
    cardBg: '#E8FBF5',
    iconBg: '#A8EDD6',
    border: '#2DBD94',
  },
  mystery_carnival: {
    cardBg: '#FFF0F6',
    iconBg: '#F7B8D6',
    border: '#E06FA5',
  },
};

  const current = activeCampaignId
  ? campaignTheme[activeCampaignId as keyof typeof campaignTheme]
  : { cardBg: '#FFF5E6', iconBg: '#FFCC80', border: '#FFA040' };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: current.cardBg,
          borderColor: current.border,
        },
      ]}
    >
      {CATEGORIES.map((item) => (
        <View key={item.label} style={styles.item}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: current.iconBg,
              },
            ]}
          >
            <Text style={styles.icon}>{item.icon}</Text>
          </View>

          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 10,

    paddingVertical: 18,

    borderRadius: 28,
    borderWidth: 1.5,

    flexDirection: 'row',
    justifyContent: 'space-around',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 5,
  },

  item: {
    alignItems: 'center',
  },

  iconCircle: {
    width: 62,
    height: 62,

    borderRadius: 31,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 8,
  },

  icon: {
    fontSize: 28,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
});

export default CategoryStrip;