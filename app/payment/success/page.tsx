'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentKey = searchParams.get('paymentKey');
    const productId = searchParams.get('productId');
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle');

    // Debug: Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            const { supabase } = await import('@/lib/supabase');
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Success page - Session check:', session ? 'Logged in' : 'Not logged in');
            console.log('Success page - User:', session?.user?.email);
        };
        checkSession();
    }, []);

    useEffect(() => {
        if (productId && updateStatus === 'idle') {
            updateProductStatus();
        }
    }, [productId, updateStatus]);

    const updateProductStatus = async () => {
        setUpdateStatus('updating');
        console.log('Starting product status update for productId:', productId);

        try {
            const { supabase } = await import('@/lib/supabase');

            // Check current status first
            const { data: currentProduct, error: fetchError } = await supabase
                .from('products')
                .select('status, id, title')
                .eq('id', productId)
                .single();

            if (fetchError) {
                console.error('Error fetching current product:', fetchError);
            } else {
                console.log('Current product before update:', currentProduct);
            }

            // Update the status
            const { data, error } = await supabase
                .from('products')
                .update({ status: 'sold' })
                .eq('id', productId)
                .select();

            if (error) {
                console.error('Error updating product status:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                setUpdateStatus('error');
            } else {
                console.log('Product status updated successfully!');
                console.log('Updated product data:', data);
                setUpdateStatus('success');
            }
        } catch (error) {
            console.error('Caught error:', error);
            setUpdateStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 성공!</h1>
                <p className="text-gray-600 mb-2">주문이 성공적으로 완료되었습니다.</p>
                {updateStatus === 'updating' && (
                    <p className="text-sm text-blue-600 mb-4">상품 상태를 업데이트 중...</p>
                )}
                {updateStatus === 'success' && (
                    <p className="text-sm text-green-600 mb-4">상품이 판매완료 상태로 변경되었습니다.</p>
                )}
                {updateStatus === 'error' && (
                    <p className="text-sm text-red-600 mb-4">상품 상태 업데이트에 실패했습니다.</p>
                )}

                <div className="bg-gray-50 p-4 rounded-md mb-6 text-left text-sm">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">상품 ID</span>
                        <span className="font-medium text-gray-900">{productId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">주문번호</span>
                        <span className="font-medium text-gray-900">{orderId}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">결제금액</span>
                        <span className="font-medium text-gray-900">{Number(amount).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">paymentKey</span>
                        <span className="font-medium text-gray-900 truncate max-w-[150px]">{paymentKey}</span>
                    </div>
                </div>

                <Link
                    href="/"
                    className="block w-full bg-[#ff6f0f] hover:bg-[#e5630d] text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
