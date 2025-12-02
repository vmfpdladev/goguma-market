'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function FailContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const code = searchParams.get('code');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 실패</h1>
                <p className="text-gray-600 mb-6">결제 진행 중 오류가 발생했습니다.</p>

                <div className="bg-gray-50 p-4 rounded-md mb-6 text-left text-sm">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">에러 코드</span>
                        <span className="font-medium text-gray-900">{code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">에러 메시지</span>
                        <span className="font-medium text-gray-900">{message}</span>
                    </div>
                </div>

                <Link
                    href="/"
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FailContent />
        </Suspense>
    );
}
