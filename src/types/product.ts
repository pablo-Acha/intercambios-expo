export interface Product {
  id: string;
  title: string;
  price?: number;
  image?: string;
  description?: string | null;
  condition?: "Disponible" | "No Disponible" | string;
  category?: string | null;
  alias?: string | null;
  availability?: string;
  status?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    meetingPoint?: string; 
  };
  ownerId?: string;
}
