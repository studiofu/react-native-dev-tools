import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar'

export default function TabTwoScreen() {
  return (
    <>
    <SafeAreaView className="bg-primary h-full items-center justify-center">
      
        <View className='items-center justify-center'>
          <Text>Coming Soon. This is update of 2026 Feb</Text>
        </View>
        
    </SafeAreaView>
    <StatusBar style='light'/>
    </>
  );
}

