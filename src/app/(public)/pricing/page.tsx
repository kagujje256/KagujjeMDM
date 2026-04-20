import Link from "next/link";

export default function PricingPage() {
  const packages = [
    { name: "Starter", credits: 50, priceUgx: 37000, priceUsd: 10, popular: false },
    { name: "Basic", credits: 100, priceUgx: 66000, priceUsd: 18, popular: false },
    { name: "Pro", credits: 200, priceUgx: 110000, priceUsd: 30, popular: true },
    { name: "Ultimate", credits: 500, priceUgx: 220000, priceUsd: 60, popular: false },
    { name: "Enterprise", credits: 1000, priceUgx: 370000, priceUsd: 100, popular: false },
  ];

  const operationCosts = [
    { name: "Samsung MDM Removal", credits: 5 },
    { name: "FRP Bypass", credits: 3 },
    { name: "Mi Account Removal", credits: 5 },
    { name: "Network Unlock (NCK)", credits: 3 },
    { name: "Bootloader Unlock", credits: 2 },
    { name: "EDL Flash", credits: 5 },
    { name: "IMEI Repair", credits: 10 },
    { name: "General MDM Removal", credits: 4 },
  ];

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

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-text-muted text-lg">
            💪🏾 <strong>30% cheaper</strong> than competitors • Pay with MTN MoMo, Airtel, or Card
          </p>
        </div>

        {/* Credit Packages */}
        <div className="grid md:grid-cols-5 gap-4 mb-16">
          {packages.map((pkg) => (
            <div 
              key={pkg.name}
              className={`card text-center ${pkg.popular ? 'border-2 border-primary glow-primary' : ''}`}
            >
              {pkg.popular && (
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-3 left-1/2 -translate-x-1/2">
                  POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <div className="text-4xl font-bold text-primary my-3">
                {pkg.credits}
              </div>
              <p className="text-text-muted text-sm mb-4">credits</p>
              <div className="border-t border-border pt-4">
                <div className="text-2xl font-bold">
                  {pkg.priceUgx.toLocaleString()} UGX
                </div>
                <div className="text-text-muted text-sm">
                  ${pkg.priceUsd} USD
                </div>
              </div>
              <Link 
                href="/register" 
                className={`btn ${pkg.popular ? 'btn-primary' : 'btn-secondary'} w-full mt-4`}
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Payment Methods</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-lg text-center">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">MTN Mobile Money</h3>
              <p className="text-text-muted text-sm">USSD prompt • Instant</p>
            </div>
            <div className="bg-surface p-6 rounded-lg text-center">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">Airtel Money</h3>
              <p className="text-text-muted text-sm">USSD prompt • Instant</p>
            </div>
            <div className="bg-surface p-6 rounded-lg text-center">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="font-semibold mb-1">Card (Visa/Mastercard)</h3>
              <p className="text-text-muted text-sm">Secure checkout • Worldwide</p>
            </div>
          </div>
        </div>

        {/* Operation Costs */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Operation Credit Costs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {operationCosts.map((op) => (
              <div key={op.name} className="flex justify-between items-center p-4 bg-surface rounded-lg">
                <span>{op.name}</span>
                <span className="text-accent font-bold">{op.credits} credits</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compare */}
        <div className="mt-12 text-center">
          <p className="text-text-muted mb-4">
            Compare with Apizu Tool: We&apos;re <strong className="text-accent">30% cheaper</strong> with more payment options!
          </p>
          <Link href="/register" className="btn btn-primary text-lg px-8">
            Start Saving Today 💪🏾
          </Link>
        </div>
      </main>
    </div>
  );
}
