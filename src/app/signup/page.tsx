"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert({ name: companyName, plan: "starter", seats_used: 1 })
        .select()
        .single();

      if (companyError) {
        setError(companyError.message);
        setLoading(false);
        return;
      }

      // Link user to company
      const { error: userError } = await supabase
        .from("users")
        .insert({ id: data.user!.id, email, company_id: companyData.id, role: "admin" });

      if (userError) {
        setError(userError.message);
        setLoading(false);
        return;
      }
    }

    setDone(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
              D
            </div>
            <span className="text-lg font-semibold text-white">DispatchAI</span>
          </Link>
        </div>

        {!done ? (
          <div className="rounded-2xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-8 glow">
            <h1 className="mb-2 text-2xl font-bold text-white">Create your account</h1>
            <p className="mb-8 text-sm text-gray-400">
              14-day free trial · No credit card required
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Company name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="Acme Trucking LLC"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Work email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="you@yourcompany.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="8+ characters"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-all"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-400 hover:text-brand-300">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="mb-2 text-xl font-bold text-white">Check your email</h2>
            <p className="text-sm text-gray-400">
              We sent a confirmation link to <strong className="text-white">{email}</strong>.
              Click it to activate your account and start your trial.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm text-brand-400 hover:text-brand-300"
            >
              Go to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
