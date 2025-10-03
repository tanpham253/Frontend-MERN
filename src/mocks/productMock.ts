import type { Product } from '@/services/productService'

const sampleProduct: Product = {
  _id: 'mock-1',
  product_name: 'Smart Tivi QLED 4K 55" MockBrand',
  slug: 'smart-tivi-qled-4k-55-mockbrand',
  price: 19990000,
  discount: 10,
  thumbnail: '/vite.svg',
  model_year: 2024,
  description: 'Smart Tivi QLED 4K 55 inch của MockBrand, Công nghệ QLED cho màu sắc rực rỡ, hỗ trợ HDR10+ và hệ điều hành nhanh.',
  specs: {
    'Kích thước màn hình': '55 inch',
    'Độ phân giải': '4K Ultra HD (3840 x 2160)',
    'Công nghệ tấm nền': 'QLED',
    'Kết nối': 'Wi-Fi, HDMI x3, USB x2',
    'Năm sản xuất': '2024',
  },
  images: ['/vite.svg', '/vite.svg', '/vite.svg'],
  reviews: [
    { user: 'Nguyễn A', rating: 5, comment: 'Hình ảnh đẹp, màu sắc rực rỡ.' },
    { user: 'Trần B', rating: 4, comment: 'Hiệu năng mượt, giá hợp lý.' },
  ],
  relatedProducts: [],
}

export default sampleProduct;
