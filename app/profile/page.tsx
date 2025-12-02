"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    title: string;
    price: number;
    image_url: string;
    status: string;
    created_at: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<"selling" | "reserved" | "sold" | "favorites">("selling");
    const [loading, setLoading] = useState(true);
    const [charmTemp, setCharmTemp] = useState(36.5);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }

            // Fetch Profile for Nickname
            const { data: profile } = await supabase
                .from('profiles')
                .select('nickname')
                .eq('id', currentUser.id)
                .single();

            setUser({ ...currentUser, nickname: profile?.nickname });

            // Fetch User's Products
            const { data: productsData, error: productsError } = await supabase
                .from("products")
                .select("*")
                .eq("user_id", currentUser.id)
                .order("created_at", { ascending: false });

            if (productsError) {
                console.error("Error fetching products:", productsError);
            } else {
                setProducts(productsData || []);
            }

            // Fetch Favorites
            const { data: favoritesData, error: favoritesError } = await supabase
                .from("favorites")
                .select("product_id, products(*)")
                .eq("user_id", currentUser.id);

            if (favoritesError) {
                console.error("Error fetching favorites:", favoritesError);
            } else {
                // Extract products from favorites join
                const favProducts = favoritesData?.map((f: any) => f.products) || [];
                setFavorites(favProducts);
            }

            // Calculate Charm Temperature (Client-side fallback if RPC fails/not exists)
            // Ideally use RPC: const { data: temp } = await supabase.rpc('get_charm_temperature', { target_user_id: currentUser.id });
            try {
                const { data: temp, error: rpcError } = await supabase.rpc('get_charm_temperature', { target_user_id: currentUser.id });
                if (!rpcError && temp) {
                    setCharmTemp(temp);
                } else {
                    // Fallback: Count likes manually (less efficient but works without RPC for simple cases)
                    // This requires fetching ALL favorites for ALL user's products, which is heavy. 
                    // For now, let's just default to 36.5 if RPC fails, or maybe try a simpler count if possible.
                    // Actually, let's try to fetch the count of favorites for user's products.
                    const { count, error: countError } = await supabase
                        .from('favorites')
                        .select('id', { count: 'exact', head: true })
                        .in('product_id', (productsData || []).map(p => p.id));

                    if (!countError && count !== null) {
                        setCharmTemp(36.5 + (count * 0.1));
                    }
                }
            } catch (e) {
                console.error("Error calculating temp:", e);
            }

            setLoading(false);
        };

        fetchUserData();
    }, [router]);

    const counts = {
        selling: products.filter(p => (p.status || 'selling') === 'selling').length,
        reserved: products.filter(p => p.status === 'reserved').length,
        sold: products.filter(p => p.status === 'sold').length,
        favorites: favorites.length,
    };

    const filteredProducts = activeTab === 'favorites' ? favorites : products.filter((product) => {
        const status = product.status || 'selling';
        return status === activeTab;
    });

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">로딩 중...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Profile Header */}
            <div className="px-4 py-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-gray-900">{user?.nickname || user?.email?.split("@")[0]}</h1>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-sm font-bold text-[#ff6f0f]">{charmTemp.toFixed(1)}°C</div>
                        <div className="text-xs text-gray-400">매력온도</div>
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <Link href="/profile/password" className="text-xs border border-gray-300 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50">
                        비밀번호 변경
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("selling")}
                    className={`flex-1 py-3 text-sm font-medium text-center min-w-[80px] ${activeTab === "selling" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"
                        }`}
                >
                    판매중 ({counts.selling})
                </button>
                <button
                    onClick={() => setActiveTab("reserved")}
                    className={`flex-1 py-3 text-sm font-medium text-center min-w-[80px] ${activeTab === "reserved" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"
                        }`}
                >
                    예약중 ({counts.reserved})
                </button>
                <button
                    onClick={() => setActiveTab("sold")}
                    className={`flex-1 py-3 text-sm font-medium text-center min-w-[80px] ${activeTab === "sold" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"
                        }`}
                >
                    거래완료 ({counts.sold})
                </button>
                <button
                    onClick={() => setActiveTab("favorites")}
                    className={`flex-1 py-3 text-sm font-medium text-center min-w-[80px] ${activeTab === "favorites" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"
                        }`}
                >
                    관심목록 ({counts.favorites})
                </button>
            </div>

            {/* Product List */}
            <div className="pb-20">
                {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 text-sm">
                        {activeTab === 'favorites' ? '찜한 상품이 없습니다.' : '등록된 상품이 없습니다.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <Link href={`/products/${product.id}`} key={product.id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors">
                                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {product.image_url && (
                                        <Image
                                            src={product.image_url}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 truncate">{product.title}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5 text-xs text-gray-400">
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {product.status === 'reserved' && <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">예약중</span>}
                                        {product.status === 'sold' && <span className="text-xs font-bold text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">거래완료</span>}
                                        <span className="font-bold text-gray-900">
                                            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.price)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
