# KagujjeMDM - Copilot Fix List

## 🚨 CRITICAL FIXES NEEDED

### 1. **CSS Not Loading** (HIGH PRIORITY)
**File:** `src/app/globals.css`
**Issue:** Tailwind CSS v4 classes not applying
**Fix:**
- Ensure Tailwind is properly configured
- Check if `@tailwindcss/vite` plugin is in vite.config
- Verify CSS is imported in layout.tsx

### 2. **Homepage Not Rendering Correctly** (HIGH PRIORITY)
**File:** `src/app/page.tsx`
**Issue:** Page shows raw content, no styling
**Fix:**
- Use standard Tailwind classes: `bg-black`, `text-white`, `p-4`
- Replace custom CSS variables with Tailwind utilities
- Add proper responsive classes: `md:`, `lg:`, `sm:`

### 3. **Account Creation Failing** (HIGH PRIORITY)
**File:** `src/app/register/page.tsx`
**Issue:** Supabase auth may not be configured correctly
**Fix:**
- Check Supabase client initialization
- Verify environment variables are set in Vercel
- Add proper error handling and user feedback

---

## 🖥️ DESKTOP APP FIXES

### 4. **EXE Not Working** (HIGH PRIORITY)
**Repo:** KagujjeMDM-Desktop
**Issue:** App crashes or doesn't detect devices
**Fix:**
- Check ADB path resolution in `Services/AdbService.cs`
- Ensure `Tools/` directory is bundled with EXE
- Add proper error messages when tools are missing

### 5. **ADB/Fastboot Detection**
**Files:** `Services/AdbService.cs`, `Services/FastbootService.cs`
**Fix:**
```csharp
// Check multiple possible paths
var possiblePaths = new[] {
    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Tools", "adb.exe"),
    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources", "adb.exe"),
    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "adb.exe")
};
```

---

## 📋 COPILOT PROMPTS TO USE

### For Web Platform:
```
"Fix the CSS not loading on the homepage. Use standard Tailwind classes.
Replace all custom CSS variables with Tailwind utilities like bg-black, text-white, etc.
Make sure the page looks professional like Apizu Tool's website."
```

### For Desktop App:
```
"Fix the desktop app not detecting ADB tools.
The app should look in Tools/, Resources/, and the app directory.
Add proper error messages if tools are missing.
Make the UI match Apizu Tool's professional dark theme."
```

---

## ✅ REFERENCE: Apizu Tool Website

Visit: https://apizutool.one
- Dark professional theme
- Clear feature cards
- Simple pricing grid
- Working download section

---

## 🔑 ENVIRONMENT VARIABLES NEEDED

```
NEXT_PUBLIC_SUPABASE_URL=https://rajrgfsxzijxdjmwqshd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MARZPAY_API_KEY=marz_ZQWq...
STRIPE_SECRET_KEY=sk_...
```

---

## 📁 PROJECT STRUCTURE

### Web Platform (Vercel):
```
KagujjeMDM/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── login/page.tsx    # Login
│   │   ├── register/page.tsx # Register
│   │   ├── download/page.tsx # Download
│   │   └── globals.css       # Styles
│   └── lib/
│       └── supabase.ts       # Database
└── vercel.json
```

### Desktop App (Windows):
```
KagujjeMDM-Desktop/
├── App/
│   ├── MainWindow.xaml       # Main window
│   ├── Views/                # Pages
│   ├── Services/             # ADB, Fastboot, etc.
│   └── Resources/            # Icons
├── Tools/
│   ├── adb.exe
│   └── fastboot.exe
└── Output/
    └── KagujjeMDM.exe
```

---

*Last updated: 2026-04-21*
*Use this file with GitHub Copilot to fix all issues*
