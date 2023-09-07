import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { decrement, increment, set } from './redux/actions/countAction';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ImageLibraryOptions, launchImageLibrary, launchCamera, CameraOptions} from 'react-native-image-picker';

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import UserLocation from './UserLocation';


export default function Home() {
    // const countriesData = [{"name":"Afghanistan"},{"name":"Åland Islands"},{"name":"Albania"},{"name":"Algeria"}]
  const [countriesData, setCountiresData] = useState<any[]>([]);
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  // const [counter, setCounter] = useState(0);
  const dispatch = useDispatch();
 
  const count = useSelector((store:any) => store.count.count);

  function fetchCountriesData() {
    // console.log('https://restcountries.com/v3.1/'+selectedContinent);
    fetch('https://restcountries.com/v3.1/'+selectedContinent)
    .then(res => res.json())
    .then(json => setCountiresData(sortCountriesAlphabetically(json)))
    .catch(err => console.error(err))
  }

  function sortCountriesAlphabetically(data: any[]) {
    // console.log(data);
    const sortedData = data.sort((a,b) => {
      const aName = a.name.common;
      const bName = b.name.common;
      return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
    });

    return sortedData;
  }

  useEffect(() => {
    fetchCountriesData();
  }, [selectedContinent]) // empty array so only runs on mount

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

  const Stack = createNativeStackNavigator();

  // const handleIncreament = () => {
  //   setCounter(counter + 1);
  // };
 
  // const handleDecreament = () => {
  //   setCounter(counter - 1);
  // };

  const handleIncrement = () => {
    dispatch(increment());
  };
 
  const handleDecrement = () => {
    dispatch(decrement());
  };

  const handleSet = (pop: any) => {
    dispatch(set(pop));
  };

  const HomeScreen = ({navigation}: {navigation: any}) => {
    return (
      <SafeAreaView style={styles.container}>
      <ContinentsLayout
      label="Select Continent"
      values={[
        {label: 'All', value: 'all'},
        {label: 'Africa', value: 'region/africa'},
        {label: 'Americas', value: 'region/americas'},
        {label: 'Asia', value: 'region/asia'},
        {label: 'Europe', value: 'region/europe'},
        {label: 'Oceania', value: 'region/oceania'},
      ]}
      selectedValue={selectedContinent}
      setSelectedValue={setSelectedContinent}>
      <Text style={styles.title}>{'Country List'}</Text>
      <FlatList
          data={countriesData}
          keyExtractor={item => item.name.common}
          renderItem={({item})=> <Text style={styles.text} onPress={() => {
            navigation.navigate('Country', {name: item.name.common, population: item.population});
            // setCounter(item.population);
            handleSet(item.population);
          }}>{item.name.common}</Text>}
      />
      </ContinentsLayout>
    </SafeAreaView>
    );
  };

  const CountryDetails = ({route}: {route: any}) => {
    return (
        <View style={styles.container2}>
          <Text style={styles.title_text}>{route.params.name}</Text>
          <Text style={styles.counter_text}>Population</Text>
          <Text style={styles.counter_text}>{count}</Text>
    
          <TouchableOpacity onPress={handleIncrement} style={styles.btn}>
            <Text style={styles.btn_text}> Increment </Text>
          </TouchableOpacity>
    
          <TouchableOpacity
            onPress={handleDecrement}
            style={{ ...styles.btn, backgroundColor: '#6e3b3b' }}>
            <Text style={styles.btn_text}> Decrement </Text>
          </TouchableOpacity>
        </View>
    )
  };


  // const openImagePicker = () => {
  //   const options: ImageLibraryOptions = {
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     maxHeight: 2000,
  //     maxWidth: 2000,
  //   };

  //   launchImageLibrary(options, (response:any) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('Image picker error: ', response.error);
  //     } else {
  //       let imageUri = response.uri || response.assets?.[0]?.uri;
  //       setSelectedImage(imageUri);
  //     }
  //   });
  // };

  // const handleCameraLaunch = () => {
  //   const options: CameraOptions = {
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     maxHeight: 2000,
  //     maxWidth: 2000,
  //   };
  
  //   launchCamera(options, (response:any) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled camera');
  //     } else if (response.error) {
  //       console.log('Camera Error: ', response.error);
  //     } else {
  //       let imageUri = response.uri || response.assets?.[0]?.uri;
  //       setSelectedImage(imageUri);
  //       console.log(imageUri);
  //     }
  //   });
  // }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takeImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const Settings = ({navigation}: {navigation: any}) => {
    return (
        <View style={styles.container3}>
            <Text style={styles.counter_text}>Location</Text>
            <Text style={styles.settingText}>{text}</Text>

            <UserLocation></UserLocation>

            <Text style={styles.counter_text}>Last Population</Text>
            <Text style={styles.settingText}>{count}</Text>

            <View style={styles.imgButton}>
              <Button title="Take Photo" onPress={takeImage} />
            </View>
            <View style={styles.imgButton2}>
              <Button title="Choose Photo" onPress={pickImage} />
            </View>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ flex: 1, width:500, height:500 }}
                resizeMode="contain"
              />
            )}
            
        </View>
    )
  };

    return (
        <NavigationContainer>
          <Stack.Navigator
          screenOptions={{
            animation: "slide_from_right",
          }}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: 'Country App',
                headerRight: () => (
                    <Button
                        icon={
                            <Icon
                            name="gear"
                            size={30}
                            color="black"
                            />}
                        onPress={() => navigation.navigate('Settings')}
                        type="clear"
                    />
                  ),
              })}
            />
            <Stack.Screen name="Country" component={CountryDetails} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
    );

