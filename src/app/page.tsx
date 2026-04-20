import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F0F1A] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="flex flex-col gap-6 rounded-3xl border border-[#2D2D4A] bg-[#17172A] p-6 md:p-10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B35]/15 text-2xl">💪🏾</div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#00D4AA]">KagujjeMDM</p>
              <h1 className="text-3xl md:text-5xl font-black">Professional mobile device management</h1>
            </div>
          </div>

          <p className="max-w-3xl text-base md:text-lg text-[#B8B8D1] leading-7">
            Built for technicians in East Africa and worldwide. Sell licenses, manage devices, accept MarzPay phone collections or cards, and run your work from one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-[#FF6B35] px-6 py-3 font-semibold text-white hover:bg-[#E55A2B] transition-colors">Create account</Link>
            <Link href="/download" className="inline-flex items-center justify-center rounded-xl border border-[#2D2D4A] bg-[#232340] px-6 py-3 font-semibold text-white hover:bg-[#2D2D4A] transition-colors">Download desktop app</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["15K+", "Active users"],
            ["98%", "Success rate"],
            ["100K+", "Operations"],
            ["24/7", "Support"],
          ].map(([a, b]) => (
            <div key={b} className="rounded-2xl border border-[#2D2D4A] bg-[#17172A] p-5">
              <div className="text-3xl font-black text-[#00D4AA]">{a}</div>
              <div className="mt-1 text-sm text-[#B8B8D1]">{b}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
