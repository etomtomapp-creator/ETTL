# ETTL Investment — Ultra-Premium 3D Investor Experience & Platform

A cinematic, interactive 3D web experience and vehicle rental investment platform for ETTL Investment, combining a photorealistic office walkthrough intro with an executive luxury showroom, interactive financial ROI simulator, business model breakdown, and investor concierge.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design decisions incorporate your confirmed preferences:

- **Confirmed Decision 1 (Fleet Focus)**: The 3D showroom and hero scene will prominently spotlight the **Executive & Luxury Fleet** (Executive Sedans, Grand Tourer SUVs, and Premium Electric Vehicles) with custom metallic paint shaders, real-time rim lighting, and glass reflections.
- **Confirmed Decision 2 (Cinematic Intro Sound & Voice)**: The opening sequence will feature a **cinematic ambient soundscape**, subtle Web Audio spatial UI cues, and high-contrast, elegant subtitle dialogue cards with character body language and camera tracking. A global audio mute/unmute control is accessible at all times.
- **Confirmed Decision 3 (Investor Financial Modeling)**: Prospective investors will have access to an **interactive ROI & Cash Flow Calculator** equipped with capital sliders ($25k to $1M+), vehicle allocation breakdown, projected annualized returns (18.4%–24.2%), and monthly revenue-share dividend forecasts.
- **Open Decision / Default (Intro Skip)**: A clearly visible, responsive **"Skip Intro"** button with a smooth cinematic fade will remain pinned on screen from frame 0 so returning visitors or impatient investors can immediately access the core investment data.

---

## 1. Overview & Core Concept

- **What It Does**: ETTL Investment delivers a dual-stage digital experience:
  1. *Act I — Cinematic Intro*: An interactive 3D narrative where the user ("You") approaches a dusk-lit modern glass headquarters, enters the ETTL Investment Zone, converses with the receptionist, makes an exploratory decision ("See Prices" vs. "See Details"), walks to the Managing Partner's office, and transitions into the executive portal.
  2. *Act II — High-Yield Investor Platform*: A smooth-scrolling, high-performance 3D showroom displaying vehicle fleet assets, real-time ROI calculators, asset-backed security assurances, partner logistics networks, and a direct VIP investor meeting booking concierge.
- **Target Audience / Persona**: High-net-worth individuals (HNWIs), angel syndicates, private equity partners, and family offices seeking asset-backed mobility investments with predictable cash yields.
- **Key Value**: Bridges emotional trust and institutional credibility through cinematic storytelling and clear, transparent financial modeling.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Arrival & Cinematic Intro (Walkthrough)**:
   - **Exterior Dusk**: Camera tracks behind the user character approaching the glass-facade ETTL headquarters under dusk lighting with reflections.
   - **Lobby Entry & Reception**: Automatic sliding glass doors open; character steps into the marble and frosted-glass reception hall.
   - **Dialogue Turn 1**: Receptionist turns toward the client with natural gesture: *"Sir, how may I help you?"*. Subtitle and audio tone play. Client responds: *"I want to know more about the ETTL Investment."*
   - **Interactive Gate 1**: Two glowing 3D glass buttons appear in space: `[See Prices]` & `[See Details]`. User selects an option with hover state and click confirmation sound.
   - **Corridor Walk to Executive Office**: Receptionist escorts the client down an architectural corridor into the Director's Office.
   - **Dialogue Turn 2 & Final Launch**: Manager greets the client, summarizes the investment premise, and asks: *"Would you like to explore the full project details now?"*. Clicking `[Explore Full Project Details]` triggers a cinematic camera zoom-through that seamlessly reveals the main platform.
   - *Instant Skip*: An elegant `Skip Intro` button is present from millisecond 0 for immediate access.

2. **Main Platform Navigation & 3D Scrolling**:
   - **Top Navigation Bar**: Adheres strictly to the Top Bar Contract with single-line ETTL wordmark, 5 clean unboxed text links (`Fleet Showroom`, `Investment Model`, `ROI Calculator`, `How It Works`, `Contact`), and 1 primary CTA `[Request Investor Prospectus]`.
   - **Hero Section**: Full-bleed 3D viewport featuring the flagship luxury fleet with orbit controls, interactive paint finish switchers, and investor metrics.
   - **Investment Model & ROI Simulator**: Dynamic capital investment slider ($25,000 to $1,000,000) computing fleet allocation, vehicle utilization (projected 88.5%), gross annual yield, quarterly distributions, and capital preservation collateral.
   - **Fleet Operations & How It Works**: 4-stage lifecycle (Fleet Procurement -> Luxury Corporate Leasing -> Telematics & Maintenance -> Investor Dividend Payouts).
   - **Trust & Partners**: Corporate fleet logistics partners, tier-1 insurance underwriters, and telematics providers.
   - **Concierge Booking & Term Ingestion**: Lead capture with meeting scheduler, prospectus download modal, and direct contact.

### Visual Identity & Theme

- **Aesthetic Direction**: Ultra-luxury architectural minimalism. Dark obsidian (`#070A11`), rich titanium gray (`#0F172A`), warm brushed champagne gold (`#D4AF37` / `#E5C07B`), and frosted optical glass.
- **Typography & Hierarchy**:
  - *Display / Headlines*: `Outfit` / `Plus Jakarta Sans` with tight tracking (`tracking-tight`) and balanced measure.
  - *Body Prose*: `Plus Jakarta Sans` (400/500 weight) with generous 1.6 line height.
  - *Data & Telemetry*: `JetBrains Mono` / `Space Mono` with `tabular-nums` for all financial figures, percentages, and fleet metrics.
