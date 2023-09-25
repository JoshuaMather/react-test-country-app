import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Settings from '../settings/SettingsPage';
import CountryDetails from '../country/CountryDetails';
import { set } from '../../redux/actions/countAction';


export default function Home() {
    // const countriesData = [{"name":"Afghanistan"},{"name":"Åland Islands"},{"name":"Albania"},{"name":"Algeria"}]
  const [countriesData, setCountiresData] = useState<any[]>([]);
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [loading, setLoading] = useState<Boolean>(false);
  // const [counter, setCounter] = useState(0);
  const dispatch = useDispatch();


  function fetchCountriesData() {
    setLoading(true);
    // console.log('https://restcountries.com/v3.1/'+selectedContinent);
    setTimeout(() => {
      fetch('https://restcountries.com/v3.1/'+selectedContinent)
      .then(res => res.json())
      .then(json => setCountiresData(sortCountriesAlphabetically(json)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
    }, 1000);
  }

  function sortCountriesAlphabetically(data: any[]) {
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

  const Stack = createNativeStackNavigator();

  // const handleIncreament = () => {
  //   setCounter(counter + 1);
  // };
 
  // const handleDecreament = () => {
  //   setCounter(counter - 1);
  // };


  const handleSet = (pop: any) => {
    dispatch(set(pop));
  };

  const HomeScreen = ({navigation}: {navigation: any}) => {
    let listContent;
    if(loading) {
      listContent = <ActivityIndicator size="large" color='blue'/>
    } else {
      listContent = <FlatList
      data={countriesData}
      keyExtractor={item => item.name.common}
      renderItem={({item})=> <Text style={styles.text} onPress={() => {
        navigation.navigate('Country', {name: item.name.common, population: item.population});
        // setCounter(item.population);
        handleSet(item.population);
      }}>{item.name.common}</Text>}
      />
    }

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
      { listContent }
      </ContinentsLayout>
    </SafeAreaView>
    );
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
  });
  