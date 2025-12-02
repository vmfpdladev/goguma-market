'use client';

import { useEffect, useRef, useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

interface PaymentModalProps {
    price: number;
    orderName: string;
    productId: number;
    customerName?: string;
    customerEmail?: string;
    onClose: () => void;
}

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // Test Client Key
const customerKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // Using anonymous for now, or generate a UUID for logged in users

export default function PaymentModal({ price, orderName, productId, customerName, customerEmail, onClose }: PaymentModalProps) {
    const paymentWidgetRef = useRef<any>(null);
    const paymentMethodsWidgetRef = useRef<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const tossPayments = await loadTossPayments(clientKey);

                const paymentWidget = tossPayments.widgets({ customerKey });

                await paymentWidget.setAmount({ currency: 'KRW', value: price });

                await Promise.all([
                    paymentWidget.renderPaymentMethods({
                        selector: '#payment-widget',
                        variantKey: 'DEFAULT'
                    }),
                    paymentWidget.renderAgreement({
                        selector: '#agreement',
                        variantKey: 'AGREEMENT'
                    })
                ]);

                paymentWidgetRef.current = paymentWidget;
            } catch (error) {
                console.error('Error loading payment widget:', error);
            }
        })();
    }, [price]);

    const handlePayment = async () => {
        const paymentWidget = paymentWidgetRef.current;

        try {
            await paymentWidget?.requestPayment({
                orderId: Math.random().toString(36).slice(2), // Generate a random order ID
                orderName: orderName,
                customerName: customerName,
                customerEmail: customerEmail,
                successUrl: `${window.location.origin}/payment/success?productId=${productId}`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold mb-4">결제하기</h2>

                <div id="payment-widget" className="w-full" />
                <div id="agreement" className="w-full" />

                <button
                    onClick={handlePayment}
                    className="w-full bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors"
                >
                    {price.toLocaleString()}원 결제하기
                </button>
            </div>
        </div>
    );
}
