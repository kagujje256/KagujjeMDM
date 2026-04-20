import Link from "next/link";

export default function ResellerPage() {
  return (
    <div className="min-h-screen hero-pattern">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">💪🏾</span>
              <span className="text-xl font-bold gradient-text">KagujjeMDM</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/login" className="btn btn-secondary text-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            💪🏾 Become a Reseller
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Earn commissions by selling KagujjeMDM credits to technicians in your network
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="card text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-semibold mb-2">Up to 20% Commission</h3>
            <p className="text-text-muted">Earn commission on every credit purchase from your referrals</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-xl font-semibold mb-2">East Africa Focus</h3>
            <p className="text-text-muted">Perfect for technicians in Uganda, Kenya, Tanzania, Rwanda</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Dashboard</h3>
            <p className="text-text-muted">Track your sales, commissions, and referrals in real-time</p>
          </div>
        </div>

        {/* Tiers */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Reseller Tiers</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-surface p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">🥉</div>
              <h3 className="font-semibold text-lg">Bronze</h3>
              <div className="text-3xl font-bold text-primary my-2">10%</div>
              <p className="text-text-muted text-sm">Commission</p>
              <p className="text-xs text-text-muted mt-2">Starter level</p>
            </div>
            <div className="bg-surface p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">🥈</div>
              <h3 className="font-semibold text-lg">Silver</h3>
              <div className="text-3xl font-bold text-primary my-2">12%</div>
              <p className="text-text-muted text-sm">Commission</p>
              <p className="text-xs text-text-muted mt-2">50+ customers</p>
            </div>
            <div className="bg-surface p-6 rounded-lg text-center border border-primary">
              <div className="text-2xl mb-2">🥇</div>
              <h3 className="font-semibold text-lg">Gold</h3>
              <div className="text-3xl font-bold text-accent my-2">15%</div>
              <p className="text-text-muted text-sm">Commission</p>
              <p className="text-xs text-text-muted mt-2">100+ customers</p>
            </div>
            <div className="bg-surface p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="font-semibold text-lg">Platinum</h3>
              <div className="text-3xl font-bold text-primary my-2">20%</div>
              <p className="text-text-muted text-sm">Commission</p>
              <p className="text-xs text-text-muted mt-2">250+ customers</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-1">Register as Reseller</h3>
                <p className="text-text-muted text-sm">Sign up and apply for the reseller program</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-1">Get Your Referral Link</h3>
                <p className="text-text-muted text-sm">Share your unique link with technicians</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-1">Earn Commissions</h3>
                <p className="text-text-muted text-sm">Get paid automatically for every sale</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-text-muted mb-6">Join the KagujjeMDM reseller network today</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register" className="btn btn-primary text-lg px-8">
              Apply Now 💪🏾
            </Link>
            <a href="https://wa.me/256702329901" target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-lg">
              Contact Us
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
