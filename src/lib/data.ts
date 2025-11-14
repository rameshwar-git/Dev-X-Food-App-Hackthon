import type { MenuItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const placeholder = PlaceHolderImages.find(p => p.id === id);
  if (!placeholder) {
    return {
      src: 'https://picsum.photos/seed/placeholder/600/400',
      alt: 'Placeholder image',
      width: 600,
      height: 400,
      hint: 'placeholder'
    };
  }
  const url = new URL(placeholder.imageUrl);
  const pathParts = url.pathname.split('/');
  const width = parseInt(pathParts[pathParts.length - 2]);
  const height = parseInt(pathParts[pathParts.length - 1]);

  return {
    src: placeholder.imageUrl,
    alt: placeholder.description,
    width,
    height,
    hint: placeholder.imageHint
  };
};

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Gourmet Burger',
    description: '1/3 lb beef patty, brioche bun, lettuce, tomato, and our special sauce.',
    price: 12.99,
    image: getImage('burger'),
  },
  {
    id: '2',
    name: 'Crispy Fries',
    description: 'Golden, crispy, and perfectly salted. The best side for any meal.',
    price: 4.99,
    image: getImage('fries'),
  },
  {
    id: '3',
    name: 'Garden Salad',
    description: 'Fresh greens, cherry tomatoes, cucumbers, and a light vinaigrette.',
    price: 8.99,
    image: getImage('salad'),
  },
  {
    id: '4',
    name: 'Fizzy Soda',
    description: 'Choose from a selection of popular fizzy drinks.',
    price: 2.50,
    image: getImage('soda'),
  },
];
