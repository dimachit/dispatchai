import Link from "next/link";

const features = [
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Your company's broker rules, contacts, and load history never leave your server. No data training, ever.",
  },
  {
    icon: "🤖",
    title: "Knows Your Brokers",
    desc: "Add TQL, Echo, AXL rules once. AI references them on every question automatically.",
  },
  {
    icon: "📋",
    title: "Rate Confirmation Analysis",
    desc: "Drop a PDF rate con, ask 'is this rate fair?' AI reads it and answers in seconds.",
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    desc: "Shared chat threads, shared knowledge base. One dispatcher shares, everyone benefits.",
  },
  {
    icon: "⚡",
    title: "Fast GPU-Powered AI",
    desc: "Running on dedicated GPU hardware. Not slow ChatGPT API — real-time responses.",
  },
  {
    icon: "🔗",
    title: "Connects to Your Tools",
    desc: "n8n workflows, Slack, Discord — AI becomes part of how your team already works.",
  },
];

const testimonials = [
  {
    quote:
      "I was pasting rate confirmations into ChatGPT every day. Now DispatchAI just knows my brokers and answers instantly.",
    name: "Mike R.",
    role: "Owner-Operator, 4 trucks",
  },
  {
    quote:
      "Our whole dispatch team uses it now. Every load goes through the chat first — check calls, broker rules, POD follow-ups.",
    name: "Sandra L.",
    role: "Dispatcher, 12 carriers",
  },
];

const plans = [
  {
    name: "Starter",
    price: "49",
    seats: "3 seats",
    features: [
      "5 broker rules",
      "10 templates",
      "PDF rate con chat",
      "Chat history",
      "30-day data retention",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Professional",
    price: "149",
    seats: "10 seats",
    features: [
      "Unlimited broker rules",
      "Unlimited templates",
      "PDF rate con + BOL chat",
      "Custom domain",
      "n8n integration",
      "90-day data retention",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "499",
    seats: "Unlimited seats",
    features: [
      "Everything in Pro",
      "Dedicated GPU instance",
      "Fine-tuned model",
      "SSO / SAML",
      "Custom SLA",
      "Unlimited retention",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgb(30,35,60)] bg-[rgb(10,12,26)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
              D
            </div>
            <span className="text-lg font-semibold text-white">DispatchAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <Link
              href="/login"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
        {/* Grid bg */}
        <div
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-100"
          style={{ backgroundSize: "40px 40px" }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/10 blur-[100px]" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Now in early access — 14-day free trial
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
            Your dispatch team's
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
              own AI assistant
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 leading-relaxed">
            Private, team AI that knows your brokers, your rules, and your loads.
            Stop pasting rate confirmations into ChatGPT. Start getting answers that
            actually apply to your business.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white hover:bg-brand-500 transition-all glow-sm"
            >
              Start free — no credit card
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl border border-[rgb(30,35,60)] px-8 py-4 text-base font-medium text-gray-300 hover:border-brand-500/50 hover:text-white transition-all"
            >
              Sign in to dashboard
            </Link>
          </div>
        </div>

        {/* Hero visual — chat mockup */}
        <div className="relative z-10 mt-16 w-full max-w-3xl">
          <div className="rounded-2xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-1 glow">
            <div className="rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[rgb(30,35,60)] px-4 py-3 bg-[rgb(15,18,36)]">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 text-center text-xs text-gray-500">
                  chat.acmetrucking.com
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    A
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-[rgb(25,28,50)] border border-[rgb(30,35,60)] px-4 py-3 text-sm text-gray-200 max-w-lg">
                    What's the detention policy for Echo loads over 2,000 miles?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-400 text-xs font-bold text-brand-900">
                    AI
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-brand-600 border border-brand-500/30 px-4 py-3 text-sm text-white max-w-lg">
                    Based on your Echo Global Logistics rules: Detention is $35/hr after 2
                    free hours, max $150/day. Must be pre-approved and billed with receipt
                    + POD. Note — TQL has a different policy: $35/hr after 2hrs, max
                    $150/day.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos strip */}
      <section className="border-y border-[rgb(30,35,60)] py-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-gray-600">
            Trusted by dispatch teams running
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600 text-sm">
            <span>Echo Global Logistics</span>
            <span>•</span>
            <span>TQL</span>
            <span>•</span>
            <span>AXL Logistics</span>
            <span>•</span>
            <span>Scotlynn</span>
            <span>•</span>
            <span>Freight brokers</span>
            <span>•</span>
            <span>Owner-operators</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Not a chatbot.
              <br />
              <span className="text-gradient">A dispatch expert.</span>
            </h2>
            <p className="mx-auto max-w-xl text-gray-400">
              Built specifically for trucking dispatch teams. Every response is grounded
              in your broker rules and company knowledge.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-6 hover:border-brand-500/30 transition-all"
              >
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[rgb(30,35,60)] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Up and running in minutes</h2>
            <p className="text-gray-400">No IT department required.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your workspace",
                desc: "Sign up, create your company, invite your team. Takes 2 minutes.",
              },
              {
                step: "02",
                title: "Add your broker rules",
                desc: "Paste in your broker contacts, policies, and SOP templates. AI reads them once, remembers forever.",
              },
              {
                step: "03",
                title: "Start asking",
                desc: "Drop rate confirmations, ask load questions, draft broker emails. AI knows your context.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-4 text-6xl font-bold text-brand-600/30">{item.step}</div>
                <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-[rgb(30,35,60)] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">
              Dispatchers already using it
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-[rgb(30,35,60)] bg-[rgb(15,18,36)] p-6"
              >
                <p className="mb-4 text-gray-300 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-[rgb(30,35,60)] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Simple pricing</h2>
            <p className="text-gray-400">
              14-day free trial on all plans. Cancel anytime.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-brand-500/50 bg-gradient-to-b from-brand-950/50 to-[rgb(15,18,36)]"
                    : "border-[rgb(30,35,60)] bg-[rgb(15,18,36)]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="mb-1 text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{plan.seats}</p>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg
                        className="h-4 w-4 shrink-0 text-brand-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-brand-600 text-white hover:bg-brand-500"
                      : "border border-[rgb(30,35,60)] text-gray-300 hover:border-brand-500/50 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[rgb(30,35,60)] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Your competitors are already using AI.
          </h2>
          <p className="mb-10 text-gray-400">
            Don't let your team paste sensitive load data into a public chatbot.
            Get a private AI that knows your business.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white hover:bg-brand-500 transition-all glow-sm"
          >
            Start your free trial
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            14 days free · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgb(30,35,60)] py-8 px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
              D
            </div>
            <span className="font-medium text-gray-400">DispatchAI</span>
          </div>
          <p>© 2026 DispatchAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
