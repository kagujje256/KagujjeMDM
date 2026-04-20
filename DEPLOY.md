# Deploy KagujjeMDM to Vercel + Supabase

## Prerequisites

1. **Vercel Account** - https://vercel.com
2. **Supabase Project** - https://supabase.com

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name it "kagujjemdm"
4. Set a strong database password
5. Choose a region close to you (recommend: East Africa - `eu-central-1` or South Africa `af-south-1`)
6. Wait for project to be created

## Step 2: Get Supabase Credentials

From Project Settings > API:
- `NEXT_PUBLIC_SUPABASE_URL` = Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = Your service_role key (keep secret!)

## Step 3: Run Database Schema

1. Go to SQL Editor in Supabase Dashboard
2. Copy content from \`supabase/schema.sql\`
3. Click "Run" to create tables

## Step 4: Deploy to Vercel

### Option A: Connect GitHub Repository

1. Go to https://vercel.com/new
2. Import \`kagujje256/KagujjeMDM\` repository
3. Configure:
   - Framework Preset: Next.js
   - Build Command: \`bun run build\`
   - Install Command: \`bun install\`
   - Output Directory: \`.next\`

### Option B: Deploy via CLI

\`\`\`bash
# Login to Vercel
vercel login

# Deploy
cd /home/workspace/KagujjeMDM
vercel --prod
\`\`\`

## Step 5: Configure Environment Variables

In Vercel Dashboard > Settings > Environment Variables, add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_32_char_secret
MARZPAY_API_KEY=marz_ZQWqDW0AyDUhMCWy
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
\`\`\`

## Step 6: Configure Custom Domain (mdm.kagujje.com)

1. In Vercel Dashboard, go to Settings > Domains
2. Add \`mdm.kagujje.com\`
3. In your DNS registrar, add CNAME:
   \`\`\`
   mdm  CNAME  cname.vercel-dns.com
   \`\`\`

## Step 7: Configure Payment Webhooks

### MarzPay Webhook
- URL: \`https://mdm.kagujje.com/api/payments/webhook/marzpay\`
- Configure in MarzPay Dashboard

### Stripe Webhook
- URL: \`https://mdm.kagujje.com/api/payments/webhook/stripe\`
- Configure in Stripe Dashboard
- Copy signing secret to \`STRIPE_WEBHOOK_SECRET\`

---

## Quick Start (After Deployment)

1. Visit \`https://mdm.kagujje.com/register\`
2. Create admin account
3. Login to dashboard
4. Purchase credits
5. Download desktop app
6. Activate license key

---

💪🏾 **Kagujje Inc.**
