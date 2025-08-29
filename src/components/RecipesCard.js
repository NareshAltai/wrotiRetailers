import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  Dimensions,
  View,
} from 'react-native';
// import { View } from "react-native-animatable";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import StarRating from 'react-native-star-rating';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').width;
class RecipesCard extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <ImageBackground
          style={{width: width - 50, height: 180, borderRadius: 10}}
          source={require('../assets/kiwi-kumquat-ginger-1-960x540.png')}>
          <View style={styles.badge}>
            <EvilIcons name="clock" size={20} color="white" />
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 14,
                color: 'white',
                marginLeft: 5,
              }}>
              30 mins
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                color: '#2B2520',
                fontSize: 16,
                marginVertical: 5,
              }}>
              Kiwi Ginger
            </Text>
            <Text style={{fontFamily: 'Lato-Regular', color: '#84694D'}}>
              Tropican
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 13, fontFamily: 'Lato-Regular'}}>
              DIFFICULTY •
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Lato-Regular',
                color: '#6AA34A',
              }}>
              EASY
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default RecipesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 1,
    margin: 10,
    marginLeft: 0,
    paddingBottom: 10,
    width: width - 50,
  },
  badge: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#E85A00',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 100,
    margin: 6,
  },
});
