import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const Header = ({title}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 20,
        backgroundColor: 'white',
        elevation: 10,
        shadowColor: '#040D1C14',
        borderBottomWidth: 0.4,
        borderBottomColor: '#21272E14',
      }}>
      <TouchableOpacity
        hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
        activeOpacity={0.6}
        onPress={() => navigation.goBack()}>
        <Image
          style={{width: 28, height: 28, resizeMode: 'center'}}
          source={require('../assets/back3x.png')}
        />
      </TouchableOpacity>
      <View style={{marginLeft: 1, flexDirection: 'row'}}>
        <Text
          style={{
            color: '#2B2520',
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
          }}>
          {title}
          {/* Products Reports{' '} */}
        </Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
