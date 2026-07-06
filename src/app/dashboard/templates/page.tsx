"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Template {
  id?: string;
  name: string;
  content: string;
  trigger_keywords: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTpl, setNewTpl] = useState<Template>({ name: "", content: "", trigger_keywords: "" });
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      supabase
        .from("templates")
        .select("*")
        .eq("company_id", data.user.id)
        .then(({ data }) => { setTemplates(data ?? []); setLoading(false); });
    });
  }, []);

  const saveTemplate = async (tpl: Template) => {
    if (!tpl.name.trim() || !tpl.content.trim()) return;
    const supabase = createClient();
    await supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      if (tpl.id) {
        await supabase.from("templates").update(tpl).eq("id", tpl.id);
        setTemplates(templates.map((t) => (t.id === tpl.id ? tpl : t)));
      } else {
        const { data: inserted } = await supabase
          .from("templates")
          .insert({ ...tpl, company_id: data.user.id })
          .select()
          .single();
        if (inserted) { setTemplates([...templates, inserted]); setNewTpl({ name: "", content: "", trigger_keywords: "" }); }
      }
    });
  };

  const deleteTemplate = async (id: string) => {
    const supabase = createClient();
    await supabase.from("templates").delete().eq("id", id);
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-[rgb(30,35,60)] px-6 py-4">
        <h1 className="text-lg font-semibold text-white">Templates</h1>
        <p className="text-xs text-gray-500">Email drafts, SOPs, and replies. AI uses these when relevant.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Add new */}
        <div className="rounded-xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-6">
          <h2 className="mb-4 text-sm font-semibold text-white">Add Template</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder='Template name (e.g. "Broker follow-up email")'
              value={newTpl.name}
              onChange={(e) => setNewTpl({ ...newTpl, name: e.target.value })}
              className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-all"
            />
            <input
              type="text"
              placeholder='Trigger keywords — when to use this template (e.g. "follow up, broker email, dispatch email")'
              value={newTpl.trigger_keywords}
              onChange={(e) => setNewTpl({ ...newTpl, trigger_keywords: e.target.value })}
              className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-all"
            />
            <textarea
              placeholder='Template content (e.g. "Hi [Broker Name], this is [Your Name] from [Company]. I am following up on Load #[Load#]. We are en route and expect to arrive by [ETA]. Please confirm receipt of this message." )'
              value={newTpl.content}
              onChange={(e) => setNewTpl({ ...newTpl, content: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none resize-none transition-all"
            />
            <button
              onClick={() => saveTemplate(newTpl)}
              disabled={!newTpl.name.trim()}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-all"
            >
              Add Template
            </button>
          </div>
        </div>

        {/* Existing */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : templates.length === 0 ? (
          <div className="text-center text-gray-600 py-8">No templates yet.</div>
        ) : (
          templates.map((tpl) => (
            <div key={tpl.id} className="rounded-xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">{tpl.name}</h3>
                  {tpl.trigger_keywords && (
                    <p className="text-xs text-gray-500 mt-0.5">Triggers: {tpl.trigger_keywords}</p>
                  )}
                </div>
                <button onClick={() => tpl.id && deleteTemplate(tpl.id)} className="text-xs text-gray-600 hover:text-red-400 transition-colors shrink-0">
                  Delete
                </button>
              </div>
              <textarea
                value={tpl.content}
                onChange={(e) => setTemplates(templates.map((t) => (t.id === tpl.id ? { ...t, content: e.target.value } : t)))}
                rows={4}
                className="mb-3 w-full rounded-lg border border-[rgb(30,35,60)] bg-[rgb(10,12,26)] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none resize-none transition-all"
              />
              <button
                onClick={() => saveTemplate(tpl)}
                className="rounded-lg bg-brand-600/20 border border-brand-500/30 px-4 py-1.5 text-xs font-semibold text-brand-400 hover:bg-brand-600/30 transition-all"
              >
                Save
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
