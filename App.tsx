import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
const App = () => {
  const [firebaseData, setFirebaseData] = useState<customData>();
  useEffect(()=>{
    getData();

  },[])
  const getData =async()=>{
    try {
      const data= await firestore().collection('testinData').doc("7T3fjhqshtgvLJ5gFqLs").get();
      console.log(data._data);
      setFirebaseData(data._data);
    } catch (error) {
        console.error(error)
    }
  }
  return (
    <View>
      <Text>{firebaseData? firebaseData.name: "Loading.."}</Text>
      <Text>{firebaseData? firebaseData.age: "Loading.."}</Text>
      <Text>{firebaseData? firebaseData.hobby?.map((item)=><Text> `  {item}` </Text>): "Loading.."}</Text>
      
    </View>
  )
}
 interface customData{
  name?: string,
  age?: number,
  hobby?:string[]
 }

export default App

const styles = StyleSheet.create({})