import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserLocation from './UserLocation';
import { useSelector, Provider, useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import ImageSelect from './ImageSelect';


export default function Settings({navigation}: {navigation: any}) {
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);

  const count = useSelector((store:any) => store.count.count);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
      alignItems: 'center',
    },
    counter_text: {
      fontSize: 35,
      fontWeight: '900',
      margin: 15,
    },
    settingText: {
      paddingTop: 20,
      textAlign: 'center',
    },
  });

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.counter_text}>Location</Text>
      <Text style={styles.settingText}>{text}</Text>

      <UserLocation></UserLocation>

      <Text style={styles.counter_text}>Last Population</Text>
      <Text style={styles.settingText}>{count}</Text>

      <ImageSelect />
    </View>
  );

  
}

