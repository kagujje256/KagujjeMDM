"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  country: string;
  currency: string;
  role: string;
  reseller_tier: string | null;
}

interface Credits {
  balance: number;
  total_purchased: number;
  total_used: number;
}

interface Operation {
  id: string;
  operation_type: string;
  device_model: string | null;
  status: string;
  credits_used: number;
  created_at: string;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_usd: number;
  price_ugx: number;
  is_popular: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<Credits>({ balance: 0, total_purchased: 0, total_used: 0 });
  const [operations, setOperations] = useState<Operation[]>([]);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("marzpay_mtn");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/auth");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const authData = await res.json();
      setUser(authData.user);

      const creditsRes = await fetch("/api/credits");
      const creditsData = await creditsRes.json();
      if (creditsData.success) {
        setCredits(creditsData.data.credits);
        setOperations(creditsData.data.transactions.filter((t: { type: string }) => t.type === "operation"));
        setPackages(creditsData.data.packages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    // Only require phone for mobile money payments, not card
    if ((paymentMethod === "marzpay_mtn" || paymentMethod === "marzpay_airtel") && !phoneNumber) {
      alert("Please enter your phone number for Mobile Money payment");
      return;
    }

    setPaymentLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "initiate",
          paymentMethod,
          packageId: selectedPackage.id,
          phoneNumber,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.checkoutUrl) {
          // Stripe - redirect to checkout
          window.location.href = data.checkoutUrl;
        } else {
          // MarzPay - show USSD prompt message
          alert(data.message);
          setShowPayment(false);
          // Poll for payment status
          pollPaymentStatus(data.paymentId);
        }
      } else {
        alert(data.error || "Failed to initiate payment");
      }
    } catch (err) {
      alert("Failed to connect. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes

    const poll = async () => {
      if (attempts >= maxAttempts) return;

      try {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "status", paymentId }),
        });

        const data = await res.json();

        if (data.payment?.status === "completed") {
          alert("Payment successful! Your credits have been added.");
          fetchDashboard();
          return;
        }

        if (data.payment?.status === "failed") {
          alert("Payment failed. Please try again.");
          return;
        }

        attempts++;
        setTimeout(poll, 5000);
      } catch (err) {
        console.error(err);
      }
    };

    poll();
  };

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">💪🏾</div>
      </div>
    );
  }

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

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-text-muted">{user?.email}</div>
                <div className="text-xs text-accent">{user?.role === "admin" ? "Admin" : user?.reseller_tier || "User"}</div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "Technician"}! 💪🏾
          </h1>
          <p className="text-text-muted">Manage your credits and operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Credits Balance */}
          <div className="card bg-gradient-to-br from-primary/20 to-transparent">
            <div className="text-text-muted text-sm mb-1">Credits Balance</div>
            <div className="text-4xl font-bold text-primary">{credits.balance}</div>
            <div className="text-text-muted text-sm mt-2">
              Used: {credits.total_used} | Purchased: {credits.total_purchased}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="text-text-muted text-sm mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setShowPayment(true)} className="btn btn-primary text-sm">
                💰 Add Credits
              </button>
              <Link href="/download" className="btn btn-secondary text-sm text-center">
                ⬇️ Download App
              </Link>
            </div>
          </div>

          {/* Download Desktop App */}
          <div className="card">
            <div className="text-text-muted text-sm mb-3">Desktop Application</div>
            <div className="text-2xl mb-2">🖥️</div>
            <Link href="/download" className="btn btn-accent w-full text-sm">
              Download KagujjeMDM.exe
            </Link>
            <p className="text-xs text-text-muted mt-2">Connects to your account for operations</p>
          </div>
        </div>

        {/* Buy Credits Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="card max-w-lg w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">💰 Buy Credits</h2>
                <button onClick={() => setShowPayment(false)} className="text-text-muted hover:text-primary text-2xl">
                  ×
                </button>
              </div>

              {/* Packages */}
              <div className="space-y-3 mb-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPackage?.id === pkg.id
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-surface hover:bg-surface-light"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{pkg.name}</div>
                        {pkg.is_popular && (
                          <span className="badge badge-primary text-xs">POPULAR</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {user?.currency === "UGX" ? `${pkg.price_ugx.toLocaleString()} UGX` : `$${pkg.price_usd}`}
                        </div>
                        <div className="text-accent font-medium">{pkg.credits} credits</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Method */}
              {selectedPackage && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => setPaymentMethod("marzpay_mtn")}
                        className={`p-3 rounded-lg text-sm ${
                          paymentMethod === "marzpay_mtn" ? "bg-primary/20 border border-primary" : "bg-surface"
                        }`}
                      >
                        📱 MTN MoMo
                      </button>
                      <button
                        onClick={() => setPaymentMethod("marzpay_airtel")}
                        className={`p-3 rounded-lg text-sm ${
                          paymentMethod === "marzpay_airtel" ? "bg-primary/20 border border-primary" : "bg-surface"
                        }`}
                      >
                        📱 Airtel Money
                      </button>
                      <button
                        onClick={() => setPaymentMethod("marzpay_card")}
                        className={`p-3 rounded-lg text-sm ${
                          paymentMethod === "marzpay_card" ? "bg-primary/20 border border-primary" : "bg-surface"
                        }`}
                      >
                        💳 Card (MarzPay)
                      </button>
                      <button
                        onClick={() => setPaymentMethod("stripe_card")}
                        className={`p-3 rounded-lg text-sm ${
                          paymentMethod === "stripe_card" ? "bg-primary/20 border border-primary" : "bg-surface"
                        }`}
                      >
                        💳 Card (Intl)
                      </button>
                    </div>
                    <p className="text-xs text-text-muted">
                      {user?.country === "UG" 
                        ? "Mobile Money & Card payments via MarzPay" 
                        : "International card payments available"}
                    </p>
                  </div>

                  {(paymentMethod === "marzpay_mtn" || paymentMethod === "marzpay_airtel") && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="input"
                        placeholder="0702 329 901"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-text-muted mt-1">
                        USSD prompt will be sent to this number
                      </p>
                    </div>
                  )}

                  {(paymentMethod === "marzpay_card" || paymentMethod === "stripe_card") && (
                    <div className="mb-4 text-center p-4 bg-surface rounded-lg">
                      <p className="text-text-muted text-sm">
                        💳 You will be redirected to a secure card checkout page
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handlePurchase}
                    disabled={paymentLoading}
                    className="btn btn-primary w-full"
                  >
                    {paymentLoading ? "Processing..." : `Pay ${user?.currency === "UGX" ? `${selectedPackage.price_ugx.toLocaleString()} UGX` : `$${selectedPackage.price_usd}`}`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Operation History */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📋 Recent Operations</h2>
          
          {operations.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <div className="text-4xl mb-2">💪🏾</div>
              <p>No operations yet. Download the desktop app to start!</p>
              <Link href="/download" className="btn btn-primary mt-4">
                Download App
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-muted text-sm">Operation</th>
                    <th className="text-left py-2 text-text-muted text-sm">Device</th>
                    <th className="text-left py-2 text-text-muted text-sm">Credits</th>
                    <th className="text-left py-2 text-text-muted text-sm">Status</th>
                    <th className="text-left py-2 text-text-muted text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.slice(0, 10).map((op) => (
                    <tr key={op.id} className="border-b border-border/50">
                      <td className="py-3">{op.operation_type}</td>
                      <td className="py-3 text-text-muted">{op.device_model || "-"}</td>
                      <td className="py-3 text-accent">{op.credits_used}</td>
                      <td className="py-3">
                        <span className={`badge ${op.status === "success" ? "badge-accent" : op.status === "failed" ? "badge-error" : "badge-warning"}`}>
                          {op.status}
                        </span>
                      </td>
                      <td className="py-3 text-text-muted text-sm">
                        {new Date(op.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
