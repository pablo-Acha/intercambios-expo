import React from 'react';
import { FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ThemeColors } from '../../theme/colors';
import { useMarketStore } from '../../store/useMarketStore';

const categories = [
  { id: '1', name: 'Todas' },
  { id: '2', name: 'Electrónica' },
  { id: '3', name: 'Ropa' },
  { id: '4', name: 'Libros' },
  { id: '5', name: 'Hogar' },
  { id: '6', name: 'Deportes' },
];

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { paddingVertical: 8 },
    card: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
    },
    text: { fontWeight: '600' },
  });

const CategoryList = () => {
  const { colors } = useThemeColors();
  const { selectedCategory, setSelectedCategory } = useMarketStore();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      extraData={selectedCategory}
      renderItem={({ item }) => {
        const isSelected =
          selectedCategory === item.name ||
          (selectedCategory === null && item.name === 'Todas');

        return (
          <Pressable
            onPress={() =>
              setSelectedCategory(item.name === 'Todas' ? null : item.name)
            }
            style={[
              styles.card,
              {
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : colors.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: isSelected ? 'white' : colors.text },
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
};

export default CategoryList;
