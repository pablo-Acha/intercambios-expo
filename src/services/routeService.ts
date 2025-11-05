import { Route, POI } from '../types/map';
import { LocationService } from './locationService';

export interface RouteProvider {
  getRoute(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): Promise<Route>;
}

export class MapboxRouteProvider implements RouteProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getRoute(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): Promise<Route> {
    const distance = LocationService.calculateDistance(
      origin.latitude, origin.longitude,
      destination.latitude, destination.longitude
    );

    return {
      distance: distance * 1000, 
      duration: distance * 15 * 60, 
      polyline: '',
      steps: [
        {
          instruction: `Dirígete hacia el punto de encuentro (${distance.toFixed(1)} km)`,
          distance: distance * 1000,
          duration: distance * 15 * 60
        }
      ]
    };
  }
}

export class RouteServiceFactory {
  static createProvider(provider: 'mapbox' | 'google' | 'osrm'): RouteProvider {
    switch (provider) {
      case 'mapbox':
        return new MapboxRouteProvider('tu_mapbox_key');

      default:
        return new MapboxRouteProvider('tu_mapbox_key');
    }
  }
}