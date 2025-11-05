import React, { useMemo, useEffect, useState, useRef } from "react";
import { Stack } from "expo-router";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import CategoryList from "../../../src/components/market/CategoryList";
import ProductList from "../../../src/components/market/ProductList";
import { useThemeColors } from "../../../src/hooks/useThemeColors";
import { ThemeColors } from "../../../src/theme/colors";
import { fetchApprovedProducts } from "../../../src/services/productService";
import { useMarketStore } from "../../../src/store/useMarketStore";
import { Ionicons } from '@expo/vector-icons';

const MarketScreen: React.FC = () => {
  const { colors } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useMarketStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [scrollY] = useState(() => new Animated.Value(0));
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const [showCategories, setShowCategories] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; 
  const toggleCategories = () => {
    if (showCategories) {
      setShowCategories(false);
    } else {
      setShowCategories(true);
    }
  };
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showCategories ? 80: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showCategories]);

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const list = await fetchApprovedProducts();
      setProducts(list || []);
    } catch (e) {
      console.log("Error loading products:", e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const list = await fetchApprovedProducts();
      setProducts(list || []);
    } catch (e) {
      console.log("Error refreshing products:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const headerOpacity = (scrollY as any).interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  const clearSearch = () => setSearchQuery("");

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const q = (searchQuery || "").trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      (p.title && p.title.toString().toLowerCase().includes(q)) ||
      (p.description && p.description.toString().toLowerCase().includes(q)) ||
      (p.brand && p.brand.toString().toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  if (loading) {
    return (
      <View style={[styles.wrapper, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary || "#1a1a2e"} />
      <Stack.Screen
        options={{
          title: "Mercado",
          headerStyle: {
            backgroundColor: colors.primary || "#1a1a2e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 20,
          },
        }}
      />

      <View style={styles.wrapper}>
        <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
          <Text style={styles.welcomeText}>Bienvenido al Mercado</Text>
          <Text style={styles.subtitleText}>Encuentra los mejores productos</Text>
        </Animated.View>

        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search-outline" size={22} color={colors.subtitle || '#6c757d'} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos, marcas..."
              placeholderTextColor={colors.subtitle || '#8e8e93'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery?.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearSearch} activeOpacity={0.7}>
                <Ionicons name="close-outline" size={22} color={colors.subtitle || '#6c757d'} />
              </TouchableOpacity>
            )}
          </View>
          {searchQuery?.length > 0 && <Text style={styles.searchResultsText}>Buscando: "{searchQuery}"</Text>}
          <TouchableOpacity onPress={toggleCategories}>
            <Text style={{ color: colors.primary }}>Filtrar Categorías ↓</Text>
          </TouchableOpacity>

          {/* Animación de la lista de categorías */}
          <Animated.View style={{ height: slideAnim, overflow: 'hidden' }}>
            <View
              style={{
                paddingTop: 10,      
              }}
            >
              <CategoryList />
            </View>
          </Animated.View>
        </View>

        {/* <AnimatedFlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductList products={[item]} />}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary || "#10b981"]}
              tintColor={colors.primary || "#10b981"}
            />
          }
        /> */}
        <AnimatedFlatList
          data={[{ key: "products" }]}
          keyExtractor={(item) => String((item as any).key)}
          renderItem={({ item }: { item: any }) => {

            return (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.titleContainer}>
                    <View style={styles.accentLine} />
                    <Text style={styles.sectionTitle}>Productos Destacados</Text>
                  </View>
                </View>

                <ProductList products={filteredProducts} />
              </View>
            );
          }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary || "#10b981"]}
              tintColor={colors.primary || "#10b981"}
            />
          }
        />
      </View>
    </>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background || "#f8f9fa",
    },
    container: {
      paddingBottom: 24,
    },
    headerContainer: {
      backgroundColor: colors.primary || "#1a1a2e",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: "800",
      color: "#ffffff",
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    subtitleText: {
      fontSize: 15,
      color: colors.subtitle || "#e0e0e0",
      fontWeight: "400",
      opacity: 0.9,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 8,
    },
    searchWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface || "#ffffff",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderWidth: 2,
      borderColor: colors.border || "#e8e8e8",
    },
    searchIconContainer: {
      marginRight: 12,
    },
    searchIcon: {
      fontSize: 18,
      opacity: 0.6,
    },
    searchInput: {
      flex: 1,
      color: colors.text || "#000",
      fontSize: 16,
      paddingVertical: 14,
      fontWeight: "500",
    },
    clearButton: {
      padding: 8,
      marginLeft: 8,
    },
    clearIcon: {
      fontSize: 16,
      color: colors.subtitle || "#8e8e93",
      fontWeight: "600",
    },
    searchResultsText: {
      fontSize: 13,
      color: colors.subtitle || "#6c757d",
      marginTop: 12,
      marginLeft: 4,
      fontStyle: "italic",
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    accentLine: {
      width: 4,
      height: 24,
      backgroundColor: colors.primary || "#1a1a2e",
      borderRadius: 2,
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text || "#000",
      letterSpacing: 0.3,
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary || "#1a1a2e",
      opacity: 0.8,
    },
  });

export default MarketScreen;
