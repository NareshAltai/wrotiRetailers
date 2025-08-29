import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

// interface LoadingButtonProps {
//   width?: number;
//   height?: number;
//   title: string;
//   titleFontSize?: number;
//   titleFontFamily?: string;
//   titleColor?: string;
//   backgroundColor?: string;
//   borderRadius?: number;
//   onPress: () => Promise<void> | void;
//   style?: ViewStyle;
// }

// export interface LoadingButtonRef {
//   showLoader: () => void;
//   hideLoader: () => void;
// }

const CustomLoadingButton = forwardRef(
  (
    {
      width = 328,
      height = 52,
      title,
      titleFontSize = 18,
      titleFontFamily = 'System',
      titleColor = '#FFF',
      backgroundColor = '#34A549',
      borderRadius = 4,
      onPress,
      style,
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);

    const widthAnim = useRef(new Animated.Value(width)).current;
    const borderRadiusAnim = useRef(new Animated.Value(borderRadius)).current;

    useImperativeHandle(ref, () => ({
      showLoader: () => setLoading(true),
      hideLoader: () => setLoading(false),
    }));

    const handlePress = async () => {
      setLoading(true);

      // animate to circle
      Animated.parallel([
        Animated.timing(widthAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(borderRadiusAnim, {
          toValue: height / 2,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();

      try {
        await onPress();
      } finally {
        // reset after work
        Animated.parallel([
          Animated.timing(widthAnim, {
            toValue: width,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(borderRadiusAnim, {
            toValue: borderRadius,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => setLoading(false));
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={loading}>
        <Animated.View
          style={[
            {
              width: widthAnim,
              height,
              borderRadius: borderRadiusAnim,
              backgroundColor,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            },
            style,
          ]}>
          {loading ? (
            <ActivityIndicator color={titleColor} />
          ) : (
            <Text
              style={{
                color: titleColor,
                fontSize: titleFontSize,
                fontFamily: titleFontFamily,
              }}>
              {title}
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

export default CustomLoadingButton;
