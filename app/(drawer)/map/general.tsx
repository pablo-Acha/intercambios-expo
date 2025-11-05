import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, router } from 'expo-router';
import { useThemeColors } from '../../../src/hooks/useThemeColors';
import { fetchApprovedProducts } from '../../../src/services/productService';
import { Product } from '../../../src/types/product';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function GeneralMap() {
  const { colors } = useThemeColors();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [region, setRegion] = useState({
    latitude: -17.3895, 
    longitude: -66.1568,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const approvedProducts = await fetchApprovedProducts();
      const productsWithLocation = approvedProducts.filter(
        (product: any) => product.location && product.location.latitude && product.location.longitude
      ) as Product[];
      
      setProducts(productsWithLocation);
      
      if (productsWithLocation.length > 0 && productsWithLocation[0].location) {
        setRegion(prev => ({
          ...prev,
          latitude: productsWithLocation[0].location!.latitude,
          longitude: productsWithLocation[0].location!.longitude,
        }));
      }
    } catch (error) {
      console.error('Error loading products for map:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleGoToProduct = () => {
    if (selectedProduct) {
      router.push(`/product/${selectedProduct.id}`);
      setSelectedProduct(null);
    }
  };

  const handleShowRoute = () => {
    if (selectedProduct?.location) {
      router.push({
        pathname: '/routes',
        params: {
          productId: selectedProduct.id,
          productTitle: selectedProduct.title,
          destinationLat: selectedProduct.location.latitude,
          destinationLng: selectedProduct.location.longitude,
          meetingPoint: selectedProduct.location.meetingPoint || 'Punto de encuentro'
        }
      });
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Cargando mapa...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={setRegion}
      >
        {products.map(product => (
          <Marker
            key={product.id}
            coordinate={{
              latitude: product.location!.latitude,
              longitude: product.location!.longitude,
            }}
            title={product.title}
            description={product.price ? `Bs ${product.price}` : 'Intercambio'}
            onPress={() => handleMarkerPress(product)}
          />
        ))}
      </MapView>

      {/* Panel de información del producto seleccionado */}
      {selectedProduct && (
        <View style={[styles.productPanel, { backgroundColor: colors.background }]}>
          <View style={styles.productHeader}>
            <Text style={[styles.productTitle, { color: colors.text }]}>
              {selectedProduct.title}
            </Text>
            <TouchableOpacity 
              onPress={() => setSelectedProduct(null)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.productDetails}>
            {selectedProduct.price && (
              <Text style={[styles.productPrice, { color: colors.primary }]}>
                Bs {selectedProduct.price}
              </Text>
            )}
            
            {selectedProduct.category && (
              <Text style={[styles.productCategory, { color: colors.muted }]}>
                {selectedProduct.category}
              </Text>
            )}
            
            {selectedProduct.location?.meetingPoint && (
              <Text style={[styles.meetingPoint, { color: colors.text }]}>
                📍 {selectedProduct.location.meetingPoint}
              </Text>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleGoToProduct}
            >
              <Ionicons name="eye-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>Ver Producto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
              onPress={handleShowRoute}
            >
              <Ionicons name="navigate-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>Cómo Llegar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contador de productos en el mapa */}
      {!selectedProduct && (
        <View style={[styles.counterBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.counterText}>
            {products.length} productos en el mapa
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  productPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: height * 0.4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  productDetails: {
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    marginBottom: 5,
  },
  meetingPoint: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  counterBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});