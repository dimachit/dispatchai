"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface BrokerRule {
  id?: string;
  broker_name: string;
  rules_text: string;
  contacts: string;
}

export default function BrokersPage() {
  const [rules, setRules] = useState<BrokerRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [newRule, setNewRule] = useState<BrokerRule>({ broker_name: "", rules_text: "", contacts: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUserId(data.user.id);
      supabase
        .from("broker_rules")
        .select("*")
        .eq("company_id", data.user.id)
        .then(({ data }) => {
          setRules(data ?? []);
          setLoading(false);
        });
    });
  }, []);

  const saveRule = async (rule: BrokerRule) => {
    if (!rule.broker_name.trim() || !rule.rules_text.trim()) return;
    setSaving(true);
    const supabase = createClient();
    if (rule.id) {
      await supabase.from("broker_rules").update(rule).eq("id", rule.id);
    } else {
      const { data } = await supabase
        .from("broker_rules")
        .insert({ ...rule, company_id: userId! })
        .select()
        .single();
      setRules([...rules, data]);
      setNewRule({ broker_name: "", rules_text: "", contacts: "" });
      setLoading(false);
      return;
    }
    setRules(rules.map((r) => (r.id === rule.id ? rule : r)));
    setSaving(false);
    setMsg("Saved!");
    setTimeout(() => setMsg(""), 2000);
  };

  const deleteRule = async (id: string) => {
    const supabase = createClient();
    await supabase.from("broker_rules").delete().eq("id", id);
    setRules(rules.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-[rgb(30,35,60)] px-6 py-4">
        <h1 className="text-lg font-semibold text-white">Broker Rules</h1>
        <p className="text-xs text-gray-500">Add your broker contacts and policies. AI reads these on every question.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Add new */}
        <div className="rounded-xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-6">
          <h2 className="mb-4 text-sm font-semibold text-white">Add New Broker</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Broker name (e.g. Echo Global Logistics)"
              value={newRule.broker_name}
              onChange={(e) => setNewRule({ ...newRule, broker_name: e.target.value })}
              className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-all"
            />
            <textarea
              placeholder="Rules & policies (e.g. Detention: $35/hr after 2 free hours, max $150/day. PODs due 48hrs. Email: APTRUCKLOAD@ECHO.COM)"
              value={newRule.rules_text}
              onChange={(e) => setNewRule({ ...newRule, rules_text: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none resize-none transition-all"
            />
            <input
              type="text"
              placeholder="Contacts (e.g. Anna Gioia · (773) 938-9500 · anna.gioia@echo.com)"
              value={newRule.contacts}
              onChange={(e) => setNewRule({ ...newRule, contacts: e.target.value })}
              className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-all"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => saveRule(newRule)}
                disabled={saving || !newRule.broker_name.trim()}
                className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-all"
              >
                {saving ? "Saving..." : "Add Broker"}
              </button>
              {msg && <span className="text-sm text-brand-400">{msg}</span>}
            </div>
          </div>
        </div>

        {/* Existing rules */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : rules.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No brokers added yet. Add your first broker above.
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="rounded-xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h3 className="font-semibold text-white">{rule.broker_name}</h3>
                <button
                  onClick={() => rule.id && deleteRule(rule.id)}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
              <textarea
                value={rule.rules_text}
                onChange={(e) => setRules(rules.map((r) => (r.id === rule.id ? { ...r, rules_text: e.target.value } : r)))}
                rows={4}
                className="mb-3 w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none resize-none transition-all"
              />
              <input
                type="text"
                value={rule.contacts}
                onChange={(e) => setRules(rules.map((r) => (r.id === rule.id ? { ...r, contacts: e.target.value } : r)))}
                placeholder="Contacts"
                className="mb-3 w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-all"
              />
              <button
                onClick={() => saveRule(rule)}
                className="rounded-lg bg-brand-600/20 border border-brand-500/30 px-4 py-1.5 text-xs font-semibold text-brand-400 hover:bg-brand-600/30 transition-all"
              >
                Save changes
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
