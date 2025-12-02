"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PasswordChangePage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (password.length < 6) {
            setStatus("error");
            setMessage("비밀번호는 6자 이상이어야 합니다.");
            return;
        }

        setStatus("submitting");
        setMessage("");

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setStatus("success");
            setMessage("비밀번호가 성공적으로 변경되었습니다.");
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-neutral-900 mb-6 text-center">비밀번호 변경</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">새 비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            placeholder="새 비밀번호 입력"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">비밀번호 확인</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            placeholder="새 비밀번호 확인"
                        />
                    </div>

                    {message && (
                        <p className={`text-sm text-center ${status === "success" ? "text-green-600" : "text-red-500"}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full rounded-xl bg-orange-500 py-3 text-white font-bold transition hover:bg-orange-600 disabled:opacity-60"
                    >
                        {status === "submitting" ? "변경 중..." : "비밀번호 변경"}
                    </button>
                </form>
            </div>
        </div>
    );
}