- **Zero-Pill & Metadata Discipline**: Unboxed metadata separated by quiet mid-dots (`·`); no static pill badge capsules or decorative pulsing dots.
- **Lighting & Materials**: Physically-based rendering (PBR) using Three.js `MeshPhysicalMaterial` with clearcoat, realistic metalness, and calibrated warm key / cool rim lighting.

---

## 3. Key Product Decisions & Trade-Offs

- **Engine Architecture: Three.js Modular Engine with React Integration**:
  - *Chosen Approach*: Direct Three.js WebGL canvas pipeline encapsulated in responsive React hooks and components.
  - *Why*: Provides zero-friction React 19 compatibility, direct control over animation frame budgets, custom camera interpolation paths for the cinematic intro, and 60fps performance without library version conflicts.
  - *Alternatives Considered*: Heavy external GLTF files that take 15+ seconds to download were rejected in favor of high-fidelity procedural + optimized geometry meshes with PBR materials, ensuring instant sub-2 second load times on any network.
- **Audio Experience: Dual-Mode Web Audio Synthesizer & Ambient Layer**:
  - *Chosen Approach*: Clean Web Audio API sound generator creating warm low-frequency cinematic drones, footsteps, glass chime micro-interactions, and spatial dialog prompts without requiring external MP3 bandwidth or broken assets.
  - *Why*: 100% reliable, zero network latency, zero broken audio links, and instant muting.
- **Intro State Continuity & Skip Architecture**:
  - *Chosen Approach*: Intro state stored in session state with a smooth CSS/Canvas transition matrix. Skip button instantly fast-forwards camera and triggers main platform reveal.
  - *Why*: Respects repeat visits and provides instant access for impatient investors while rewarding curious users with the full cinematic experience.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ETTL Web Application                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │  Cinematic Controller │             │   Main Experience Store    │  │
│  │  - Scene Phase (0->5) │             │   - Active View / Section  │  │
│  │  - Camera Keyframes   │             │   - Investment Model State │  │
│  │  - Subtitle Narrative │             │   - Fleet Inspection Mode  │  │
│  │  - Audio Engine (SFX) │             │   - Prospectus Modal State │  │
│  └───────────┬───────────┘             └─────────────┬──────────────┘  │
│              │                                       │                 │
│              ▼                                       ▼                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  Three.js 3D WebGL Canvas Engine                 │  │
│  │  - Phase A: Dusk Exterior -> Office Lobby -> Director Suite      │  │
│  │  - Phase B: Luxury Vehicle Showroom (Sedan, SUV, Electric GT)    │  │
│  │  - Procedural PBR Shaders (Clearcoat, Metallic Paint, Glass)     │  │
│  │  - Ambient Lighting (Key/Fill/Rim Studio Rig + Soft Shadows)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                      │                                 │
│                                      ▼                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       DOM Overlay UI Layers                      │  │
│  │  ┌───────────────────────┐       ┌────────────────────────────┐  │  │
│  │  │ Top Navigation Header │       │ Interactive Subtitle HUD   │  │  │
│  │  │ (3-Zone Contract)     │       │ (Dialogue & Choices)       │  │  │
│  │  ├───────────────────────┤       ├────────────────────────────┤  │  │
│  │  │ ROI & Yield Simulator │       │ Fleet Spec Inspector       │  │  │
│  │  │ ($25k-$1M Sliders)    │       │ (360 Orbit & Color Finishes)│  │  │
│  │  ├───────────────────────┤       ├────────────────────────────┤  │  │
│  │  │ How It Works Journey  │       │ Investor Concierge Booking │  │  │
│  │  │ (4-Stage Lifecycle)   │       │ & Term Prospectus Modal    │  │  │
│  │  └───────────────────────┘       └────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Interactive Components & State Handlers

- `CinematicIntro`: Manages sequence timing, walking animations, camera path splines, receptionist greeting, user choice buttons (`See Prices` / `See Details`), walk into manager office, and zoom transition into the website.
- `Showroom3D`: Interactive 3D vehicle stage with customizable finishes (Obsidian Black, Monaco Silver, Royal Sapphire, Champagne Gold), camera orbit/dolly controls, and vehicle hotspot annotations.
- `RoiCalculator`: Dynamic calculation engine for capital investment, fleet allocation ratio, projected annual return (19.8% avg), monthly cash dividend, and 3-year cumulative returns.
- `LeadCaptureModal`: Validates investor inquiry data (Name, Email, Investment Range, Vehicle Category Interest) and simulates immediate prospectus delivery with booking confirmation.
- `AudioEngine`: Web Audio synthesis for cinematic background resonance, subtle dialog blips, and UI feedback with instant master mute toggle.

---

## 5. Verification Plan

- Verify complete build via `compile_applet`.
- Verify smooth 60fps WebGL rendering across intro scenes and showroom canvas.
- Ensure all interactive buttons (Skip Intro, See Prices, See Details, Explore Project, ROI sliders, Color swatches, Prospectus booking) have complete, working event handlers.
- Test responsive viewports on desktop (1440px) and mobile.
