export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    hint: string;
  };
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  specialRequests: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}
