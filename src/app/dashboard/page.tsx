"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

// In production, use /api/llm proxy. Locally, hit the rig directly.
const LLM_API = process.env.NODE_ENV === "production"
  ? "/api/llm"
  : (process.env.NEXT_PUBLIC_LLM_API_URL ?? "http://192.168.100.44:8080");

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [company, setCompany] = useState<any>(null);
  const [brokerRules, setBrokerRules] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }

      // Load company context
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setCompany(companyData);

      // Load broker rules
      const { data: rulesData } = await supabase
        .from("broker_rules")
        .select("*")
        .eq("company_id", data.user.id);
      setBrokerRules(rulesData ?? []);

      // Load templates
      const { data: templatesData } = await supabase
        .from("templates")
        .select("*")
        .eq("company_id", data.user.id);
      setTemplates(templatesData ?? []);

      // Load chat history
      const { data: sessions } = await supabase
        .from("chat_sessions")
        .select("id, title, created_at")
        .eq("company_id", data.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (sessions && sessions.length > 0) {
        const lastSession = sessions[0];
        const { data: msgs } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", lastSession.id)
          .order("created_at", { ascending: true });
        if (msgs) {
          setMessages(msgs.map((m: any) => ({ id: m.id, role: m.role, content: m.content })));
        }
      }
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const buildSystemPrompt = () => {
    const companyName = company?.name ?? "Your Company";
    const brokerBlock = brokerRules.length
      ? brokerRules
          .map(
            (b) =>
              `• ${b.broker_name}:\n  ${b.rules_text}\n  Contacts: ${b.contacts ?? "none"}`
          )
          .join("\n")
      : "(no broker rules added yet — remind user to add their brokers)";

    const templateBlock = templates.length
      ? templates
          .map((t) => `• [${t.name}]: ${t.content}`)
          .join("\n")
      : "(no templates added yet)";

    return `You are a dispatch assistant for ${companyName}. You help with rate confirmations, load research, broker communication drafts, scheduling, and answering questions about broker relationships. Be specific and reference the broker rules below. Never be generic.

ACTIVE BROKER RULES:
${brokerBlock}

TEMPLATES:
${templateBlock}

Always ground your answers in the broker rules above. If you don't know something, say so.`;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setLoading(true);
    setStreaming("");

    const newMessages = [...messages, { id: Date.now().toString(), role: "user" as const, content: userMsg }];
    setMessages(newMessages);

    try {
      const streamRes = await fetch(`${LLM_API}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // not used, ignored by llama-server
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          stream: true,
        }),
      });

      if (!streamRes.ok) throw new Error("LLM API error");

      const reader = streamRes.body!.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                fullResponse += token;
                setStreaming(fullResponse);
              }
            } catch {}
          }
        }
      }

      const assistantMsg = { id: Date.now().toString(), role: "assistant" as const, content: fullResponse };
      setMessages((prev) => [...prev.filter((m) => m.id !== "tmp"), assistantMsg]);
      setStreaming("");
      setLoading(false);
    } catch (err) {
      setStreaming("");
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: "Sorry, there was an error connecting to the AI. Make sure the GPU server is running." },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-[rgb(30,35,60)] px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-white">Chat</h1>
          <p className="text-xs text-gray-500">
            {brokerRules.length} broker{brokerRules.length !== 1 ? "s" : ""} loaded
          </p>
        </div>
        <button
          onClick={() => {
            setMessages([]);
            setStreaming("");
          }}
          className="rounded-lg border border-[rgb(30,35,60)] px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:border-brand-500/30 transition-all"
        >
          New chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && !streaming && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 text-5xl">🚛</div>
            <h2 className="mb-2 text-xl font-semibold text-white">Ask about your loads</h2>
            <p className="max-w-sm text-sm text-gray-500">
              Drop a rate confirmation, ask about broker policies, draft emails to dispatchers.
              AI uses your broker rules and templates as context.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              {[
                "What's the detention policy for Echo loads?",
                "Draft an email to TQL about a missed appointment",
                "Is this rate fair for a 2800mi reefer load?",
                "Remind me what I need for a Scotlynn pickup",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="rounded-lg border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-3 text-left text-xs text-gray-400 hover:border-brand-500/30 hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div
              className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                msg.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-brand-400 text-brand-900"
              }`}
            >
              {msg.role === "user" ? "U" : "AI"}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-2xl ${
                msg.role === "user"
                  ? "rounded-tl-sm bg-[rgb(25,28,50)] border border-[rgb(30,35,60)] text-gray-200"
                  : "rounded-tl-sm bg-brand-600/20 border border-brand-500/20 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streaming && (
          <div className="flex gap-3">
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-400 text-xs font-bold text-brand-900">
              AI
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-brand-600/20 border border-brand-500/20 px-4 py-3 text-sm text-gray-200 max-w-2xl">
              {streaming}
              <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-brand-400" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[rgb(30,35,60)] px-6 py-4">
        <form onSubmit={sendMessage} className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a load, broker policy, rate confirmation..."
            rows={1}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-30 transition-all"
          >
            {loading ? (
              <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-gray-600">
          AI responses are based on your broker rules and templates — add them in the Broker and Templates tabs.
        </p>
      </div>
    </div>
  );
}
