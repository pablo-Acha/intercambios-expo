import React, { useMemo, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import ProductModal from "./productModal";
import { ProductCard } from "./productCard";
import { useMarketStore } from "../../store/useMarketStore";

interface ProductListProps {
  products: any[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: any) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onDelete, onUpdate, refreshing = false, onRefresh }) => {
  const { colors } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { selectedCategory, searchQuery } = useMarketStore();

  const filteredProducts = useMemo(() => {
    const filtered = (products || []).filter((p: any) => {
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const q = (searchQuery || "").trim().toLowerCase();
      const matchesText =
        q === "" ||
        (p.title && p.title.toString().toLowerCase().includes(q)) ||
        (p.description && p.description.toString().toLowerCase().includes(q)) ||
        (p.brand && p.brand.toString().toLowerCase().includes(q));
      return matchesCategory && matchesText;
    });

    return filtered.sort((a, b) => {
      const aIsAvailable = a.condition !== "Usado" && a.status !== "No Disponible";
      const bIsAvailable = b.condition !== "Usado" && b.status !== "No Disponible";
      
      if (aIsAvailable === bIsAvailable) return 0;
      
      if (aIsAvailable && !bIsAvailable) return -1;
      
      return 1;
    });
  }, [products, selectedCategory, searchQuery]);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleTradeNow = (product: any) => {
    console.log("Intercambiar ahora:", product?.id);
    handleCloseModal();
  };

  if (!products) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const productData = {
            ...item,
            image: item.image ?? item.images?.thumb ?? item.images?.original ?? "",
            condition: item.condition === "Usado" ? "No Disponible" : "Disponible",
            alias: item.alias ?? "usuario",
            status: item.status ?? "approved",
          };

          return (
            <ProductCard
              product={productData}
              onPress={() => handleProductPress(item)}
              isProfileCard={!!onDelete || !!onUpdate}
              onDelete={onDelete ? () => onDelete(item.id) : undefined}
              onUpdate={onUpdate ? (data) => onUpdate(item.id, data) : undefined}
            />
          );
        }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[ (colors as any).primary || "#10b981" ]}
              tintColor={(colors as any).primary || "#10b981"}
            />
          ) : undefined
        }
      />

      <ProductModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={handleCloseModal}
        TradeNow={handleTradeNow}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { backgroundColor: colors.background },
  });

export default ProductList;
