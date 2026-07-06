"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Chat", icon: "💬" },
  { href: "/dashboard/brokers", label: "Brokers", icon: "📋" },
  { href: "/dashboard/templates", label: "Templates", icon: "📄" },
  { href: "/dashboard/team", label: "Team", icon: "👥" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      // Get company
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setCompany(companyData);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-[rgb(30,35,60)] bg-[rgb(10,12,26)]">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-[rgb(30,35,60)] px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
              D
            </div>
            <span className="font-semibold text-white">DispatchAI</span>
          </Link>
        </div>

        {/* Plan badge */}
        <div className="border-b border-[rgb(30,35,60)] px-4 py-3">
          <div className="rounded-lg bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 text-xs font-medium text-brand-400 inline-block">
            {company?.plan ?? "Starter"} plan
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-[rgb(25,28,50)] hover:text-white transition-all"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-[rgb(30,35,60)] p-4">
          <div className="mb-3">
            <div className="text-sm font-medium text-white truncate">{user?.email}</div>
            <div className="text-xs text-gray-500 truncate">{company?.name}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg border border-[rgb(30,35,60)] px-3 py-2 text-xs text-gray-400 hover:border-red-500/30 hover:text-red-400 transition-all"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
