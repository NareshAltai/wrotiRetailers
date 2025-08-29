import React from 'react';
import {TouchableOpacity,View,Text,StyleSheet,ImageBackground,} from 'react-native';
import ThreeDot from '../../Assets/images/home/threedot.svg';
import StarIcon from '../../Assets/images/home/star.svg';
import BiddingIcon from '../../Assets/images/home/bidding.svg';
import CompareIcon from '../../Assets/images/home/compare.svg';
import ShareIcon from '../../Assets/images/home/share.svg';
import TimeIcon from '../../Assets/images/home/time.svg';
import DistanceIcon from '../../Assets/images/home/distance.svg';
import HeartIcon from '../../Assets/images/home/heart.svg';
import {Menu,MenuOptions,MenuOption,MenuTrigger} from 'react-native-popup-menu';
export default class PopularCard extends React.Component {
  render() {
    return (
      <TouchableOpacity
      activeOpacity={0.6}
      onPress={this.props.handleProduct}
        style={[
          styles.container,
          {
            borderBottomWidth: this.props.isLast ? 0 : 1,
          },
        ]}>
        <View style={{width: '31%', marginRight: 12}}>
          <ImageBackground
            source={this.props.url}
            style={styles.productImg}
            imageStyle={{
              borderRadius: 10,
            }}></ImageBackground>
        </View>
        <View style={{width: '65%'}}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={1}>
              {this.props.name}
            </Text>
            <Menu>
              <MenuTrigger style={styles.dotIcon}>
                <ThreeDot />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  marginLeft: -10,
                  marginTop: 30,
                  borderWidth: 1,
                  borderColor: '#E9ECF2',
                  borderRadius: 6,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}>
                <MenuOption
                  style={styles.menuItem}
                  onSelect={() => console.log('Add to favourites')}>
                  <HeartIcon />
                  <Text style={styles.menuOptionText}>Add to favourites</Text>
                </MenuOption>
                <MenuOption
                  style={styles.menuItem}
                  onSelect={() => console.log('Share')}>
                  <ShareIcon />
                  <Text style={styles.menuOptionText}>Share</Text>
                </MenuOption>
                <MenuOption
                  style={[styles.menuItem,{borderBottomWidth:0}]}
                  onSelect={() => console.log('Add to compare')}>
                  <CompareIcon />
                  <Text style={styles.menuOptionText}>Add to compare</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <StarIcon />
            <Text style={styles.rating}>{this.props.rating}</Text>
            <Text style={styles.views}>{this.props.views}</Text>
          </View>
          <View>
            <Text style={styles.description} numberOfLines={1}>
              {this.props.foodType}
            </Text>
          </View>
  
          <View style={{flexDirection: 'row'}}>
            <View style={styles.innerRow}>
              <DistanceIcon />
              <Text style={styles.infoText}>{this.props.distance}</Text>
            </View>
            <View style={styles.innerRow}>
              <TimeIcon />
              <Text style={styles.infoText}>{this.props.time}</Text>
            </View>
            {this.props.bidding ? (
              <View style={styles.innerRow}>
                <BiddingIcon />
                <Text style={styles.infoText}>{this.props.bidding ? 'Bidding' : ''}</Text>
              </View>
            ) : (
              <View></View>
            )}
          </View>
          {this.props.discount ? (
            <View style={styles.discountContainer}>
              <Text style={styles.discount}>{this.props.discountValue}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
      );
  }
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 14,
      borderBottomWidth: 1,
      borderBlockColor: '#F4F5F7',
      paddingBottom: 10,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 16,
      color: '#21272E',
      fontFamily: 'Poppins-SemiBold',
      marginRight: 10,
    },
    productImg: {
      width: '100%',
      height: 140,
    },
    dotIcon: {
      marginRight: 4,
      padding: 10,
    },
    rating: {
      fontFamily: 'Poppins-Medium',
      color: '#21272E',
      fontSize: 12,
      marginLeft: 5,
      marginTop: 4,
    },
    views: {
      fontFamily: 'Poppins-Regular',
      fontSize: 10,
      marginLeft: 7,
      marginTop: 4,
      color: '#9199A5',
    },
    description: {
      color: '#21272E',
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      marginVertical: 4,
    },
    innerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 14,
    },
    infoText: {
      color: '#21272E',
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      marginLeft: 4,
    },
    discountContainer: {
      backgroundColor: '#F4F5F7',
      borderRadius: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginTop: 6,
    },
    discount: {
      color: '#3D86B4',
      fontSize: 12,
      fontFamily: 'Poppins-Medium',
    },
    menuContainer: {
      position: 'absolute',
      top: 10, // Adjust this to position the menu correctly
      right: 100, // Adjust this to position the menu correctly
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBlockColor: '#F4F5F7',
    },
    menuOptionText: {
      color: '#21272E',
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      marginLeft:6
    },
  });