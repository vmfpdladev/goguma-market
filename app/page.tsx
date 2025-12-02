'use client';

import ProductCard from './components/ProductCard';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProductRow {
  id: number;
  title: string | null;
  price: number | null;
  image_url: string | null;
  created_at: string;
  category: string | null;
}

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
  '식품',
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [visibleCount, setVisibleCount] = useState(6);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        selectedCategory === '전체' || product.category === selectedCategory,
    );
  }, [products, selectedCategory]);
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(6);
  };

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 3);
  }, []);

  const handleToggleFavorite = async (id: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const isFavorite = favoriteIds.includes(id);

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) {
        console.error('Error removing favorite:', error);
        return;
      }

      setFavoriteIds((prev) => prev.filter((item) => item !== id));
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: id });

      if (error) {
        console.error('Error adding favorite:', error);
        return;
      }

      setFavoriteIds((prev) => [...prev, id]);
    }
  };

  const canLoadMore = visibleProducts.length < filteredProducts.length;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      // Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id,title,price,image_url,created_at,category')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (productsError) {
        console.error('Failed to fetch products', productsError);
        setProducts([]);
        setErrorMessage('상품을 불러오는 중 문제가 발생했습니다.');
        setIsLoading(false);
        return;
      }

      const normalizedProducts =
        (productsData as ProductRow[] | null)?.map((product) => ({
          id: product.id,
          title: product.title ?? '이름 없는 상품',
          price: product.price ?? 0,
          imageUrl: product.image_url,
          createdAt: product.created_at ?? new Date().toISOString(),
          category: product.category ?? '기타',
        })) ?? [];

      setProducts(normalizedProducts);

      // Fetch Favorites (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id);

        if (!favoritesError && favoritesData) {
          setFavoriteIds(favoritesData.map((f: any) => f.product_id));
        }
      }

      setIsLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

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
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${isActive
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
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-4 aspect-square rounded-md bg-gray-100" />
                <div className="mb-2 h-5 w-20 rounded-full bg-gray-100" />
                <div className="mb-2 h-5 w-full rounded bg-gray-100" />
                <div className="mb-2 h-5 w-2/3 rounded bg-gray-100" />
                <div className="h-4 w-24 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
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
