// app/reset-password/page.tsx
"use client";

import { ResetPasswordForm } from "@/components/shared/modals/auth-modal/forms/reset-password-form";
import React from "react";

const ResetPasswordPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Сброс пароля
        </h1>
        <ResetPasswordForm />
      </div>
    </main>
  );
};

export default ResetPasswordPage;
