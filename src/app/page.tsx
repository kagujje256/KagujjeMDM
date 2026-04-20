import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen hero-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">💪🏾</span>
              <span className="text-xl font-bold gradient-text">KagujjeMDM</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-text-muted hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-text-muted hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#support" className="text-text-muted hover:text-primary transition-colors">
                Support
              </Link>
              <Link href="/download" className="text-text-muted hover:text-primary transition-colors">
                Download
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-surface rounded-full px-4 py-2 mb-8 animate-fadeIn">
            <span className="text-accent">●</span>
            <span className="text-sm text-text-muted">Now Available: Desktop App v4.4.2</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <span className="text-6xl md:text-8xl">💪🏾</span>
            <br />
            <span className="gradient-text">KagujjeMDM</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            Professional Mobile Device Management solutions for technicians.
            <span className="text-primary font-semibold"> 30% cheaper</span> than competitors.
            Built for <span className="text-accent font-semibold">East Africa</span> and the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: "0.3s" }}>
            <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
              💪🏾 Start Free Trial
            </Link>
            <Link href="/download" className="btn btn-secondary text-lg px-8 py-4">
              ⬇️ Download Desktop App
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-4xl font-bold text-primary">15K+</div>
              <div className="text-text-muted">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">98%</div>
              <div className="text-text-muted">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">100K+</div>
              <div className="text-text-muted">Operations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">24/7</div>
              <div className="text-text-muted">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powerful Features 💪🏾
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-2xl mx-auto">
            Everything you need to manage and unlock mobile devices in one professional suite.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature cards */}
            {[
              { icon: "📱", title: "Samsung MDM Removal", desc: "Remove Samsung MDM lock and regain full device access with advanced bypass techniques." },
              { icon: "🔓", title: "FRP Bypass", desc: "Factory Reset Protection removal for Android devices. Works on all major brands." },
              { icon: "⚡", title: "ZTE MDM/Admin", desc: "Remove ZTE MDM and admin locks quickly with one powerful tool." },
              { icon: "🛠️", title: "Multi-Brand Support", desc: "Nokia, Tecno, Infinix, Xiaomi, Oppo, Vivo, Realme and more brands supported." },
              { icon: "💫", title: "Mi Account Removal", desc: "Unlock or remove Mi Account on Xiaomi phones safely and easily." },
              { icon: "🎯", title: "Network Unlock (NCK)", desc: "Calculate network unlock codes for Samsung, ZTE, and other devices." },
            ].map((feature, i) => (
              <div key={i} className="card hover:scale-105 transition-transform cursor-pointer">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple, Affordable Pricing 💪🏾
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-2xl mx-auto">
            30% cheaper than competitors. Pay with MTN/Airtel Mobile Money (Uganda) or Cards (Worldwide).
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-1">$10.50</div>
              <div className="text-text-muted text-sm mb-4">≈ 40,000 UGX</div>
              <div className="text-2xl text-accent font-bold mb-4">25 Credits</div>
              <ul className="space-y-2 mb-6 text-sm text-text-muted">
                <li>✓ Samsung MDM Removal</li>
                <li>✓ FRP Bypass (12 ops)</li>
                <li>✓ Device Info (Free)</li>
              </ul>
              <Link href="/register?package=starter" className="btn btn-secondary w-full">
                Get Started
              </Link>
            </div>

            {/* Professional - Popular */}
            <div className="card card-highlight">
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <div className="text-4xl font-bold mb-1">$17.50</div>
              <div className="text-text-muted text-sm mb-4">≈ 65,000 UGX</div>
              <div className="text-2xl text-accent font-bold mb-4">50 Credits</div>
              <ul className="space-y-2 mb-6 text-sm text-text-muted">
                <li>✓ Samsung MDM (25 ops)</li>
                <li>✓ FRP Bypass (25 ops)</li>
                <li>✓ Mi Account (16 ops)</li>
                <li>✓ Network Unlock (16 ops)</li>
              </ul>
              <Link href="/register?package=professional" className="btn btn-primary w-full">
                Most Popular
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-1">$28.00</div>
              <div className="text-text-muted text-sm mb-4">≈ 105,000 UGX</div>
              <div className="text-2xl text-accent font-bold mb-4">100 Credits</div>
              <ul className="space-y-2 mb-6 text-sm text-text-muted">
                <li>✓ All operations</li>
                <li>✓ Priority support</li>
                <li>✓ Early access features</li>
              </ul>
              <Link href="/register?package=enterprise" className="btn btn-secondary w-full">
                Get Started
              </Link>
            </div>

            {/* Unlimited */}
            <div className="card bg-gradient-to-br from-primary/20 to-accent/20">
              <h3 className="text-xl font-semibold mb-2">Unlimited</h3>
              <div className="text-4xl font-bold mb-1">$35/mo</div>
              <div className="text-text-muted text-sm mb-4">≈ 130,000 UGX/mo</div>
              <div className="text-2xl text-accent font-bold mb-4">∞ Credits</div>
              <ul className="space-y-2 mb-6 text-sm text-text-muted">
                <li>✓ Unlimited operations</li>
                <li>✓ 24/7 VIP support</li>
                <li>✓ All future updates</li>
                <li>✓ Reseller discounts</li>
              </ul>
              <Link href="/register?package=unlimited" className="btn btn-accent w-full">
                Subscribe
              </Link>
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <div className="bg-surface px-4 py-2 rounded-lg flex items-center gap-2">
              <span>📱</span>
              <span className="text-sm">MTN Mobile Money</span>
            </div>
            <div className="bg-surface px-4 py-2 rounded-lg flex items-center gap-2">
              <span>📱</span>
              <span className="text-sm">Airtel Money</span>
            </div>
            <div className="bg-surface px-4 py-2 rounded-lg flex items-center gap-2">
              <span>💳</span>
              <span className="text-sm">Credit/Debit Cards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Devices */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Supported Brands 🌍
          </h2>
          <p className="text-text-muted text-center mb-12">
            We support all major Android brands with MDM, FRP, and unlock solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {["Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "Tecno", "Infinix", "Nokia", "ZTE", "Motorola", "Huawei", "Google Pixel"].map((brand) => (
              <div key={brand} className="bg-surface-light px-6 py-3 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="font-medium">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="support" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Unlock Your Device? 💪🏾
          </h2>
          <p className="text-text-muted mb-8">
            Join 15,000+ technicians who trust KagujjeMDM for professional mobile device solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
              💪🏾 Get Started Now
            </Link>
            <a href="https://wa.me/256702329901" target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-lg px-8 py-4">
              💬 WhatsApp Support
            </a>
          </div>

          {/* Contact info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-text-muted text-sm">Kampala, Uganda</p>
              <p className="text-text-muted text-sm">Serving East Africa & Worldwide</p>
            </div>
            <div className="card">
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-text-muted text-sm">support@kagujje.com</p>
              <p className="text-text-muted text-sm">kaggu@zo.computer</p>
            </div>
            <div className="card">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">WhatsApp</h3>
              <p className="text-text-muted text-sm">+256 702 329 901</p>
              <p className="text-text-muted text-sm">24/7 Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💪🏾</span>
              <span className="font-bold gradient-text">KagujjeMDM</span>
            </div>
            <div className="text-text-muted text-sm">
              © 2026 Kagujje Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="text-text-muted hover:text-primary text-sm">
                Terms
              </Link>
              <Link href="/privacy" className="text-text-muted hover:text-primary text-sm">
                Privacy
              </Link>
              <Link href="/reseller" className="text-text-muted hover:text-primary text-sm">
                Become a Reseller
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
