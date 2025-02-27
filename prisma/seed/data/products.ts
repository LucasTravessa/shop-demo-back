import { Product } from '@prisma/client';

export const productsData: Array<
  Pick<Product, 'title' | 'description' | 'picture' | 'price' | 'quantity'>
> = [
  {
    title: 'Eco-Friendly Water Bottle',
    description:
      'A high-quality and durable product made with sustainability in mind.',
    picture: 'https://picsum.photos/200/300?random=1',
    price: 5,
    quantity: 178,
  },
  {
    title: 'Wireless Bluetooth Speaker',
    description:
      'Enjoy superior sound quality with this compact and stylish speaker.',
    picture: 'https://picsum.photos/200/300?random=2',
    price: 8,
    quantity: 134,
  },
  {
    title: 'Organic Cotton T-Shirt',
    description:
      'Made from 100% organic cotton, soft and comfortable for daily wear.',
    picture: 'https://picsum.photos/200/300?random=3',
    price: 3,
    quantity: 190,
  },
  {
    title: 'Portable Solar Charger',
    description:
      'Perfect for camping or outdoor activities, charges your devices anywhere.',
    picture: 'https://picsum.photos/200/300?random=4',
    price: 9,
    quantity: 125,
  },
  {
    title: 'Reusable Coffee Cup',
    description:
      'Keep your coffee hot for hours with this double-walled reusable cup.',
    picture: 'https://picsum.photos/200/300?random=5',
    price: 7,
    quantity: 143,
  },
  {
    title: 'Smart LED Light Bulb',
    description:
      'Control your lighting remotely with this energy-efficient smart bulb.',
    picture: 'https://picsum.photos/200/300?random=6',
    price: 4,
    quantity: 198,
  },
  {
    title: 'Ergonomic Office Chair',
    description:
      'Designed for maximum comfort and productivity in your workspace.',
    picture: 'https://picsum.photos/200/300?random=7',
    price: 6,
    quantity: 112,
  },
  {
    title: 'Noise Cancelling Headphones',
    description:
      'Immerse yourself in crystal-clear audio with advanced noise cancellation.',
    picture: 'https://picsum.photos/200/300?random=8',
    price: 10,
    quantity: 155,
  },
  {
    title: 'Stainless Steel Lunch Box',
    description:
      'Leak-proof and stylish, perfect for carrying your lunch on the go.',
    picture: 'https://picsum.photos/200/300?random=9',
    price: 2,
    quantity: 176,
  },
  {
    title: 'Electric Toothbrush',
    description:
      'Advanced cleaning technology for a healthier and brighter smile.',
    picture: 'https://picsum.photos/200/300?random=10',
    price: 1,
    quantity: 189,
  },
];
