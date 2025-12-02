"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const fetchUserAndProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;

            if (currentUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('nickname')
                    .eq('id', currentUser.id)
                    .single();

                setUser({ ...currentUser, nickname: profile?.nickname });
            } else {
                setUser(null);
            }
        };

        fetchUserAndProfile();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            if (currentUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('nickname')
                    .eq('id', currentUser.id)
                    .single();
                setUser({ ...currentUser, nickname: profile?.nickname });
            } else {
                setUser(null);
            }

            if (_event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    // Prevent hydration mismatch by rendering nothing until mounted
    if (!mounted) {
        return (
            <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/"
                            className="flex items-center text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                        >
                            <span className="text-2xl mr-2">🍠</span>
                            <span className="hidden sm:inline">고구마마켓</span>
                            <span className="sm:hidden">고구마</span>
                        </Link>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* 로고 */}
                    <Link
                        href="/"
                        className="flex items-center text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                    >
                        <span className="text-2xl mr-2">🍠</span>
                        <span className="hidden sm:inline">고구마마켓</span>
                        <span className="sm:hidden">고구마</span>
                    </Link>

                    {/* 로그인/회원가입 버튼 또는 사용자 정보 */}
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-700 hidden md:inline">
                                    <span className="font-semibold">{user.nickname || user.email?.split('@')[0]}</span>님, 안녕하세요?
                                </span>
                                <Link
                                    href="/products/upload"
                                    className="px-3 py-2 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                                >
                                    상품등록
                                </Link>
                                <Link
                                    href="/profile"
                                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    마이페이지
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-orange-600 transition-colors font-medium"
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header >
    );
}
