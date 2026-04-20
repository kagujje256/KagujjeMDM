import Link from "next/link";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#0F0F1A] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="rounded-3xl border border-[#2D2D4A] bg-[#17172A] p-6 md:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#00D4AA]">Download</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-black">KagujjeMDM Desktop App</h1>
          <p className="mt-4 max-w-2xl text-[#B8B8D1] leading-7">
            Get the Windows installer for technicians. It includes the KagujjeMDM brand, the license workflow, and the desktop dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a className="inline-flex items-center justify-center rounded-xl bg-[#FF6B35] px-6 py-3 font-semibold text-white hover:bg-[#E55A2B] transition-colors" href="https://github.com/kagujje256/KagujjeMDM-Desktop/releases/tag/v4.4.2.5" target="_blank" rel="noreferrer">Download desktop installer</a>
            <Link className="inline-flex items-center justify-center rounded-xl border border-[#2D2D4A] bg-[#232340] px-6 py-3 font-semibold text-white hover:bg-[#2D2D4A] transition-colors" href="/register">Create account</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
