import { View, ScrollView, StyleSheet, Platform, TouchableOpacity, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Link, useRouter } from 'expo-router'
import ClockProvider, { TimerType, useClockContext } from '@/providers/clock-providers'
import { Card, Button, Divider, Text, TextInput, Icon, PaperProvider, Menu } from 'react-native-paper'
import Modal from "react-native-modal";
import CustomTomatoButton from '@/components/custom-tomato-button'
import * as Haptics from 'expo-haptics';
import CustomTomatoDash from '@/components/custom-tomato-dash-button'
import CustomTomatoDashButton from '@/components/custom-tomato-dash-button'
import Toast from 'react-native-root-toast'

// Reference:
// https://github.com/react-native-modal/react-native-modal

const ClockPage = () => {
  const router = useRouter();

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskEffort, setTaskEffort] = useState(1);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);  

  const {
    tasks,
    addTask,
    removeTask,
    clearTasks,
    timerType,
    setTimerTypeWrapper,    
    timer,
    timerColor,
    startTimer,
    stopTimer,
    timerActive,
    activeTask,
    setActiveTask,
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
    // initial timer
    console.log('trigger useeffect')
    setTimerTypeWrapper(timerType);
  }, [])

  // #BA4949
  // #38858A
  // #397097
  //console.log(timerColor)

  return (
    <>    
    <Modal isVisible={isModalVisible}>
      <View className='flex justify-center items-center w-full h-full'>
        <View className='bg-white w-[95%] h-[300px] rounded-xl'>
          <View className='pt-8 px-5'>
            <TextInput placeholder='What are you Focused On?' 
              placeholderTextColor={'#A0AEC0'}
              value={taskName}
              onChangeText={(text) => { setTaskName(text) }}
            />            
          </View>
          <View className='flex px-5 pt-5'>
            <Text>Estimated Pomodoros</Text>
            <View className='flex flex-row pt-2'>
              <TextInput value={taskEffort.toString()} onChangeText={(text) => { setTaskEffort(parseInt(text)) }}
              readOnly={true} style={{width: 50}}
              />
              <TouchableOpacity className='self-center pl-2' 
                onPress={() => { setTaskEffort(taskEffort + 1);}}
                >
                <Icon source="arrow-up-bold-hexagon-outline" size={40} />                
              </TouchableOpacity>
              <TouchableOpacity className='self-center pl-2'
                onPress={() => { if(taskEffort > 1) setTaskEffort(taskEffort - 1);}}
                >
                <Icon source="arrow-down-bold-hexagon-outline" size={40} />                
              </TouchableOpacity>              
            </View>
            <View className='flex flex-row justify-between pt-2 border-t mt-5'>
              <Button onPress={() => {
                  setModalVisible(false); 
                  // let toast = Toast.show('Cancel', {
                  //   duration: Toast.durations.LONG,
                  // });
                }}
                icon={"cancel"}

              >Cancel</Button>
              <Button onPress={() => {        
                if(taskName == '') {
                  // let toast = Toast.show('What are you focused?', {
                  //   duration: Toast.durations.LONG,
                  //   animation: true,
                  //   containerStyle: {
                  //     zIndex: 200,
                  //     backgroundColor: '#F56565',
                  //   }
                  // });               
                } else {         
                  addTask(taskName, taskEffort);
                  setTaskName('');
                  setTaskEffort(1);
                  setModalVisible(false);
                }
                }}
                icon={"content-save-edit"}
              >Save</Button>
            </View>
          </View>
          {/* <View>
            <Text>{taskName}</Text>
          </View> */}
        </View>
      </View>
    </Modal>
    
    <PaperProvider>
    <SafeAreaView 
              style={{
                backgroundColor: `${timerColor}`,
                minHeight: '100%',
                maxHeight: '100%',
              }}      
   >
      <ScrollView        
        style={{
          backgroundColor: `${timerColor}`,
        }}
         contentContainerStyle={{flexGrow:1, minHeight:'100%' }}
        // showsVerticalScrollIndicator={false}
      >
      <View className={`h-full`} 
        style={{
          backgroundColor: `${timerColor}`,
          minHeight: '100%',
          maxHeight: '100%',
        }}
      >

          <View>
            <Text className='text-white font-bold p-2' style={{ color: 'white' }}>Tomato Clock</Text>
          </View>

          <View className='bg-white/20  p-2 rounded-md pb-5 pt-5 w-[95%] self-center'>
            <View className='flex flex-row gap-2 m-2 p-2 justify-center items-center'>
              <CustomTomatoButton onPress={()=>{
                setTimerTypeWrapper(TimerType.Pomodoro);
              }} isActive={timerType== TimerType.Pomodoro}>
                  Pomodoro
              </CustomTomatoButton>

              <CustomTomatoButton onPress={()=>{
                setTimerTypeWrapper(TimerType.ShortBreak)  
              }} isActive={timerType== TimerType.ShortBreak}>
                  Short Break
              </CustomTomatoButton>         

              <CustomTomatoButton onPress={()=>{
                setTimerTypeWrapper(TimerType.LongBreak)
              }} isActive={timerType== TimerType.LongBreak}>
                 Long Break
              </CustomTomatoButton>                     
                
            </View>
            
            <View className='w-full items-center justify-center pt-5'>
              <Text
                className='text-7xl text-white font-bold'
                style={{
                  color: 'white',
                  textAlign: 'center',
                  width: '100%',
                  fontVariant: ['tabular-nums'],
                  includeFontPadding: false,
                }}
              >
                {timerString}
              </Text>
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
                  <View className='bg-white pl-5 pr-5 pt-1 pb-1 rounded-md'
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 5, height: 5 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6.84,
                      elevation: 5,                      
                    }}
                  >
                    <Text className={`text-[${timerColor}] text-3xl font-extrabold`}
                      style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.5)',
                        textShadowOffset: {width: -1, height: 1},
                        textShadowRadius: 2,
                        elevation: 5,
                        color: `${timerColor}`
                      }}
                    >START</Text>                  
                  </View>
                </Pressable>
              )}

              {timerActive && ( 
              <Pressable onPress={()=>{
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                )
                stopTimer()
              }}>
                <View className='bg-white pl-5 pr-5 pt-1 pb-1 rounded-md '>
                  <Text className={`text-[${timerColor}] text-3xl font-extrabold`}                  
                    style={{
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowOffset: {width: -1, height: 1},
                      textShadowRadius: 10,
                      color: `${timerColor}`
                    }}                  
                  >PAUSE</Text>                  
                </View>
              </Pressable>              
              )}

            </View>
          </View>

          {activeTask && (
            <>
            <View className='pt-2'></View>
            <View className='justify-center w-[95%] items-center bg-white/20 self-center rounded-md p-2'>
              <Text className='text-white font-bold' style={{ color: 'white' }}>Focus On</Text>
              <Text className='text-white font-bold' style={{ color: 'white' }}>{activeTask.title}</Text>
            </View>
            </>
          )}

          <View className='w-[95%] flex flex-row justify-between items-center self-center py-2'>
            <Text className='text-white font-bold pl-1 text-lg' style={{ color: 'white' }}>Tasks</Text>
            <View className='text-white bg-white/20 rounded-md h-8 w-8 items-center justify-center'>

            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={<Pressable onPress={openMenu}>
                  <Icon source={"dots-vertical"} size={25}              
                    color='white'
                  />
              </Pressable>}>
              <Menu.Item onPress={() => {
                setMenuVisible(false);
                clearTasks();
              }} title="Clear all tasks" />
              <Divider />
            </Menu>                    


            </View>
          </View>
          <View className='h-[2px] bg-white/50 w-[95%] self-center' />

          <View className='w-[95%] flex flex-col justify-center items-center self-center pt-2'>
            {tasks.map((task, index) => {
              return (
                <TouchableOpacity 
                  key={index}
                  onPress={()=> {
                  console.log('press')  
                  setActiveTask(task);                
                }}>
                <View className='w-full flex flex-row justify-between items-center pt-2 pb-2 border-b border-white/20 bg-white/30 p-2 m-1 rounded-md' 
                  key={index}
                >
                  <View className='flex flex-row items-center justify-center'>                    
                    <Icon source={"focus-field"} size={20} color='white' />


                    <Text className='text-white text-lg font-bold pl-2 flex-nowrap overflow-hidden' style={{ color: 'white' }}>{task.title}</Text>
                  </View>
                  <View className='flex flex-row items-center justify-center flex-nowrap'>
                    <Text className='text-white pr-3' style={{ color: 'white' }}>{task.effortSpent} / {task.effortCount}</Text>
                    <TouchableOpacity onPress={() => {
                      removeTask(task.id);
                    }}>
                      <Icon source={"delete-forever"} size={20} color='white' />
                    </TouchableOpacity>
                  </View>
                </View>
                </TouchableOpacity>
              )
            })}
          </View>

          <View>
            <CustomTomatoDashButton onPress={() => {
              setModalVisible(true);
            }} isActive>
              Add Task
            </CustomTomatoDashButton>
          </View>
  

      </View>
      </ScrollView>

    </SafeAreaView>
    </PaperProvider>
    
    {/* <StatusBar backgroundColor={`${timerColor}`} style='light'/>     */}
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