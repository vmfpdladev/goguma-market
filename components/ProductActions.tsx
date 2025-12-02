'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PaymentModal from './PaymentModal';

interface ProductActionsProps {
    price: number;
    title: string;
    productId: number;
    status: string;
}

export default function ProductActions({ price, title, productId, status }: ProductActionsProps) {
    const router = useRouter();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const isSold = status === 'sold';

    const formattedPrice = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
    }).format(price);

    const handlePurchaseClick = async () => {
        if (isSold) return;

        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }

        setIsPaymentModalOpen(true);
    };

    const handleFavoriteClick = async () => {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }

        // TODO: Implement favorite toggle logic
        alert('찜하기 기능은 준비 중입니다.');
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 md:pb-4 flex items-center gap-4 max-w-md mx-auto md:max-w-full">
                <button
                    onClick={handleFavoriteClick}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900">{formattedPrice}</div>
                    <div className="text-xs text-[#ff6f0f] font-semibold">가격 제안 불가</div>
                </div>
                {!isSold && (
                    <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-md transition-colors mr-2"
                    >
                        채팅하기
                    </button>
                )}
                <button
                    onClick={handlePurchaseClick}
                    disabled={isSold}
                    className={`font-bold py-2.5 px-6 rounded-md transition-colors ${isSold
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#ff6f0f] hover:bg-[#e5630d] text-white'
                        }`}
                >
                    {isSold ? '판매완료' : '구매하기'}
                </button>
            </div>

            {isPaymentModalOpen && !isSold && (
                <PaymentModal
                    price={price}
                    orderName={title}
                    productId={productId}
                    onClose={() => setIsPaymentModalOpen(false)}
                />
            )}
        </>
    );
}
