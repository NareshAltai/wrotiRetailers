import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  Button,
  Linking,
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
import Header from '../../components/Header';

const VideoTutorial = ({navigation}) => {
  const theme = useTheme();

  const [tabValue, setTabValue] = React.useState('English');
  const [englishData, setEnglishData] = useState([]);
  const [hindiData, setHindiData] = useState([]);

  const getMediaFiles = async () => {
    let api = new DeveloperAPIClient();
    let type = 'tutorials';
    let tutorialsResponse = await api.getMediaFiles(type);
    let mediaArray = tutorialsResponse.data.data[0].media;
    let english = mediaArray.find(item => item.language === 'English').data;
    let hindi = mediaArray.find(item => item.language === 'Hindi').data;
    setEnglishData(english);
    setHindiData(hindi);
  };

  useEffect(() => {
    getMediaFiles();
  }, []);

  const Tabs = [
    {
      name: 'English',
    },
    {
      name: 'Hindi',
    },
  ];

  const onPress = val => {
    setTabValue(val.name);
  };

  const openUrl = url => {
    Linking.openURL(url);
  };

  const renderItemOfEnglish = ({item}) => {
    return (
      <View style={styles.videoCard}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => openUrl(item.url)}>
          <Image
            style={{height: 100, width: 100, alignSelf: 'center'}}
            source={require('../../assets/youtubeIcon.png')}
          />
        </TouchableOpacity>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const renderItemOfHindi = ({item}) => {
    return (
      <View style={styles.videoCard}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => openUrl(item.url)}>
          <Image
            style={{height: 100, width: 100, alignSelf: 'center'}}
            source={require('../../assets/youtubeIcon.png')}
          />
        </TouchableOpacity>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Header title={'Video Tutorials'} />

      <View
        style={{
          flexDirection: 'row',
        }}>
        {Tabs &&
          Tabs.map((val, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPress(val)}
                activeOpacity={0.7}
                key={i}
                style={{
                  width: '45.5%',
                  height: 50,
                  borderRadius: tabValue === val.name ? 5 : 5,
                  backgroundColor:
                    tabValue === val.name ? '#337D3E' : '#F2F7F9',
                  marginLeft: '3%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: tabValue === val.name ? '#FFFF' : '#21272E',

                    fontFamily:
                      tabValue === val.name
                        ? 'Poppins-Bold'
                        : 'Poppins-SemiBold',
                    fontSize: tabValue === val.name ? 18 : 13,
                    marginLeft: 8,
                  }}>
                  {val.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>

      {tabValue === 'English' && (
        <FlatList
          data={englishData}
          renderItem={renderItemOfEnglish}
          keyExtractor={item => item._id}
        />
      )}

      {tabValue === 'Hindi' && (
        <FlatList
          data={hindiData}
          renderItem={renderItemOfHindi}
          keyExtractor={item => item._id}
        />
      )}
    </View>
  );
};

export default VideoTutorial;

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
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: 'stretch',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginTop: 10,
    color: '#000',
  },
  videoCard: {
    marginTop: 10,
    backgroundColor: '#ebf2ed',
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aee6bd',
    paddingHorizontal: 10,
  },
  description: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000',
  },
});
