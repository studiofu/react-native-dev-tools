import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarEntypoIcon, TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
 Entypo
} from "@expo/vector-icons";
import ClockProvider from '@/providers/clock-providers';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (    
    <Tabs
      initialRouteName='(clock)'
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // tabBarItemStyle: {
        //   height: 84,
        // },
        // tabBarStyle: {
        //   height: 84,
        // }

      }}>
      <Tabs.Screen
        name="(clock)"
        options={{
          title: 'Tomato Clock',
          tabBarIcon: ({ color, focused }) => (
            <TabBarEntypoIcon name={focused ? 'clock' : 'clock'} color={color} />
          ),
        }}
      />        
      <Tabs.Screen
        name="base64"
        options={{
          title: 'BASE 64',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'logo-buffer' : 'logo-buffer'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="qrcode"
        options={{
          title: 'QR Code',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'qr-code' : 'qr-code-outline'} color={color} />
          ),
        }}
      />


    </Tabs>    
  );
}
