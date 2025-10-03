import sampleProduct from './productMock'
import type { Product } from '@/services/productService'

// sampleProducts
const products: Product[] = [
  sampleProduct,
  {
    ...sampleProduct,
    _id: sampleProduct._id + '-2',
    slug: sampleProduct.slug + '-2',
    product_name: 'Smart Tivi OLED 65" MockBrand',
    price: 27990000,
    discount: 15,
    thumbnail: '/vite.svg',
  },
  {
    ...sampleProduct,
    _id: sampleProduct._id + '-3',
    slug: sampleProduct.slug + '-3',
    product_name: 'Tủ Lạnh Inverter 300L MockBrand',
    price: 8990000,
    discount: 5,
    thumbnail: '/vite.svg',
  },
  {
    ...sampleProduct,
    _id: sampleProduct._id + '-4',
    slug: sampleProduct.slug + '-4',
    product_name: 'Máy Giặt Cửa Trên 10kg MockBrand',
    price: 5990000,
    discount: 0,
    thumbnail: '/vite.svg',
  },
  {
    ...sampleProduct,
    _id: sampleProduct._id + '-5',
    slug: sampleProduct.slug + '-5',
    product_name: 'Điều Hòa 12000 BTU MockBrand',
    price: 6490000,
    discount: 8,
    thumbnail: '/vite.svg',
  },
  {
    ...sampleProduct,
    _id: sampleProduct._id + '-6',
    slug: sampleProduct.slug + '-6',
    product_name: 'Loa Bluetooth X200 MockBrand',
    price: 1290000,
    discount: 20,
    thumbnail: '/vite.svg',
  },
]

export default products
