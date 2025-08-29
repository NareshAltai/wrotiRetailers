import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  UIManager,
  TouchableOpacity,
  Text,
  ViewPropTypes,
  Image,
  TextInput,
  Button,
} from 'react-native';

import Events from 'react-native-simple-events';
import axios, {CancelToken} from 'axios';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomLoadingButton from '../../../../components/CustomLoadingButton';
// import * as Animatable from 'react-native-animatable';
// import AnimateLoadingButton from 'react-native-animate-loading-button';

const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';
const DEFAULT_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};

export default class LocationView extends React.Component {
  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    initialLocation: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
    markerColor: PropTypes.string,
    actionButtonStyle: ViewPropTypes.style,
    actionTextStyle: Text.propTypes.style,
    actionText: PropTypes.string,
    onLocationSelect: PropTypes.func,
    addManually: PropTypes.func,
    debounceDuration: PropTypes.number,
    components: PropTypes.arrayOf(PropTypes.string),
    timeout: PropTypes.number,
    maximumAge: PropTypes.number,
    enableHighAccuracy: PropTypes.bool,
  };

  static defaultProps = {
    markerColor: 'black',
    actionText: 'DONE',
    onLocationSelect: () => ({}),
    addManually: () => ({}),
    debounceDuration: 300,
    components: [],
    timeout: 15000,
    maximumAge: Infinity,
    enableHighAccuracy: true,
  };

  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    Events.listen('InputBlur', this.constructor.displayName, this._onTextBlur);
    Events.listen(
      'InputFocus',
      this.constructor.displayName,
      this._onTextFocus,
    );
    Events.listen(
      'PlaceSelected',
      this.constructor.displayName,
      this._onPlaceSelected,
    );
  }

  componentWillUnmount() {
    Events.rm('InputBlur', this.constructor.displayName);
    Events.rm('InputFocus', this.constructor.displayName);
    Events.rm('PlaceSelected', this.constructor.displayName);
  }

  state = {
    inputScale: new Animated.Value(1),
    inFocus: false,
    text: '',
    region: {
      ...DEFAULT_DELTA,
      ...this.props.initialLocation,
    },
  };

  _animateInput = () => {
    Animated.timing(this.state.inputScale, {
      toValue: this.state.inFocus ? 1.2 : 1,
      duration: 300,
    }).start();
  };

  _onMapRegionChange = region => {
    this._setRegion(region, false);
    if (this.state.inFocus) {
      this._input.blur();
    }
  };

  _onMapRegionChangeComplete = region => {
    //this._input.fetchAddressForLocation(region);

    let {latitude, longitude} = region;
    this.source = CancelToken.source();
    axios
      .get(
        `${REVRSE_GEO_CODE_URL}?key=${this.props.apiKey}&latlng=${latitude},${longitude}`,
        {
          cancelToken: this.source.token,
        },
      )
      .then(({data}) => {
        this.setState({loading: false});
        let {results} = data;
        if (results.length > 0) {
          let {formatted_address} = results[0];
          this.setState({text: formatted_address});
          //   console.log("ADDRESS",formatted_address);
        }
      });
  };

  _setRegion = (region, animate = true) => {
    this.state.region = {...this.state.region, ...region};
    if (animate) this._map.animateToRegion(this.state.region);
  };

  _onPlaceSelected = placeId => {
    this._input.blur();
    axios
      .get(`${PLACE_DETAIL_URL}?key=${this.props.apiKey}&placeid=${placeId}`)
      .then(({data}) => {
        let region = (({lat, lng}) => ({latitude: lat, longitude: lng}))(
          data.result.geometry.location,
        );
        this._setRegion(region);
        this.setState({placeDetails: data.result});
      });
  };

  _getCurrentLocation = () => {
    const {timeout, maximumAge, enableHighAccuracy} = this.props;
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        this._setRegion({latitude, longitude});
      },
      error => console.log(error.message),
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      },
    );
  };

  render() {
    let {inputScale} = this.state;
    return (
      <View style={styles.container}>
        <MapView
          ref={mapView => (this._map = mapView)}
          style={styles.mapView}
          region={this.state.region}
          showsMyLocationButton={true}
          showsUserLocation={false}
          onPress={({nativeEvent}) => this._setRegion(nativeEvent.coordinate)}
          onRegionChange={this._onMapRegionChange}
          onRegionChangeComplete={this._onMapRegionChangeComplete}
        />
        <Image
          source={require('./mapicons/Map_pin_icon.png')}
          style={{marginTop: -300, backgroundColor: 'transparent'}}
        />

        <TouchableOpacity
          style={[styles.currentLocBtn, {backgroundColor: 'transparent'}]}
          onPress={this._getCurrentLocation}>
          <Image
            source={require('./mapicons/GPS_icon.png')}
            style={{backgroundColor: 'transparent'}}
          />
        </TouchableOpacity>

        {this.props.children}

        <View style={styles.overlay1}>
          <Text
            style={{
              lineHeight: 30,
              color: '#2B2520',
              fontFamily: 'PlayfairDisplay-Bold',
              fontSize: 28,
              textAlign: 'center',
            }}>
            Select your location
          </Text>

          <Text
            style={{
              marginHorizontal: 27,
              marginTop: 6,
              lineHeight: 19,
              color: '#847D76',
              fontFamily: 'Lato-Regular',
              fontSize: 16,
              textAlign: 'center',
            }}>
            Move the pin on the map to find your location and select the
            delivery address.
          </Text>

          <Text
            style={{
              marginTop: 33,
              marginHorizontal: 30,
              color: '#847D76',
              fontFamily: 'Lato-Regular',
              fontSize: 12,
            }}>
            ADDRESS
          </Text>

          <View style={styles.action}>
            <TextInput
              editable={false}
              placeholder="Your enter your address"
              placeholderTextColor="#B9AFA5"
              style={[
                styles.textInput,
                {
                  color: '#2B2520',
                  fontFamily: 'Lat-Bold',
                  fontSize: 16,
                  marginHorizontal: 30,
                },
              ]}
              autoCapitalize="none"
              value={this.state.text}
              returnKeyType={'done'}
            />
          </View>

          <View style={styles.button}>
            <CustomLoadingButton
              ref={c => (this.getStartedButton = c)}
              width={328}
              height={52}
              title="Confirm"
              titleFontSize={18}
              titleFontFamily={'PlayfairDisplay-Bold'}
              titleColor="#FFF"
              backgroundColor="#34A549"
              borderRadius={4}
              onPress={() => {
                this.props.onLocationSelect({
                  ...this.state.region,
                  address: this.state.text,
                  placeDetails: this.state.placeDetails,
                });
              }}
            />
          </View>
          <View style={{marginTop: 1}}>
            <Text>{}</Text>
          </View>
          <View style={styles.button}>
            <CustomLoadingButton
              ref={c => (this.getStartedButton = c)}
              width={328}
              height={44}
              title={'Add it manually'}
              titleFontSize={18}
              titleFontFamily={'PlayfairDisplay-Bold'}
              titleColor="#2B2520"
              backgroundColor="#EFE9E4"
              borderRadius={4}
              onPress={() => {
                this.props.addManually();
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deliverySlot: {
    marginLeft: 62,
    color: '#2B2520',
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    marginTop: 22,
    //s textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  fullWidthContainer: {
    position: 'absolute',
    width: '100%',
    top: 80,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 5,
  },
  currentLocBtn: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 350,
    right: 10,
  },
  actionButton: {
    backgroundColor: '#000',
    height: 50,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 23,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    height: 100,
  },

  overlay1: {
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    //alignItems : 'center',
    //alignSelf : "center",
    height: 355,
    bottom: 0,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,

    shadowRadius: 4,
    shadowOpacity: 1,
    shadowColor: '#cfe4e042',

    shadowOffset: {
      width: 0,

      height: 4,
    },
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});
