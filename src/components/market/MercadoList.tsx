import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, Animated, StyleSheet } from 'react-native';

interface Item {
  id: string;
  nombre: string;
  precio: string;
}

const datos: Item[] = [
  { id: '1', nombre: 'Producto 1', precio: '$10' },
  { id: '2', nombre: 'Producto 2', precio: '$15' },
  { id: '3', nombre: 'Producto 3', precio: '$20' },
];

export default function MercadoList() {
  const animatedValues = useRef(datos.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const anims = datos.map((_, i) =>
      Animated.timing(animatedValues[i], {
        toValue: 1,
        duration: 300,
        delay: i * 100, // variación para que no se vea robótico
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, anims).start();
  }, []);

  return (
    <FlatList
      data={datos}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const translateY = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        });
        const opacity = animatedValues[index];

        return (
          <Animated.View style={[styles.card, { transform: [{ translateY }], opacity }]}>
            <Text>{item.nombre}</Text>
            <Text>{item.precio}</Text>
          </Animated.View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
});
