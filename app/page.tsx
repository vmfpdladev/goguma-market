'use client';

import ProductCard from './components/ProductCard';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
  category: string;
}

const categories = [
  '전체',
  '디지털기기',
  '생활가전',
  '가구/인테리어',
  '생활/주방',
  '스포츠/레저',
  '게임/취미',
  '도서/티켓/음반',
];

const sampleProducts: Product[] = [
  {
    id: 1,
    title: '아이폰 15 Pro Max 256GB',
    price: 1500000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    category: '디지털기기',
  },
  {
    id: 2,
    title: '맥북 프로 14인치 M3',
    price: 2500000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: '디지털기기',
  },
  {
    id: 3,
    title: '에어팟 프로 2세대',
    price: 350000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: '디지털기기',
  },
  {
    id: 4,
    title: '갤럭시 S24 울트라 512GB',
    price: 1400000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: '디지털기기',
  },
  {
    id: 5,
    title: '아이패드 프로 12.9인치',
    price: 1200000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: '디지털기기',
  },
  {
    id: 6,
    title: '닌텐도 스위치 OLED',
    price: 450000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: '게임/취미',
  },
  {
    id: 7,
    title: '한샘 원목 식탁 세트',
    price: 380000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: '가구/인테리어',
  },
  {
    id: 8,
    title: '필립스 스팀다리미',
    price: 90000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    category: '생활가전',
  },
  {
    id: 9,
    title: '코베아 캠핑 의자 2p',
    price: 120000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: '스포츠/레저',
  },
  {
    id: 10,
    title: '헬리녹스 캠핑 테이블',
    price: 150000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    category: '스포츠/레저',
  },
  {
    id: 11,
    title: '무선 청소기 LG 코드제로',
    price: 280000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: '생활가전',
  },
  {
    id: 12,
    title: '미니멀 주방 수납장',
    price: 250000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    category: '생활/주방',
  },
  {
    id: 13,
    title: '미니멀리즘 인테리어 도서 세트',
    price: 45000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    category: '도서/티켓/음반',
  },
  {
    id: 14,
    title: '슬림 러닝머신',
    price: 320000,
    imageUrl: null,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    category: '스포츠/레저',
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [visibleCount, setVisibleCount] = useState(6);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const products = useMemo(() => sampleProducts, []);
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        selectedCategory === '전체' || product.category === selectedCategory,
    );
  }, [products, selectedCategory]);
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(6);
  };

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 3);
  }, []);

  const handleToggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const canLoadMore = visibleProducts.length < filteredProducts.length;

  useEffect(() => {
    if (!canLoadMore) {
      return;
    }
    const observerTarget = sentinelRef.current;
    if (!observerTarget) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '100px' },
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, [canLoadMore, handleLoadMore]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            최근 등록된 상품
          </h1>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-500 border-orange-500 text-white shadow'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
        {visibleProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white py-16 text-center text-gray-500">
            선택한 카테고리에 등록된 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                imageUrl={product.imageUrl}
                createdAt={product.createdAt}
                category={product.category}
                isFavorite={favoriteIds.includes(product.id)}
                onToggleFavorite={() => handleToggleFavorite(product.id)}
              />
            ))}
          </div>
        )}
        <div ref={sentinelRef} className="h-1 w-full" />
      </main>
    </div>
  );
}
