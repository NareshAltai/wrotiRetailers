import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Divider} from 'react-native-paper';

const Header = ({title, rightContent = <></>}) => {
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 4,
          marginTop: 25,
          paddingVertical: 15,
          backgroundColor: 'white',
          elevation: 10,
          shadowColor: '#040D1C14',
          borderBottomWidth: 0.4,
          borderBottomColor: '#21272E14',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
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
        {rightContent && <View style={{marginRight: 10}}>{rightContent}</View>}
      </View>
      <Divider />
    </>
  );
};

export default Header;

const styles = StyleSheet.create({});
