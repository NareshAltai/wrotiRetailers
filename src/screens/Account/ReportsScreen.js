import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {
  Divider,
  Menu,
  Checkbox,
  RadioButton,
  Title,
  List,
} from 'react-native-paper';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';

const ReportsScreen = ({navigation}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 14,
          paddingVertical: 16,
          backgroundColor: 'white',
          elevation: 10,
          shadowColor: '#040D1C14',
          borderBottomWidth: 0.4,
          borderBottomColor: '#21272E14',
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{width: 28, height: 28, resizeMode: 'center'}}
            source={require('../../assets/back3x.png')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 1, flexDirection: 'row'}}>
          <Text
            style={{
              color: '#2B2520',
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
            }}>
            Reports{' '}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('SalesReport')}
        style={styles.item}>
        <Text
          style={{
            fontSize: 22,
            color: '#fff',
            fontFamily: 'Poppins-Bold',
            textAlign: 'center',
            marginTop: '6%',
          }}>
          Sales Report
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('ProductsReport')}
        style={styles.item}>
        <Text
          style={{
            fontSize: 22,
            color: '#fff',
            fontFamily: 'Poppins-Bold',
            textAlign: 'center',
            marginTop: '6%',
          }}>
          Product Report
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('CustomerOrderReport')}
        style={styles.item}>
        <Text
          style={{
            fontSize: 22,
            color: '#fff',
            fontFamily: 'Poppins-Bold',
            textAlign: 'center',
            marginTop: '6%',
          }}>
          Customers Order Report
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 5,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 100,
    marginHorizontal: 10,
    backgroundColor: '#1B6890',
    elevation: 2,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
});
