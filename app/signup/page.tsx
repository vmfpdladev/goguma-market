"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type FormState = {
  email: string;
  password: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm: FormState = {
  email: "",
  password: "",
};

export default function SignupPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [statusMessage, setStatusMessage] = useState("");

  const isSubmitDisabled = useMemo(() => status === "submitting", [status]);

  const validate = (values: FormState) => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!emailRegex.test(values.email)) {
      nextErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!values.password || values.password.length < 6) {
      nextErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validate(form);

    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        throw error;
      }

      setStatus("success");
      setStatusMessage("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
      setForm(initialForm);
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error.message || "회원가입 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-12">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-10 shadow-xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase text-orange-500">
            Goguma Market
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">회원가입</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Supabase 프로필 정책에 맞춰 정보를 입력해주세요.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>

          <FormField
            label="이메일"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FormField
            label="비밀번호"
            name="password"
            type="password"
            placeholder="최소 6자 이상"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {statusMessage && (
            <p
              className={`text-sm ${status === "success" ? "text-green-600" : "text-red-500"
                }`}
            >
              {statusMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full rounded-xl bg-orange-500 py-3 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "처리 중..." : "회원가입 완료"}
          </button>
        </form>
      </div>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
};

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-neutral-700" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 ${error ? "border-red-400" : "border-neutral-200"
          }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}





