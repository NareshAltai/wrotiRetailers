import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
// import FastImage from 'react-native-fast-image';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
} from 'react-native-responsive-dimensions';

// import LinearGradient from 'react-native-linear-gradient';
// import Responsive from '../constants/styles/Responsive';
// import Video from 'react-native-video';
// import COLORS from '../constants/colors';

const {width: screenWidth} = Dimensions.get('window');

const Banner = ({
  data = [],
  height = hp(20),
  autoPlay = true,
  autoPlayInterval = 4000,
  pagination = true,
  // onPressBanner,
  type = 'Home',
}) => {
  const scrollRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || data.length <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % data?.length;
      scrollRef.current?.scrollTo({
        x: screenWidth * nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval, data?.length]);

  const onScroll = event => {
    //: NativeSyntheticEvent<NativeScrollEvent>
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  const bannerWidth = type === 'Home' ? screenWidth - wp(20) : wp(860);
  const GAP = wp(16);
  const slideWidth = bannerWidth - GAP; // Slide width minus the gap

  return (
    <View
      style={{
        marginHorizontal: wp(10),
        borderRadius: wp(14),
        overflow: 'hidden',
      }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={slideWidth + GAP}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{width: bannerWidth}}
        contentContainerStyle={{
          paddingHorizontal: GAP / 2,
        }}>
        {data.map((item, index) => {
          const imageUri = item;
          //   const videoUri = item?.videos?.[0]?.uri;

          return (
            <TouchableOpacity
              key={item.id || index}
              activeOpacity={0.9}
              // onPress={() => onPressBanner(item, index)}
              style={{
                width: slideWidth,
                // height,
                // borderRadius: wp(28),
                overflow: 'hidden',
                marginRight: index === data.length - 1 ? 0 : GAP,
              }}>
              <Image
                source={imageUri}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {pagination && (
        <View style={styles.dotContainer}>
          {data.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={isActive ? styles.activeDot : styles.inactiveDot}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(8),
  },
  activeDot: {
    width: wp(2.5),
    aspectRatio: 1,
    borderRadius: wp(4),
    marginHorizontal: wp(1.5),
    backgroundColor: 'green',
  },
  inactiveDot: {
    width: wp(2.5),
    aspectRatio: 1,
    borderRadius: wp(3),
    backgroundColor: 'grey',
    opacity: 0.2,
    marginHorizontal: wp(2),
  },
});
