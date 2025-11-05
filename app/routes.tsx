import React, { useState, useEffect } from 'react';
import { Animated,View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, router } from 'expo-router';
import { useThemeColors } from '../src/hooks/useThemeColors';
import { LocationService } from '../src/services/locationService';
import { RouteServiceFactory } from '../src/services/routeService';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function RoutesScreen() {
  const { colors } = useThemeColors();
  const params = useLocalSearchParams();
  
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const destination = {
    latitude: parseFloat(params.destinationLat as string),
    longitude: parseFloat(params.destinationLng as string),
  };
  const [markerScale] = useState(new Animated.Value(0));

useEffect(() => {
  if (currentLocation && destination) {
    Animated.spring(markerScale, {
      toValue: 1.2,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }
}, [currentLocation, destination]);
  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (!location) {
        throw new Error('No se pudo obtener la ubicación actual');
      }
      
      setCurrentLocation(location.coords);
      
      const routeProvider = RouteServiceFactory.createProvider('mapbox');
      const calculatedRoute = await routeProvider.getRoute(
        location.coords,
        destination
      );
      
      setRoute(calculatedRoute);
    } catch (error) {
      console.error('Error initializing map:', error);
      Alert.alert('Error', 'No se pudo cargar la ruta');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInMaps = async () => {
    try {
      await LocationService.openInMaps(destination, params.productTitle as string);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la app de mapas');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Cargando ruta...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
      >
        {currentLocation && (
  <Marker coordinate={currentLocation} title="Tu ubicación" pinColor="blue">
    <Animated.View style={{ transform: [{ scale: markerScale }] }}>
      <Ionicons name="location-sharp" size={30} color="blue" />
    </Animated.View>
  </Marker>
)}

<Marker coordinate={destination} title={params.productTitle as string} description={params.meetingPoint as string} pinColor="red">
  <Animated.View style={{ transform: [{ scale: markerScale }] }}>
    <Ionicons name="location-sharp" size={30} color="red" />
  </Animated.View>
</Marker>

        {route && (
          <Polyline
            coordinates={[
              currentLocation,
              destination,
            ]}
            strokeColor="#3b82f6"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Panel inferior con información de la ruta */}
      <View style={[styles.routeInfo, { backgroundColor: colors.background }]}>
        <Text style={[styles.productTitle, { color: colors.text }]}>
          {params.productTitle}
        </Text>
        
        {route && (
          <View style={styles.routeDetails}>
            <Text style={[styles.detailText, { color: colors.text }]}>
              Distancia: {(route.distance / 1000).toFixed(1)} km
            </Text>
            <Text style={[styles.detailText, { color: colors.text }]}>
              Tiempo estimado: {Math.ceil(route.duration / 60)} min
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.mapsButton, { backgroundColor: '#3b82f6' }]}
          onPress={handleOpenInMaps}
        >
          <Ionicons name="navigate" size={20} color="white" />
          <Text style={styles.mapsButtonText}>Abrir en Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height: height * 0.7,
  },
  routeInfo: {
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
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  routeDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  mapsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});