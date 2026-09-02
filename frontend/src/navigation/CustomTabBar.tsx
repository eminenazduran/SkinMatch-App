import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Scan, Calendar, User } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation
}) => {
  const { t } = useLanguage();

  const renderTabIcon = (routeName: string, isFocused: boolean) => {
    const iconColor = isFocused ? '#FFFFFF' : '#94A3B8';
    const iconSize = 20;

    switch (routeName) {
      case 'HomeTab':
        return <LayoutGrid size={iconSize} color={iconColor} />;
      case 'ScannerTab':
        return <Scan size={iconSize} color={iconColor} />;
      case 'RoutineTab':
        return <Calendar size={iconSize} color={iconColor} />;
      case 'ProfileTab':
        return <User size={iconSize} color={iconColor} />;
      default:
        return <LayoutGrid size={iconSize} color={iconColor} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'HomeTab':
        return t('nav_dashboard');
      case 'ScannerTab':
        return t('nav_scan');
      case 'RoutineTab':
        return t('nav_routine');
      case 'ProfileTab':
        return t('nav_profile');
      default:
        return 'Tab';
    }
  };

  return (
    <View style={styles.floatingDockWrapper}>
      <View style={styles.floatingDock}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const label = getTabLabel(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.85}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemActive
              ]}
            >
              <View style={styles.iconContainer}>
                {renderTabIcon(route.name, isFocused)}
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingDockWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  floatingDock: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#0F172A', // Lüks Gece Mavisi / Grafit
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#4F46E5', // Canlı Parlak İndigo
  },
  iconContainer: {
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
