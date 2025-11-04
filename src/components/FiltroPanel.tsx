import React, { useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';

export default function FiltrosPanel() {
  const translateX = useRef(new Animated.Value(-300)).current;

  const openPanel = () => {
    Animated.timing(translateX, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closePanel = () => {
    Animated.timing(translateX, { toValue: -300, duration: 300, useNativeDriver: true }).start();
  };

  return (
    <>
      <TouchableOpacity onPress={openPanel}>
        <Text>Abrir Filtros</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        <Text>Filtro 1</Text>
        <Text>Filtro 2</Text>
        <TouchableOpacity onPress={closePanel}>
          <Text>Cerrar</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#eee',
    padding: 16,
  },
});
