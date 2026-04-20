# 💪🏾 KagujjeMDM

**Professional Mobile Device Management Platform**

Version: 4.4.2.5 | Brand: Kagujje Inc.

---

## 🎯 Overview

KagujjeMDM is a comprehensive mobile device management platform designed for professional technicians. It provides both a **web platform** and **desktop application** for managing, unlocking, and repairing Android devices.

### Key Features

- 📱 **Samsung MDM Removal** - Complete Samsung device management
- 🔓 **FRP Bypass** - Factory Reset Protection removal
- 🛠️ **Multi-Brand Support** - Nokia, Tecno, Infinix, ZTE, Xiaomi
- 📊 **QR Code Scanner** - Fast provisioning and configuration
- ⚡ **ADB Operations** - Direct Android Debug Bridge commands
- 🎯 **Bootloader Management** - Lock/Unlock operations
- 📝 **IMEI Tools** - Read and repair IMEI
- 💾 **Firmware Flashing** - EDL and Fastboot support

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    KagujjeMDM Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │  Desktop    │    │    Web      │    │    API      │ │
│  │  App (.exe) │    │  Platform   │    │  Services   │ │
│  │             │    │  (Next.js)  │    │  (REST)     │ │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│         │                  │                   │        │
│         └──────────────────┼───────────────────┘        │
│                            │                             │
│                    ┌───────▼───────┐                    │
│                    │   Supabase    │                    │
│                    │   (Database)  │                    │
│                    └───────────────┘                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
KagujjeMDM/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth pages (login, register)
│   │   ├── (public)/      # Public pages (landing, pricing)
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # User dashboard
│   │   └── reseller/      # Reseller portal
│   ├── components/        # React components
│   └── lib/              # Utilities & services
├── supabase/
│   └── schema.sql        # Database schema
├── public/               # Static assets
└── vercel.json          # Vercel configuration
```

---

## 🚀 Deployment

### Prerequisites

1. **Supabase Account** - [supabase.com](https://supabase.com)
2. **Vercel Account** - [vercel.com](https://vercel.com)
3. **GitHub Account** - [github.com](https://github.com)
4. **MarzPay Account** - [marzpay.com](https://marzpay.com) (for Uganda payments)
5. **Stripe Account** - [stripe.com](https://stripe.com) (for international payments)

### Step 1: Set Up Supabase

1. Create a new Supabase project
2. Go to SQL Editor
3. Run the schema from `supabase/schema.sql`
4. Copy your project URL and anon key from Settings > API

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel Dashboard, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
MARZPAY_API_KEY=your_marzpay_key
STRIPE_SECRET_KEY=your_stripe_key
```

### Step 4: Configure Custom Domain

1. Go to Vercel Dashboard > Your Project > Settings > Domains
2. Add `mdm.kagujje.com`
3. Add DNS record in your domain registrar:
   ```
   mdm  CNAME  cname.vercel-dns.com
   ```

---

## 💻 Desktop Application

### Build from Source

```bash
# Navigate to desktop app
cd ../KagujjeTool

# Restore dependencies
cd App && dotnet restore

# Build
dotnet build -c Release

# Publish single-file executable
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true

# Output: App/bin/Release/net8.0-windows/win-x64/publish/KagujjeMDM.exe
```

### Download

Download the latest release from [GitHub Releases](https://github.com/kagujje256/KagujjeMDM/releases)

---

## 💳 Payment Integration

### Uganda (Mobile Money & Cards via MarzPay)

- MTN Mobile Money
- Airtel Money
- Visa/Mastercard Cards

### International (Cards via Stripe)

- Visa
- Mastercard
- American Express

---

## 💰 Credit Packages

| Package | Credits | Price (UGX) | Price (USD) |
|---------|---------|-------------|-------------|
| Starter | 50 | 15,000 | $4 |
| Technician | 150 | 40,000 | $11 |
| Professional | 400 | 100,000 | $27 |
| Enterprise | 1,000 | 230,000 | $62 |
| Unlimited | 5,000 | 1,000,000 | $270 |

---

## 🔐 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CSRF protection
- ✅ Rate limiting on API routes
- ✅ Secure webhook verification

---

## 📊 Pricing Strategy

Based on Apizu Tool pricing, reduced by 30%:

| Operation | Credits Used |
|-----------|--------------|
| Samsung MDM Removal | 3 |
| General MDM Removal | 4 |
| FRP Bypass | 3 |
| MI Account Removal | 5 |
| NCK Unlock | 3 |
| Bootloader Unlock | 2 |
| EDL Flash | 5 |
| IMEI Repair | 10 |

---

## 🌍 Target Markets

- **Primary**: East Africa (Uganda, Kenya, Tanzania, Rwanda, Burundi, South Sudan)
- **Secondary**: Worldwide

---

## 📝 License

Copyright 2026 Kagujje Inc. All rights reserved.

This software is proprietary. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🤝 Support

- **Email**: support@kagujje.com
- **Website**: https://kagujje.com
- **Documentation**: https://mdm.kagujje.com/docs

---

## 👨🏾‍💻 Author

**Kagujje Inc.**
- GitHub: [@kagujje256](https://github.com/kagujje256)
- Website: [kagujje.com](https://kagujje.com)

---

💪🏾 **KagujjeMDM - Empowering Technicians Worldwide**
