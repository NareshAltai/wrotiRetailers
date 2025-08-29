import React,{useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ImageBackground,
    Image
} from 'react-native';
import Toast from 'react-native-simple-toast';
import LocationView from "./CustomMap/index";

import { useTheme } from 'react-native-paper';
import { BaseRouter } from '@react-navigation/native';



const MapScreen = ({navigation,route}) => {

    const [stateData, setData] = React.useState({
        mobile: '',
      
    });

    const { colors } = useTheme();


   
    useEffect(() => {
        navigation.setOptions({
            title: "Test"
          });
       
      }, []);

    const addManually = async() => {

     // console.log("INSIDE ADD MANUALLY");
      //navigation.navigate('AddAddressScreen');

    }
    const onLocationSelect  = async(data) => {
     // console.log("TWO TIMES CHANGE......",data);
      let latitude = 0 ;
      let longitude = 0;
      if(data.latitude && data.longitude){
        latitude = data.latitude;
        longitude = data.longitude;
      }
    
      if(data.placeDetails && data.placeDetails.formatted_address){
         route.params.handleGplace(data.placeDetails.name+", "+data.placeDetails.formatted_address,latitude,longitude,route.params.source);
      
        navigation.goBack();
      }else if(data.address){
         route.params.handleGplace(data.address,latitude,longitude,route.params.source);
         navigation.goBack();
      }
      else{

        Toast.showWithGravity(
          'Please select your location',
          Toast.LONG,
          Toast.BOTTOM,
        );
        //Toast.show({text:'Please select your location',type:'warning',buttonText: 'Okay'});
      }
    }

  
    return (

      <View style={{flex: 1}}>
        
      <LocationView

       showCurrentLocation={false}

        onLocationSelect={value1 => { onLocationSelect(value1) } }

        apiKey={"AIzaSyC1TY89_fY6WH1A3SrsL8Z6gl6vi58uMSw"}
        initialLocation={route.params.point}
        addManually = {addManually}

        markerColor={'#E85A00'}
        actionButtonStyle={{backgroundColor:'#E85A00'}}
      />

    </View>


    
    );

    
  
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,    
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:30
      },
      register: {
        flexDirection: 'column',
        paddingTop:20,
        paddingBottom : 10,
      },
      buttonRegister:{
        width:170,
        height:50,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      },
      buttonLogin:{
        width:170,
        height:50,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      },
      login: {
        flexDirection: 'column',
      },
      backgroundImage:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 380,
        height: 800,
    },
    animatedView: {
   
      backgroundColor: "#ff5900fa",
      elevation: 2,
      position: "absolute",
      bottom: 0,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    exitTitleText: {
      textAlign: "center",
      color: "#ffffff",
      marginRight: 10,
    },
    exitText: {
      color: "#ff5900fa",
      paddingHorizontal: 10,
      paddingVertical: 3
    }
  });
