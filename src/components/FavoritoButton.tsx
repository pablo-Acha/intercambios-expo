import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Text } from 'react-native';

interface Props {
  isFavorito: boolean;
  onToggle: () => void;
}

export default function FavoritoButton({ isFavorito, onToggle }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={{ color: isFavorito ? 'red' : 'gray' }}>♥</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
