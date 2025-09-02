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
  FlatList,
  Modal,
  Button,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
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
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import RNFetchBlob from 'react-native-blob-util';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SalesReport = ({navigation, title}) => {
  const theme = useTheme();
  const [storeType, setStoreType] = React.useState();
  const [totalSales, setTotalSales] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [visible, setVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState('day');
  const options = ['day', 'week', 'month', 'year'];
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const [visibleOrderType, setVisibleOrderType] = React.useState(false);
  const [selectedOrdertype, setSelectedOrderType] = React.useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const store = async () => {
    let store_type = await AsyncStorage.getItem('store_type');
    console.log('store=======', store_type);
    setStoreType(store_type);
  };

  useEffect(() => {
    store();
    if (isFirstLoad && storeType) {
      salesReports();
      setIsFirstLoad(false);
    }
  }, [storeType, isFirstLoad]);

  // Reset filters function
  useEffect(() => {
    if (isResetting) {
      salesReports();
      setIsResetting(false);
    }
  }, [isResetting]);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedOrderType(null);
    setSelectedItem('day');
    setTotalSales([]);
    setPage(1);
    setTotal(0);
    setIsResetting(true);
  };

  let orderTypes;
  let selectedOrderTypeId;

  if (storeType === 'default') {
    orderTypes = [
      {id: '0', name: 'All Statuses'},
      {id: '2', name: 'Accepted'},
      {id: '17', name: 'Rejected'},
      {id: '7', name: 'Cancelled'},
      {id: '5', name: 'Delivered'},
      {id: '10', name: 'Failed'},
      {id: '11', name: 'Refunded'},
      {id: '1', name: 'Pending'},
      {id: '15', name: 'Dispatched'},
      {id: '19', name: 'Authorized'},
      {id: '20', name: 'Payment Received'},
    ];
    selectedOrderTypeId = orderTypes.find(
      order => order.name === 'All Statuses',
    ).id;
  } else if (storeType === 'nexus') {
    orderTypes = [{id: '5', name: 'Delivered'}];
    selectedOrderTypeId = '5';
  }

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download the file',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // On Android 13+ or iOS, no permission needed
  };

  const downloadContent = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'You need to give storage permission to download the file',
      );
      return;
    }

    try {
      const header = ` Start date , End date , Orders , Products , Total\n`; // Corrected header format
      const content = totalSales
        .map(
          item =>
            `${item.date_start},${item.date_end},${item.orders},${item.products},"${item.total}"\n`,
        )
        .join('');

      const fileContent = header + content;
      const directoryPath = RNFetchBlob.fs.dirs.DownloadDir;
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      const filePath = `${directoryPath}/sales_report_${timestamp}.csv`;

      // Write the content to a file
      await RNFetchBlob.fs.writeFile(filePath, fileContent, 'utf8');
      console.log('File saved:', filePath);
      Alert.alert('Success', 'File downloaded successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to download the file');
    }
  };

  // downloadContent();

  //  const downloadContent = async () => {
  //   try {
  //     const header = ` Start date , End date , Orders , Products , Total\n`; // Corrected header format
  //     const content = totalSales.map(item => (
  //       `${item.date_start},${item.date_end},${item.orders},${item.products},"${item.total}"\n` // Changed formatting to separate values with commas
  //     )).join('');

  //     const fileContent = header + content;
  //     const directoryPath = RNFetchBlob.fs.dirs.DownloadDir;
  //     const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
  //     const filePath = `${directoryPath}/sales_report_${timestamp}.csv`;

  //     // Write the content to a file
  //     await RNFetchBlob.fs.writeFile(filePath, fileContent, 'utf8');
  //     console.log('File saved:', filePath);
  //     Alert.alert('Success', 'File downloaded successfully');
  //   } catch (error) {
  //     console.error('Error saving file:', error);
  //   }
  // };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleItemPress = item => {
    setSelectedItem(item);
    closeMenu();
  };

  const openOrderTypeMenu = () => setVisibleOrderType(true);
  const closeOrderTypeMenu = () => setVisibleOrderType(false);

  const handleOrderTypePress = id => {
    const selectedOrderType = orderTypes.find(order => order.id === id);
    setSelectedOrderType(selectedOrderType); // Store both ID and name
    closeOrderTypeMenu();
  };

  const salesReports = async (pageNumber = 1) => {
    setLoading(true);
    if (pageNumber === 1) setInitialLoading(true);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let reportType = 'sale_order';
    let Token = await AsyncStorage.getItem('token');

    let reportsResponse = await api.salesReports(
      startDate,
      endDate,
      selectedItem,
      selectedOrderTypeId,
      UserMobile,
      Token,
      reportType,
      pageNumber,
      limit,
    );
    console.log(
      'reportsResponse =============',
      JSON.stringify(reportsResponse.data.data),
    );
    setTotalSales(prevSales =>
      pageNumber === 1
        ? reportsResponse.data.data.orders
        : [...prevSales, ...reportsResponse.data.data.orders],
    );
    setTotal(reportsResponse.data.data.total);
    setLoading(false);
    setInitialLoading(false);
  };

  const loadMoreData = async () => {
    if (!loading && totalSales.length < total) {
      const nextPage = page + 1;
      setPage(nextPage);
      const newData = await salesReports(nextPage); // Wait for salesReports to complete and return data
      if (newData) {
        // Check for duplicates based on order IDs
        const uniqueOrders = newData.filter(
          order =>
            !totalSales.some(
              existingOrder => existingOrder.orderId === order.orderId,
            ),
        );
        // Append only unique orders to the existing sales data
        setTotalSales(prevSales => [...prevSales, ...uniqueOrders]);
      }
    }
  };

  const renderItem = ({item, index}) => (
    <View style={{marginTop: 2}}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          marginHorizontal: 5,
        }}>
        <View style={{width: '25.3%'}}>
          <Text
            style={{
              color: '#0F0F0F',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            {item.date_start}
          </Text>
        </View>
        <View style={{width: '26.3%'}}>
          <Text
            style={{
              color: '#0F0F0F',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            {item.date_end}
          </Text>
        </View>
        <View style={{width: '18.3%'}}>
          <Text
            style={{
              color: '#0F0F0F',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            {item.orders}
          </Text>
        </View>
        <View style={{width: '13.3%'}}>
          <Text
            style={{
              color: '#0F0F0F',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            {item.products}
          </Text>
        </View>
        <View style={{width: '27.3%'}}>
          <Text
            style={{
              color: '#0F0F0F',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            {item.total}
          </Text>
        </View>
      </View>
      <Divider />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Header title={'Sales Reports'} />

      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          marginHorizontal: 30,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setOpenStartDate(true)}>
          <Text style={styles.dateText}>
            {startDate ? moment(startDate).format('DD-MM-YYYY') : 'Start Date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setOpenEndDate(true)}>
          <Text style={styles.dateText}>
            {endDate ? moment(endDate).format('DD-MM-YYYY') : 'End Date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
        {/* <DatePicker
          style={styles.datePickerStyle}
          date={startDate}
          mode="date"
          placeholder="Start Date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={val => {
            setStartDate(val);
            setEndDate(null);
          }}
          maxDate={new Date()}
        /> */}

        {/* <DatePicker
          style={styles.datePickerStyle}
          date={endDate}
          mode="date"
          placeholder="End Date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={val => {
            setEndDate(val);
          }}
          minDate={startDate ? moment(startDate).toDate() : new Date()}
          maxDate={new Date()}
        /> */}
      </View>

      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            height: 40,
            width: 100,
            borderWidth: 1,
            borderRadius: 5,
            justifyContent: 'center',
            marginHorizontal: 10,
            marginTop: 20,
          }}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={openMenu}>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: 10,
                    color: '#0F0F0F',
                  }}>
                  {selectedItem}
                </Text>
                <Image
                  style={{
                    height: 15,
                    width: 15,
                    marginLeft: 'auto',
                    marginRight: 4,
                    alignSelf: 'center',
                  }}
                  source={require('../../assets/images/downIcon.png')}
                />
              </TouchableOpacity>
            }>
            {options.map(option => (
              <Menu.Item
                key={option}
                onPress={() => handleItemPress(option)}
                title={option}
              />
            ))}
          </Menu>
        </View>

        <View
          style={{
            height: 40,
            width: 120,
            borderWidth: 1,
            borderRadius: 5,
            justifyContent: 'center',
            marginHorizontal: 5,
            marginTop: 20,
          }}>
          <Menu
            visible={visibleOrderType}
            onDismiss={closeOrderTypeMenu}
            anchor={
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={openOrderTypeMenu}>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: 10,
                    color: '#0F0F0F',
                  }}>
                  {selectedOrdertype
                    ? selectedOrdertype.name
                    : orderTypes?.length > 0
                    ? orderTypes[0].name
                    : ''}
                </Text>
                <Image
                  style={{
                    height: 15,
                    width: 15,
                    marginLeft: 'auto',
                    marginRight: 4,
                    alignSelf: 'center',
                  }}
                  source={require('../../assets/images/downIcon.png')}
                />
              </TouchableOpacity>
            }>
            {orderTypes?.map(option => (
              <Menu.Item
                key={option.id}
                onPress={() => handleOrderTypePress(option.id)}
                title={option.name}
              />
            ))}
          </Menu>
        </View>

        <View
          style={{
            height: 40,
            width: 100,
            backgroundColor: 'green',
            marginTop: 20,
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          <TouchableOpacity onPress={() => salesReports()}>
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                color: '#FFF',
                alignSelf: 'center',
              }}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          height: 40,
          width: 100,
          backgroundColor: 'red',
          marginTop: 10,
          justifyContent: 'center',
          borderRadius: 5,
          marginLeft: 'auto',
          marginRight: 10,
        }}>
        <TouchableOpacity onPress={() => resetFilters()}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 16,
              color: '#FFF',
              alignSelf: 'center',
            }}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      <Divider style={{marginTop: 10, height: 1}} />
      {/* <View style={{borderRadius: 10, borderColor: "#e6e6e6",marginHorizontal: 5, borderWidth: 1}}> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#e6e6e6',
          height: 40,
          paddingTop: 8,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderColor: '#bdbfbe',
        }}>
        <Text
          style={{
            marginVertical: 5,
            marginHorizontal: 5,
            color: '#797a7a',
            fontFamily: 'Poppins-SemiBold',
            fontSize: 12,
            marginTop: 2,
          }}>
          Start date
        </Text>
        <Text
          style={{
            marginVertical: 5,
            marginHorizontal: 5,
            color: '#797a7a',
            fontFamily: 'Poppins-SemiBold',
            fontSize: 12,
            marginTop: 2,
          }}>
          End date
        </Text>
        <Text
          style={{
            marginVertical: 5,
            marginHorizontal: 5,
            color: '#797a7a',
            fontFamily: 'Poppins-SemiBold',
            fontSize: 12,
            marginTop: 2,
          }}>
          Orders
        </Text>
        <Text
          style={{
            marginRight: 15,
            color: '#797a7a',
            fontFamily: 'Poppins-SemiBold',
            fontSize: 12,
            marginTop: 2,
            // margin: '',
          }}>
          Products
        </Text>
        <Text
          style={{
            marginRight: 15,
            color: '#797a7a',
            fontFamily: 'Poppins-SemiBold',
            fontSize: 12,
            marginTop: 2,
            // margin: '',
          }}>
          Total
        </Text>
      </View>
      <DatePicker
        modal
        open={openStartDate}
        date={startDate || new Date()}
        mode="date"
        maximumDate={new Date()}
        onConfirm={date => {
          setOpenStartDate(false);
          setStartDate(date);
          setEndDate(null); // reset end date if start changes
        }}
        onCancel={() => setOpenStartDate(false)}
      />

      <DatePicker
        modal
        open={openEndDate}
        date={endDate || new Date()}
        mode="date"
        minimumDate={endDate || undefined}
        maximumDate={new Date()}
        onConfirm={date => {
          setOpenEndDate(false);
          setEndDate(date);
        }}
        onCancel={() => setOpenEndDate(false)}
      />

      <ScrollView>
        {initialLoading ? (
          <ActivityIndicator size="large" color="green" />
        ) : totalSales.length === 0 ? (
          <Text style={{textAlign: 'center', margin: 20, color: '#000'}}>
            No sales report to display
          </Text>
        ) : (
          <FlatList
            data={totalSales}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading && page > 1 ? (
                <ActivityIndicator size="small" color="green" />
              ) : null
            }
          />
        )}
      </ScrollView>
      {/* </View> */}

      {/* download report button */}
      {totalSales != 0 && (
        <TouchableOpacity
          style={{
            height: 40,
            width: '50%',
            backgroundColor: 'green',
            alignSelf: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            marginTop: 10,
            flexDirection: 'row',
          }}
          onPress={downloadContent}>
          <Text
            style={{
              color: '#FFF',
              fontFamily: 'Poppins-Bold',
              alignSelf: 'center',
              marginLeft: 15,
            }}>
            Download Report
          </Text>
          <Image
            style={{
              resizeMode: 'center',
              alignSelf: 'center',
              tintColor: '#FFF',
            }}
            source={require('../../assets/downloadIcon.png')}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SalesReport;
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
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    marginRight: 5,
  },
  valueText: {
    marginLeft: 5,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  dateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#000',
  },
});
