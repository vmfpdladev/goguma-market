"use client";

import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormState = {
    email: string;
    password: string;
};

const initialForm: FormState = {
    email: "",
    password: "",
};

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(initialForm);
    const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const isSubmitDisabled = useMemo(() => status === "submitting" || !form.email || !form.password, [status, form]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.replace("/");
            }
        });
    }, [router]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrorMessage("");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });

            if (error) {
                throw error;
            }

            // Successful login
            router.push("/");
            router.refresh(); // Refresh to update auth state in components
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
                <header className="mb-8 text-center">
                    <p className="text-sm font-semibold uppercase text-orange-500">
                        Goguma Market
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-neutral-900">로그인</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        고구마마켓에 오신 것을 환영합니다!
                    </p>
                </header>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-700" htmlFor="email">
                            이메일
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-700" htmlFor="password">
                            비밀번호
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500 text-center">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full rounded-xl bg-orange-500 py-3 text-white font-bold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === "submitting" ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-500">
                    계정이 없으신가요?{" "}
                    <Link href="/signup" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline">
                        회원가입하기
                    </Link>
                </div>
            </div>
        </div>
    );
}
