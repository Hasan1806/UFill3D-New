# UFill3D — Make it Real.

Official repository for **UFill3D**, a premier engineering-grade 3D printing filament e-commerce experience.

Designed and developed with cinematic 3D product scroll choreography inspired by modern additive manufacturing leaders, precision laser metrology (±0.02 mm), and a complete Next.js 14 App Router e-commerce architecture.

---

## 🎨 Official Brand Identity

- **Brand:** UFill3D
- **Tagline:** *Make it Real.*
- **Official Palette:**
  - Primary: `#11152E` — Midnight Navy
  - Secondary: `#6258F5` — Electric Periwinkle
  - Tertiary: `#E9E8FF` — Soft Lavender
  - Body Background: `#F8F9FC` — Porcelain White
  - Body Text: `#11152E` — Dark Navy

---

## 🚀 Key Features

- **Flagship 3D Filament Spool:** Interactive Three.js WebGL spool with realistic procedural winding microgrooves, smoked polycarbonate flanges, rim lighting, and smooth axle rotation.
- **Scroll-Synchronized Scrollytelling:** Scroll-driven orientation, dual-axis laser micrometer HUD (±0.02 mm), robotic tangle-free winding metrics, and polymer alchemy transitions.
- **Interactive Colour Studio:** Live 3D color switcher supporting 60+ masterbatch pigment swatches with finish selections (Matte, Silk, Gloss).
- **Comprehensive E-Commerce Suite:**
  - **Full Store Catalog (`/shop`):** Multi-faceted filtering by polymer family, finish, diameter (1.75mm vs 2.85mm), spool weight, and real-time search.
  - **Product Detail Pages (`/product/[slug]`):** Interactive 3D preview, color switcher, print setting matrix (nozzle & bed temps, speed), certified mechanical properties, and verified reviews.
  - **Material Deep-Dives (`/materials` & `/materials/[slug]`):** Technical datasheets for PLA Ultra, PLA+ HyperFlow, PETG Pro, Carbon Fiber Composites, and TPU 95A Elastomers.
  - **Cart & Slide-Out Drawer (`/cart`):** Zustand persistent state with `localStorage`, animated free shipping progress bar, promo code engine (`REAL10`), and multi-currency formatting ($ USD, € EUR, £ GBP).
  - **Multi-Step Checkout (`/checkout`):** Address validation, courier selection, encrypted payment options, B2B Net30 terms, and confetti celebration.
  - **B2B & Print Farms (`/b2b`):** Tiered volume pricing calculator (up to 30% off) and fleet procurement quote generator.
  - **Support & Slicer Profiles (`/contact`):** Downloadable verified presets for Bambu Lab Studio (.3mf), UltiMaker Cura (.curaprofile), PrusaSlicer, and OrcaSlicer.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics:** [Three.js](https://threejs.org/) with custom WebGL prototype guards and procedural bump maps
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with persistence
- **Icons & UI:** [Lucide React](https://lucide.dev/), Canvas Confetti

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Hasan1806/UFill3D.git
cd UFill3D
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License

Proprietary © UFill3D Technologies. All rights reserved.
