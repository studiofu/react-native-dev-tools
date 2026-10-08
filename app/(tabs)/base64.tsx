import { Image, StyleSheet, Platform, View, Text,Dimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';


export default function HomeScreen() {

    const [rawText, setRawText] = useState('');
    const [encodedText, setEncodedText] = useState('');

    const Buffer = require("buffer").Buffer;

    const convertToBase64 = () => {
        const buffer = Buffer.from(rawText);
        setEncodedText(buffer.toString("base64"));
    } 

    const convertFromBase64 = () => {        
      try {
        const buffer = Buffer.from(encodedText, "base64");
        setRawText(buffer.toString());
      }catch(e){
        console.log(e);
      }
    }

  return (

    <SafeAreaView className="bg-primary h-full">
          <ScrollView>
      <View
        className="w-full flex justify-center h-full px-4 my-6 pt-5"
      >

        <View className='flex space-y-1'>
            <View className='bg-blue-100 p-2 rounded-lg'>
              <Text className='text-blue-900'>Raw Text</Text>
            </View>
            <TextInput value={rawText} className='h-40 p-2 bg-gray-400/20'  multiline={true}
              placeholder='Please input here...'
              onChange={(e) => {                
                setRawText(e.nativeEvent.text);
              }}
              />
        </View>
        <View className='flex flex-row pt-5 pb-5 justify-around'> 
          <TouchableOpacity onPress={convertToBase64} 
            className='bg-blue-500 p-2 rounded-m2 text-white rounded-md '
          >
              <Text className='text-white text-sm '>Convert To Base64</Text>
          </TouchableOpacity>          

          <TouchableOpacity onPress={convertFromBase64} 
            className='bg-blue-500 p-2 rounded-m2 text-white rounded-md'
          >
              <Text className='text-white text-sm '>Convert From Base64</Text>
          </TouchableOpacity>          

        </View>

        <View className='flex space-y-1'>
            <Text className='bg-blue-100 p-2 rounded-sm'>Encoded Text</Text>
            <TextInput value={encodedText} className='h-40 p-2 bg-gray-400/20'  multiline={true}
            onChange={(e) => {
              setEncodedText(e.nativeEvent.text);
            }}
              placeholder='Please input here...'/>
        </View>

      </View>
      </ScrollView>
    </SafeAreaView>

  );
}
