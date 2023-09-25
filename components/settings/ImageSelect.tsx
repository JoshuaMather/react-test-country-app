import {ImageLibraryOptions, launchImageLibrary, launchCamera, CameraOptions} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, View, Image, StyleSheet } from 'react-native';


export default function ImageSelect() {
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const styles = StyleSheet.create({
        imgButton: {
          paddingTop: 60,
          paddingBottom: 20
        },
        imgButton2: {
          paddingBottom: 20
        },
      });


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

      return (
        <>
            <View style={styles.imgButton}>
                <Button title="Take Photo" onPress={takeImage} />
            </View>
            <View style={styles.imgButton2}>
                <Button title="Choose Photo" onPress={pickImage} />
            </View>
            <View>
                {selectedImage && (
                    <Image
                    source={{ uri: selectedImage }}
                    style={{ flex: 1, width: 500, height: 500 }}
                    resizeMode="contain" />
                )}
            </View>
        </>
      );
}