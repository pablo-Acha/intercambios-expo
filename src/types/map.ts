export interface POI {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  type: 'meeting_point' | 'seller_location' | 'user_location';
}

export interface Route {
  distance: number; 
  duration: number; 
  polyline: string; 
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface MapFilters {
  category?: string;
  type?: string;
  status?: string;
  career?: string;
}

