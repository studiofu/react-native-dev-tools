import { View, ScrollView, StyleSheet, Platform, TouchableOpacity, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Link, useRouter } from 'expo-router'
import ClockProvider, { TimerType, useClockContext } from '@/providers/clock-providers'
import { Card, Button, Divider, Text } from 'react-native-paper'
import Modal from "react-native-modal";
import CustomTomatoButton from '@/components/custom-tomato-button'
import * as Haptics from 'expo-haptics';

// Reference:
// https://github.com/react-native-modal/react-native-modal

const ClockPage = () => {
  const router = useRouter();

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  
  const [isModalVisible, setModalVisible] = useState(false);
  
  const timerRef = React.useRef<ReturnType<typeof setInterval>>();

  const {
    tasks,
    addTask,
    removeTask,
    timerType,
    setTimerType,
    timer,
    timerColor,
    startTimer,
    stopTimer,
    timerActive
  } = useClockContext();

  // const startTimer = useCallback(() => {
  //   timerRef.current = setInterval(() => {
  //     setTimer((state) => state - 1);
  //   }, 1000);
  //   return () => clearInterval(timerRef.current);
  // }, [])

  // const stopTimer = useCallback(() => {
  //   clearInterval(timerRef.current)
  // }, [])

  const toDoubleDigit = (num: number) => {
    return num < 10 ? `0${num}` : num;
  }

  const getTimerString = (timer: number) => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${toDoubleDigit(minutes)}:${toDoubleDigit(seconds)}`;
  }


  const timerString = getTimerString(timer);

  useEffect(() => {
    console.log(tasks);
  }, [tasks])

  // #BA4949
  // #38858A
  // #397097
  //console.log(timerColor)

  return (
    <>
    <ClockProvider>
    <Modal isVisible={isModalVisible}>
      <View className='flex justify-center items-center w-full h-full'>
        <Text className='text-white'>Modal</Text>
      </View>
    </Modal>
    <SafeAreaView >
      <ScrollView        
        
         contentContainerStyle={{flexGrow:1, minHeight:'100%' }}
        // showsVerticalScrollIndicator={false}
      >
      <View className={`h-full bg-[${timerColor}]`}>

          <View>
            <Text className='text-white font-bold p-2'>Tomato Clock</Text>
          </View>

          <View className='bg-white/20 m-2 p-2 rounded-md pb-5 pt-5'>
            <View className='flex flex-row gap-2 m-2 p-2 justify-center items-center'>
              <CustomTomatoButton onPress={()=>{
                setTimerType(TimerType.Pomodoro)
              }} isActive={timerType== TimerType.Pomodoro}>
                  Pomodoro
              </CustomTomatoButton>

              <CustomTomatoButton onPress={()=>{
                setTimerType(TimerType.ShortBreak)
              }} isActive={timerType== TimerType.ShortBreak}>
                  Short Break
              </CustomTomatoButton>         

              <CustomTomatoButton onPress={()=>{
                setTimerType(TimerType.LongBreak)
              }} isActive={timerType== TimerType.LongBreak}>
                 Long Break
              </CustomTomatoButton>                     
                
            </View>
            
            <View className='flex w-full items-center justify-center pt-5 h-[100px]'>
              <Text className='text-7xl text-white font-bold'>{timerString}</Text>              
            </View>

            <View className='flex w-full items-center pt-5 h-[100px]'>
              {/* <Button onPress={() => startTimer()}>Start</Button>
              <Button onPress={() => stopTimer()}>Stop</Button> */}

              {!timerActive && ( 
                <Pressable onPress={()=>{
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  )
                  startTimer()
                }}>
                  <View className='bg-white pl-5 pr-5 pt-1 pb-1 rounded-md '>
                    <Text className={`text-[${timerColor}] text-3xl font-extrabold`}>START</Text>                  
                  </View>
                </Pressable>
              )}

              {timerActive && ( 
              <Pressable onPress={()=>{
                stopTimer()
              }}>
                <View className='bg-white pl-5 pr-5 pt-1 pb-1 rounded-md '>
                  <Text className={`text-[${timerColor}] text-3xl font-extrabold`}>PAUSE</Text>                  
                </View>
              </Pressable>              
              )}

            </View>
          </View>

          {/* <View>
            <View>
              <Text>Tasks</Text>
            </View>
            <View>
              <Link href="/create-task">Create Task</Link>
            </View>

            <View>
              {tasks.map(task => (
                <Card key={task.id}>
                  <Card.Title title={task.title} />
                  <Card.Content>
                    <Text>{task.count}</Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={() => removeTask(task.id)}>Remove</Button>
                  </Card.Actions>
                </Card>
              ))}
            </View>
          </View> */}

      </View>
      </ScrollView>

    </SafeAreaView>
    
    <StatusBar backgroundColor={`${timerColor}`} style='light'/>
    </ClockProvider>
    </>
  )
}

// SafeAreaView is used to avoid the status bar
// if using the SafeAreaView from react-native, it will not work
// and need to use the one from react-native-safe-area-context
const styles = StyleSheet.create( {
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  }
})

export default ClockPage