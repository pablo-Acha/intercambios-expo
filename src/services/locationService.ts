import * as Location from 'expo-location';
import { Platform, Linking } from 'react-native';
import { POI, Route } from '../types/map';

export class LocationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; 
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; 
    
    return distance;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  static async openInMaps(
    destination: { latitude: number; longitude: number },
    destinationName?: string
  ): Promise<void> {
    const { latitude, longitude } = destination;
    
    const currentLocation = await this.getCurrentLocation();
    
    let url = '';
    
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
      if (destinationName) {
        url += `&q=${encodeURIComponent(destinationName)}`;
      }
      if (currentLocation) {
        url += `&saddr=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
      }
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      if (destinationName) {
        url += `&destination_place_id=${encodeURIComponent(destinationName)}`;
      }
      if (currentLocation) {
        url += `&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
      }
    }
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        throw new Error('No se puede abrir la app de mapas');
      }
    } catch (error) {
      console.error('Error opening maps app:', error);
      throw error;
    }
  }

  static async getAddressFromCoords(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        const first = address[0];
        return `${first.street || ''} ${first.streetNumber || ''}, ${first.city || ''}`.trim();
      }
      return 'Dirección no disponible';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Dirección no disponible';
    }
  }
}