//   return (
//     <NavigationContainer>
//     <SafeAreaView style={styles.container}>
//       <ContinentsLayout
//       label="Select Continent"
//       values={[
//         {label: 'All', value: 'all'},
//         {label: 'Africa', value: 'region/africa'},
//         {label: 'Americas', value: 'region/americas'},
//         {label: 'Asia', value: 'region/asia'},
//         {label: 'Europe', value: 'region/europe'},
//         {label: 'Oceania', value: 'region/oceania'},
//       ]}
//       selectedValue={selectedContinent}
//       setSelectedValue={setSelectedContinent}>
//       <Text style={styles.label}>{'Country List'}</Text>
//       <FlatList
//           data={countriesData}
//           keyExtractor={item => item.name.common}
//           renderItem={({item})=> <Text style={styles.text}>{item.name.common}</Text>}
//       />
//       </ContinentsLayout>
//     </SafeAreaView>
//     </NavigationContainer>
// );
}


type ContinentsLayoutProps = PropsWithChildren<{
    label: string;
    values: any[];
    selectedValue: string;
    setSelectedValue: (value: string) => void;
  }>;
  
  const ContinentsLayout = ({
    label,
    children,
    values,
    selectedValue,
    setSelectedValue,
  }: ContinentsLayoutProps) => (
    <View style={{padding: 10, flex: 1}}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {values.map(value => (
          <TouchableOpacity
            key={value.value}
            onPress={() => setSelectedValue(value.value)}
            style={[styles.button, selectedValue === value.value && styles.selected]}>
            <Text
              style={[
                styles.buttonLabel,
                selectedValue === value.value&& styles.selectedLabel,
              ]}>
              {value.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.container, {[label]: selectedValue}]}>{children}</View>
    </View>
  );
  
  const styles = StyleSheet.create({
    // container: {
    //   flex: 1,
    //   backgroundColor: '#fff',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    container: {
      flex: 1,
    },
    text: {
      fontSize: 20,
      margin: 10
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: 'aqua',
      alignSelf: 'flex-start',
      marginHorizontal: '1%',
      marginBottom: 6,
      minWidth: '48%',
    },
    selected: {
      backgroundColor: 'blue',
      borderWidth: 0,
    },
    buttonLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: 'black',
      textAlign: 'center',
    },
    selectedLabel: {
      color: 'white',
    },
    label: {
      textAlign: 'center',
      marginBottom: 10,
      fontSize: 24,
    },
    title: {
      paddingTop: 20,
      textAlign: 'center',
      marginBottom: 10,
      fontSize: 24,
    },
    title_text: {
      fontSize: 40,
      fontWeight: '900',
      marginBottom: 55,
    },
    counter_text: {
      fontSize: 35,
      fontWeight: '900',
      margin: 15,
    },
    btn: {
      backgroundColor: '#086972',
      padding: 10,
      margin: 10,
      borderRadius: 10,
    },
    btn_text: {
      fontSize: 23,
      color: '#fff',
    },
    container2: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 50,
    },
    container3: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
      alignItems: 'center',
    },
    settingText: {
        paddingTop: 20,
        textAlign: 'center',
    },
    imgButton: {
      paddingTop: 60,
      paddingBottom: 20
    },
    imgButton2: {
      paddingBottom: 20
    }
  });
  