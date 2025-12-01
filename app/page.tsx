'use client';

import ProductCard from './components/ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
}

export default function Home() {
  // 임시 상품 데이터 6개
  const products: Product[] = [
    {
      id: 1,
      title: '아이폰 15 Pro Max 256GB',
      price: 1500000,
      imageUrl: null,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    },
    {
      id: 2,
      title: '맥북 프로 14인치 M3',
      price: 2500000,
      imageUrl: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    },
    {
      id: 3,
      title: '에어팟 프로 2세대',
      price: 350000,
      imageUrl: null,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    },
    {
      id: 4,
      title: '갤럭시 S24 울트라 512GB',
      price: 1400000,
      imageUrl: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    },
    {
      id: 5,
      title: '아이패드 프로 12.9인치',
      price: 1200000,
      imageUrl: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    },
    {
      id: 6,
      title: '닌텐도 스위치 OLED',
      price: 450000,
      imageUrl: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          최근 등록된 상품
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.imageUrl}
              createdAt={product.createdAt}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
