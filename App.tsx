import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import firebaseRealtime from '@react-native-firebase/database';
const App = () => {
  const [inputUpdate, setinputUpdate] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [allData, setAllData] = useState<[]>();
  const [todoIndex, setTodoIndex] = useState<number>(0);
  const saveDataToFirebase = () => {
    setRealTimeData(inputText);
  };

  async function updateTodoToFirebase(index: number) {
    try {
      const data = await firebaseRealtime()
        .ref(`Todo/${index}`)
        .set({
          uid: index,
          value: inputText,
        })
        .then(() => {
          setinputUpdate(false);
        });
    } catch (error) {
      console.error(error);
      setinputUpdate(false);
    }
  }

  async function deleteTodofirebase(index: number) {
    try {
      const data = await firebaseRealtime()
        .ref(`Todo/${index}`)
        .remove()
        .then(() => {
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // getData();
    // getRealTimeData();
    getAllRealTimeData();
  }, []);

  useEffect(() => {
    console.log('all data :' + JSON.stringify(allData));
  }, [allData]);

  // const getData =async()=>{
  //   try {
  //     const data= await firestore().collection('testinData').doc("7T3fjhqshtgvLJ5gFqLs").get();
  //     console.log(data._data);
  //     setFirebaseData(data._data);
  //   } catch (error) {
  //       console.error(error)
  //   }
  // }

  const getRealTimeData = async () => {
    try {
      const data = await firebaseRealtime().ref('database').once('value');
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const setRealTimeData = async (data?: string) => {
    try {
      // const newRefrence = firebaseRealtime().ref('todo').push();
      const index = allData?.length ?? 0;
      await firebaseRealtime()
        .ref(`Todo/${index}`)
        .set({
          value: data,
          uid: index,
        })
        .then(() => {
          setInputText('');
        });
      // newRefrence.set({
      //   value : data,
      //   uid: newRefrence.key
      // }).then(()=>{
      //     console.warn("data set successfully")
      //   });
    } catch (e) {
      console.error(e);
    }
  };

  const getAllRealTimeData = async () => {
    try {
      // const data = await firebaseRealtime().ref('Todo').once('value');
      const data = await firebaseRealtime()
        .ref('Todo')
        .on('value', newData => {
          setAllData(newData.val());
        });
    } catch (error) {}
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white',
      }}>
      <Text
        style={{
          fontSize: 40,
          color: 'red',
          fontWeight: 'bold',
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        ToDo
      </Text>

      <TextInput
        style={{
          backgroundColor: 'white',
          width: '100%',
          margin: 20,
          borderRadius: 10,
          borderColor: 'blue',
          paddingHorizontal: 10,
          color: 'black',
        }}
        value={inputText}
        onChangeText={value => setInputText(value)}
        placeholder="please input todo"
        placeholderTextColor="grey"></TextInput>

      <TouchableOpacity
        onPress={() => {
          console.log(todoIndex, 'index');
          !inputUpdate ? saveDataToFirebase() : updateTodoToFirebase(todoIndex);
        }}>
        <View
          style={{
            width: 100,
            height: 50,
            backgroundColor: 'blue',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20, color: 'white'}}>
            {!inputUpdate ? 'Save' : 'Update'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{width: '100%'}}>
        {allData ? (
          <FlatList
            style={{width: '100%'}}
            data={allData}
            renderItem={item => {
              console.log(item);
              if (item.item !== null) {
                return (
                  <ItemUi
                    item={item.item}
                    callBack={item => {
                      console.log('item index : ' + item);
                      setinputUpdate(true);
                      setTodoIndex(item);
                    }}
                    deleteTodo={item => {
                      deleteTodofirebase(item);
                    }}></ItemUi>
                );
              } else {
                return <View></View>;
              }
            }}></FlatList>
        ) : (
          <Text>Loading..</Text>
        )}
      </View>
    </View>
  );
};
interface customData {
  name?: string;
  age?: number;
  hobby?: string[];
}

const ItemUi = ({
  item,
  callBack,
  deleteTodo,
}: {
  item: dataItem;
  callBack: (index: number) => void;
  deleteTodo: (index: number) => void;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        marginVertical: 10,
        justifyContent: 'space-between',

      }}>
      <Text
        style={{
          color: 'grey',
          fontSize: 20,
          fontWeight: '700',
          width: '60%',
        }}>
        {item?.value}
      </Text>
      <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={() => callBack(item.uid ?? 0)}>
        <Text
          
          style={{
            color: 'green',
            fontSize: 20,
            fontWeight: '700',
            marginRight: 10,
            marginLeft:5
          }}>
          Update  
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTodo(item.uid ?? 0)}>
        <Text
       
          style={{
            color: 'red',
            fontSize: 20,
            fontWeight: '700',
           
          }}>
          Delete
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};
interface dataItem {
  value?: string;
  uid?: number;
}

export default App;

const styles = StyleSheet.create({});
