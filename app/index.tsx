import { View, Text, useColorScheme, Pressable, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'
import { useTheme } from 'expo-router/react-navigation';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomTomatoDashButton from '@/components/custom-tomato-dash-button';

import Animated, { Easing, ReduceMotion, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const IndexPage = () => {
  const scheme = useColorScheme();
  const { colors } = useTheme();  

  const moveUpPosition = useSharedValue(0);
  const moveDownPosition = useSharedValue(0);
  

  const moveUpStyle = useAnimatedStyle(() => {    
    const interpolation = interpolate(moveUpPosition.value, [0, 1], [-100, 0])
    return {
      transform: [
        { translateY: withTiming(interpolation, {
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          reduceMotion: ReduceMotion.System,
    
        }) }
      ]
    }
  });

  const moveDownStyle = useAnimatedStyle(() => {    
    const interpolation = interpolate(moveUpPosition.value, [0, 1], [100, 0])
    return {
      transform: [{ 
        translateY: withTiming(interpolation, {
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          reduceMotion: ReduceMotion.System,  }) 
        }
      ],
      // opacity: withTiming(moveDownPosition.value, {
      //   duration: 1000,
      //   easing: Easing.inOut(Easing.cubic),
      //   reduceMotion: ReduceMotion.System,  
      // })

    }
  });  

  useEffect(() => { 
    moveUpPosition.value = 1;
    moveDownPosition.value = 1;
  }, [])

      
  return (
    <SafeAreaView className='bg-primary h-full'>
      <Animated.View className='flex-1 items-center justify-center'>
        <Animated.View style={moveUpStyle}>
        <View className='flex items-center justify-center'>
          <FontAwesome5 name="tools" size={48} color="black"/>
        </View>
        <View className='pt-5'></View>

        <CustomTomatoDashButton onPress={() => {}} isActive>
          <Text className='text-black/50'>
            Tools, Convenience and Fun.
          </Text>
        </CustomTomatoDashButton>
        </Animated.View>
        <Animated.View style={[moveDownStyle]} className="pt-">
          <Link href="/(tabs)" asChild>
            <TouchableOpacity className='w-full'>          
            <View 
              className='flex bg-gray-700 rounded-md text-white justify-center items-center text-center m-2 p-2 h-12 w-32 shadow-blue-900 shadow-xl border-b-2 border-r-2 border-red-500'
              >
              <Text className='text-white font-bold'>
                CONTINUE
              </Text>          
            </View>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  )
}

export default IndexPage