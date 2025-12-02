import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

interface Product {
    id: number;
    title: string;
    price: number;
    image_url: string;
    category: string;
    description: string;
    created_at: string;
}

interface Profile {
    nickname: string;
    email: string;
}

async function getProduct(id: string) {
    // 1. Fetch Product
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (productError || !product) {
        console.error('Error fetching product:', productError);
        return null;
    }

    // 2. Fetch Profile (if user_id exists)
    let profile: Profile | null = null;
    if (product.user_id) {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('nickname, email')
            .eq('id', product.user_id)
            .single();

        if (!profileError) {
            profile = profileData;
        }
    }

    return { ...product, profiles: profile };
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Format price to KRW
    const formattedPrice = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
    }).format(product.price);

    // Format date (simple relative time or date string)
    const date = new Date(product.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const sellerName = product.profiles?.nickname || product.profiles?.email?.split('@')[0] || '알 수 없음';
    const sellerRegion = '서울시 강남구'; // Region is hardcoded for now as it's not in profile

    // Calculate Charm Temperature
    let charmTemp = 36.5;
    if (product.user_id) {
        // Try RPC first
        const { data: temp, error: rpcError } = await supabase.rpc('get_charm_temperature', { target_user_id: product.user_id });
        if (!rpcError && temp) {
            charmTemp = temp;
        } else {
            // Fallback: Count likes manually
            // 1. Get all products by this user
            const { data: userProducts } = await supabase
                .from('products')
                .select('id')
                .eq('user_id', product.user_id);

            if (userProducts && userProducts.length > 0) {
                const productIds = userProducts.map(p => p.id);
                const { count } = await supabase
                    .from('favorites')
                    .select('id', { count: 'exact', head: true })
                    .in('product_id', productIds);

                if (count !== null) {
                    charmTemp = 36.5 + (count * 0.1);
                }
            }
        }
    }

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Header / Navigation */}
            <div className="fixed top-0 left-0 right-0 z-10 flex items-center h-14 px-4 bg-transparent md:bg-white/80 md:backdrop-blur-md">
                <Link href="/" className="p-2 -ml-2 text-gray-800 hover:bg-black/5 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
            </div>

            {/* Product Image */}
            <div className="relative w-full aspect-square md:aspect-video bg-gray-100">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        이미지 없음
                    </div>
                )}
            </div>

            {/* Seller Info */}
            <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                    <div>
                        <div className="font-semibold text-sm text-gray-900">{sellerName}</div>
                        <div className="text-xs text-gray-500">{sellerRegion}</div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-sm font-bold text-[#ff6f0f]">{charmTemp.toFixed(1)}°C</div>
                    <div className="text-xs text-gray-400">매력온도</div>
                </div>
            </div>

            {/* Product Content */}
            <div className="px-4 py-6">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{product.title}</h1>
                <div className="text-xs text-gray-500 mb-4 flex gap-1">
                    <span>{product.category}</span>
                    <span>·</span>
                    <span>{date}</span>
                </div>

                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                    {product.description}
                </p>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 md:pb-4 flex items-center gap-4 max-w-md mx-auto md:max-w-full">
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900">{formattedPrice}</div>
                    <div className="text-xs text-[#ff6f0f] font-semibold">가격 제안 불가</div>
                </div>
                <button className="bg-[#ff6f0f] hover:bg-[#e5630d] text-white font-bold py-2.5 px-6 rounded-md transition-colors">
                    채팅하기
                </button>
            </div>
        </div>
    );
}
