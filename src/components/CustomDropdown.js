import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Animated,
  TextInput,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveHeight,
  responsiveWidth as wp,
} from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
// import GlobalText from './GlobalText/GlobalText';

// 🎨 Local color palette (replacement for constants/Colors)
const greyColor = '#9CA3AF';
const lightWhiteColor = '#F9FAFB';
const primaryBlackColor = '#111827';
const whiteBorderColor = '#E5E7EB';

const CustomDropDown = ({
  isOpen,
  onToggle,
  data = [],
  selectedItem,
  onSelectItem,
  placeholder = 'Select an option',
  maxHeight = 200,
  width = 200,
  renderItem = null,
  keyExtractor = (item, index) => item.id || index,
  labelExtractor = item =>
    item.label || item.name || item.text || item.toString(),
  disabled = false,
  style = {},
  dropdownStyle = {},
  itemStyle = {},
  textStyle = {},
  placeholderStyle = {},
  showLabel = false,
  labelText = '',
  showToggle = true,
  dropdownContainerStyles = {},
  dropDownHeader = <></>,
  labelStyles = {},
  rightIcon = null,
  iconStyle = {},
  isSearchable = false,
  searchText = '',
  onSearchChange = () => {},
  searchPlaceholder = 'Search...',
  searchInputStyles = {},
}) => {
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const measureDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measure((fx, fy, width, height, px, py) => {
        if (!isNaN(py) && !isNaN(height)) {
          setDropdownPosition({
            top: py + height - responsiveHeight(3),
            left: px,
            width: width,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      measureDropdown();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleSelectItem = item => {
    onSelectItem(item);
    onToggle(false);
  };

  const getSelectedLabel = () => {
    if (!selectedItem) return placeholder;
    return labelExtractor(selectedItem);
  };

  const isItemSelected = item => {
    if (!selectedItem) return false;
    const selectedKey = keyExtractor(selectedItem, -1);
    const itemKey = keyExtractor(item, -1);
    return selectedKey === itemKey;
  };

  const renderChevronIcon = () => (
    <View
      style={[
        styles.chevron,
        isOpen && styles.chevronRotated,
        {opacity: showToggle ? 1 : 0},
        iconStyle,
      ]}>
      <Entypo name="chevron-thin-down" size={wp(5)} color="#88A0BF" />
    </View>
  );

  const renderCheckIcon = () => <Text style={styles.checkIcon}>✓</Text>;

  const filteredData = isSearchable
    ? data.filter(item =>
        labelExtractor(item).toLowerCase().includes(searchText.toLowerCase()),
      )
    : data;

  return (
    <View style={[{width}, style]}>
      <Text
        style={[
          {display: showLabel ? 'flex' : 'none', marginVertical: hp(1)},
          labelStyles,
          {fontFamily: 'Poppins-Regular', color: greyColor, fontSize: 12},
        ]}>
        {labelText}
      </Text>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        ref={dropdownRef}
        onPress={() => !disabled && onToggle(!isOpen)}
        disabled={disabled}
        style={[
          styles.dropdownTrigger,
          disabled && styles.disabled,
          isOpen && styles.dropdownTriggerOpen,
          {width},
          dropdownContainerStyles,
        ]}
        activeOpacity={0.7}>
        <Text
          numberOfLines={1}
          style={[
            styles.triggerText,
            !selectedItem && styles.placeholderText,
            !selectedItem ? placeholderStyle : textStyle,
            disabled && styles.disabledText,
            {
              fontFamily: selectedItem ? 'Poppins-SemiBold' : 'Poppins-Regular',
              color: selectedItem ? primaryBlackColor : greyColor,
            },
          ]}>
          {getSelectedLabel()}
        </Text>
        {rightIcon ? rightIcon : renderChevronIcon()}
      </TouchableOpacity>

      {/* Modal Overlay */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => onToggle(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => onToggle(false)}>
          <Animated.View
            style={[
              styles.dropdownContainer,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
              dropdownStyle,
            ]}>
            <ScrollView
              style={[styles.scrollView, {maxHeight}]}
              showsVerticalScrollIndicator
              nestedScrollEnabled>
              {isSearchable && (
                <TextInput
                  style={[styles.searchInput, searchInputStyles]}
                  value={searchText}
                  onChangeText={onSearchChange}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#aaa"
                />
              )}
              {filteredData.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No options available</Text>
                </View>
              ) : (
                <>
                  {dropDownHeader}
                  {filteredData?.map((item, index) => {
                    const key = keyExtractor(item, index);
                    const label = labelExtractor(item);
                    const selected = isItemSelected(item);

                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => handleSelectItem(item)}
                        style={[
                          styles.dropdownItem,
                          {
                            borderBottomWidth:
                              index === filteredData.length - 1 ? 0 : 1,
                          },
                          selected && styles.selectedItem,
                          itemStyle,
                        ]}
                        activeOpacity={0.7}>
                        {renderItem ? (
                          renderItem(item, selected)
                        ) : (
                          <>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.itemText,
                                selected && styles.selectedItemText,
                              ]}>
                              {label}
                            </Text>

                            {selected && renderCheckIcon()}
                          </>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(0.5),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: whiteBorderColor,
    borderRadius: wp(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownTriggerOpen: {
    borderColor: whiteBorderColor,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.2,
  },
  disabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  triggerText: {
    marginLeft: wp(2),
    textTransform: 'capitalize',
    flex: 1,
    paddingRight: wp(2),
  },
  placeholderText: {color: '#9CA3AF'},
  disabledText: {color: '#6B7280'},
  chevron: {
    transform: [{rotate: '0deg'}],
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: lightWhiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  chevronRotated: {transform: [{rotate: '180deg'}]},
  overlay: {flex: 1, backgroundColor: 'transparent'},
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  scrollView: {flex: 1},
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.3),
    borderBottomWidth: 1,
    borderBottomColor: whiteBorderColor,
    marginHorizontal: wp(3),
  },
  selectedItem: {backgroundColor: '#EFF6FF'},
  itemText: {
    flex: 1,
    textTransform: 'capitalize',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  selectedItemText: {color: '#3B82F6', fontWeight: '500'},
  checkIcon: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {paddingHorizontal: 16, paddingVertical: 12},
  emptyText: {fontSize: 14, color: '#9CA3AF', textAlign: 'center'},
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
    fontSize: 14,
    color: '#333',
  },
});

export default CustomDropDown;
