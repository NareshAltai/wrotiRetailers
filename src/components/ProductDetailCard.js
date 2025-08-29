import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
  Alert,
} from 'react-native';
// import { View } from "react-native-animatable";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {product} from '../assets';
// import StarRating from "react-native-star-rating";

class ProductDetailCard extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <EvilIcons
          onPress={() => Alert.alert('')}
          name="heart"
          size={25}
          color="#DEDDDD"
          style={{marginLeft: 10, alignSelf: 'flex-end'}}
        />
        <Image
          source={product}
          style={{
            width: 100,
            height: 100,
            resizeMode: 'stretch',
            alignSelf: 'center',
          }}
        />
        <View>
          {/* <StarRating
            disabled={true}
            maxStars={5}
            emptyStarColor="#EAECF0"
            fullStarColor="#F8CA0D"
            starSize={20}
            starStyle={{ marginLeft: 2 }}
            containerStyle={{
              width: 50,
            }}
            rating={4}
          /> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: 'Lato-Bold', fontSize: 17}}>
                Grapes •
              </Text>
              <Text style={{fontFamily: 'Lato-Regular', fontSize: 15}}>
                1kg
              </Text>
            </View>
            <Text
              style={{
                color: '#2B2520',
                fontSize: 18,
                fontFamily: 'Lato-Bold',
              }}>
              80
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 15,
              color: '#84694D',
            }}>
            Safe, Preservation Free
          </Text>
          <TouchableOpacity style={styles.addToCart} onPress={() => alert('')}>
            <EvilIcons name="plus" size={20} color="#E85A00" />
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 14,
                color: '#E85A00',
              }}>
              Add to cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ProductDetailCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 4,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    // marginTop: 10,
    marginLeft: 4,
  },

  addToCart: {
    marginTop: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E85A00',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
