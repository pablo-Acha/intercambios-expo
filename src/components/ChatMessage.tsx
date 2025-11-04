import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';

interface Props {
  mensaje: string;
}

export default function ChatMessage({ mensaje }: Props) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.message, { transform: [{ translateY }], opacity }]}>
      <Text>{mensaje}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  message: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
  },
});
