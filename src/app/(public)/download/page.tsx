"use client";

import { useState } from "react";
import { Download, Windows, Cpu, HardDrive, Wifi, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E17] via-[#1A1F2E] to-[#0A0E17]">
      {/* Navigation */}
      <nav className="border-b border-[#FF6B35]/20 bg-[#0A0E17]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">💪🏾</span>
              <span className="text-xl font-bold text-[#FF6B35]">KagujjeMDM</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
              <Link href="/download" className="text-[#FF6B35] font-semibold">Download</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link href="/register" className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#E55A2B] transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-[#FF6B35] text-sm font-medium mb-6">
              Version 4.4.2.5 • Beta Release
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Download <span className="text-[#FF6B35]">KagujjeMDM</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional mobile device management tool for technicians. 
              Available for Windows 10/11 (64-bit).
            </p>
          </div>

          {/* Download Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[#1A1F2E] to-[#13161F] rounded-2xl border border-[#FF6B35]/20 p-8 sm:p-12">
              {/* Windows Badge */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-3 bg-[#00A8FF]/10 border border-[#00A8FF]/30 rounded-full px-6 py-2">
                  <Windows className="w-6 h-6 text-[#00A8FF]" />
                  <span className="text-[#00A8FF] font-medium">Windows 10/11 (64-bit)</span>
                </div>
              </div>

              {/* File Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0A0E17] rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <Cpu className="w-5 h-5 text-[#00D4A8]" />
                    <span className="text-gray-400 text-sm">Architecture</span>
                  </div>
                  <p className="text-white font-semibold">x64 (64-bit)</p>
                </div>
                <div className="bg-[#0A0E17] rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <HardDrive className="w-5 h-5 text-[#00D4A8]" />
                    <span className="text-gray-400 text-sm">File Size</span>
                  </div>
                  <p className="text-white font-semibold">~70 MB</p>
                </div>
              </div>

              {/* Download Button */}
              <a
                href="https://github.com/kagujje256/KagujjeMDM/releases/download/v4.4.2.5/KagujjeMDM-v4.4.2.5-Portable.zip"
                className="w-full flex items-center justify-center space-x-3 bg-[#FF6B35] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#E55A2B] transition transform hover:scale-[1.02] shadow-lg shadow-[#FF6B35]/25"
              >
                <Download className="w-6 h-6" />
                <span>Download KagujjeMDM.exe</span>
              </a>

              {/* Alternative Download */}
              <p className="text-center text-gray-500 text-sm mt-4">
                Also available as{' '}
                <a
                  href="https://github.com/kagujje256/KagujjeMDM/releases"
                  className="text-[#FF6B35] hover:underline"
                >
                  portable ZIP
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0A0E17]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What's Included
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Samsung MDM", desc: "Remove MDM locks" },
              { title: "FRP Bypass", desc: "Google account bypass" },
              { title: "Multi-Brand", desc: "Nokia, Tecno, Infinix" },
              { title: "ADB Tools", desc: "Direct shell commands" },
            ].map((feature, i) => (
              <div key={i} className="bg-[#1A1F2E] rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-[#00D4A8]" />
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            System Requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1A1F2E] rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-[#00D4A8]" />
                Minimum
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Windows 10 (64-bit)</li>
                <li>• 4 GB RAM</li>
                <li>• 100 MB free disk space</li>
                <li>• USB 2.0 port</li>
              </ul>
            </div>
            <div className="bg-[#1A1F2E] rounded-xl p-6 border border-[#FF6B35]/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-[#FF6B35]" />
                Recommended
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Windows 11 (64-bit)</li>
                <li>• 8 GB RAM</li>
                <li>• USB 3.0 port</li>
                <li>• Stable internet connection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#FF6B35]/10 to-[#00D4A8]/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-400 mb-8">
            Get notified about new releases and feature updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#0A0E17] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
            />
            <button className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#E55A2B] transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">💪🏾</span>
              <span className="font-bold text-[#FF6B35]">KagujjeMDM</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 Kagujje Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
