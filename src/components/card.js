import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const AnimatedTemplate = () => {
  const [animation] = useState(new Animated.Value(0));

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const cardScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const cardOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  return (
    <TouchableOpacity onPress={startAnimation} activeOpacity={0.8}>
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }], opacity: cardOpacity }]}>
        <View style={styles.background} />
        <Text style={styles.title}>Merchant App</Text>
        <Text style={styles.description}>Get 30% off your first purchase</Text>
        <Text style={styles.code}>CODE: WELCOME30</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4D4D4',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F0EDE7',
    opacity: 0.5,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 5,
    zIndex: 1,
  },
  description: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 5,
    zIndex: 1,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F24646',
    zIndex: 1,
  },
});

export default AnimatedTemplate;
