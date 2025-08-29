import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  useTheme,
  Drawer,
  Text,
  // TouchableRipple,
  // Switch,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import * as orderActions from '../redux/actions/orderActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../components/context';
// import Accordian from "./Accordian";
import {useDispatch, useSelector} from 'react-redux';

export function DrawerContent(props) {
  const paperTheme = useTheme();
  const dispatch = useDispatch();
  const {signOut, toggleTheme} = React.useContext(AuthContext);
  const [order_status_id, setOrder_Status_Id] = useState();
  // let UserMobile = await AsyncStorage.getItem("MobileNumber");
  // const [refreshOrders, setRefreshOrders] = React.useState(props.refreshOrders);

  // useEffect(() => {
  //   setTimeout(async () => {
  //     if (props.refreshOrders) {
  //       let store_type = await AsyncStorage.getItem("store_type");
  //       if (
  //         props?.state?.routes[0]?.state &&
  //         JSON.stringify(props.state?.routes[0]?.state?.index) == "0"
  //       ) {
  //         let OrderStatusId = await AsyncStorage.getItem("order_status_id");
  //         dispatch(orderActions.refreshOrders());
  //         dispatch(orderActions.loadorders(
  //             OrderStatusId ? OrderStatusId : store_type === "default" ? 1 : 20,
  //             1,
  //             true
  //           )
  //         );
  //         dispatch(orderActions.OrderStats());
  //       }
  //       if (props?.state?.routes[0]?.state === undefined) {
  //         let store_type = await AsyncStorage.getItem("store_type");
  //         let OrderStatusId = await AsyncStorage.getItem("order_status_id");
  //         dispatch(orderActions.refreshOrders());
  //         dispatch(
  //           orderActions.loadorders(
  //             OrderStatusId ? OrderStatusId : store_type === "default" ? 1 : 20,
  //             1,
  //             true
  //           )
  //         );
  //         dispatch(orderActions.OrderStats());
  //       }
  //     }
  //     if (props.refreshOrdersFromLogin) {
  //       dispatch(orderActions.refreshOrders());
  //     }
  //   });
  // }, [props]);

  useEffect(() => {
    const refreshOrders = async () => {
      if (props.refreshOrders) {
        let store_type = await AsyncStorage.getItem('store_type');
        let OrderStatusId = await AsyncStorage.getItem('order_status_id');

        const statusId = OrderStatusId
          ? parseInt(OrderStatusId, 10)
          : store_type === 'default'
          ? 1
          : 20;

        if (
          props?.state?.routes[0]?.state?.index === 0 ||
          props?.state?.routes[0]?.state === undefined
        ) {
          dispatch(orderActions.refreshOrders());
          dispatch(orderActions.loadorders(statusId, 1, true));
          dispatch(orderActions.OrderStats());
        }
      }

      if (props.refreshOrdersFromLogin) {
        dispatch(orderActions.refreshOrders());
      }
    };

    setTimeout(refreshOrders, 0);
  }, [props, dispatch]);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View
            style={{backgroundColor: '#337D3E', padding: 10, marginTop: -5}}>
            <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
              Hello, Merchant
            </Text>
          </View>
          {/* <View style={styles.detailsContainer}>
            <FontAwesome name="map-marker" color="#fd6d0d" size={20} />
            <Text style={{ color: "grey", width: 190 }}>
              Home: Alkapoor Township Hyderabad - 5000985
            </Text>
            <TouchableOpacity style={styles.changeButton}>
              <FontAwesome
                name="edit"
                color="#fd6d0d"
                size={20}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View> */}

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              label="My Orders"
              labelStyle={{color: 'black', fontFamily: 'Poppins-Medium'}}
              onPress={() => {
                props.navigation.navigate('Orders');
              }}
            />

            <DrawerItem
              label="My Products"
              labelStyle={{color: 'black', fontFamily: 'Poppins-Medium'}}
              onPress={() => {
                props.navigation.navigate('Products');
              }}
            />

            <DrawerItem
              label="My Customers"
              labelStyle={{color: 'black', fontFamily: 'Poppins-Medium'}}
              onPress={() => {
                props.navigation.navigate('Customers');
              }}
            />

            {/* <Accordian title="My Account">
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listContainer}
                >
                  <Text style={styles.title}>My Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listContainer}
                >
                  <Text style={styles.title}>My Payments</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listContainer}
                >
                  <Text style={styles.title}>My Ratings & Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listContainer}
                >
                  <Text style={styles.title}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listContainer}
                >
                  <Text style={[styles.title]}>My Delivery Address</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listContainer}
                >
                  <Text style={styles.title}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Accordian> */}

            <DrawerItem
              label="Logout"
              labelStyle={{color: 'black', fontFamily: 'Poppins-Medium'}}
              onPress={() => {
                signOut();
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  detailsContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 5,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listContainer: {
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
    color: 'grey',
  },
  shortIcon: {
    marginRight: 20,
  },
});
