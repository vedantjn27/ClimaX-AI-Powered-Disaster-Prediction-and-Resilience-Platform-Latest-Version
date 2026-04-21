# ClimaX — Folder Structure

> A complete annotated map of every file and directory in the ClimaX repository.

---

```
climax/                                          ← Project root
│
├── README.md                                    ← Main project documentation (start here)
├── SETUP_GUIDE.md                               ← Installation & deployment guide
├── FOLDER_STRUCTURE.md                          ← This file
├── FEATURES_AND_IMPACT.md                       ← Deep-dive on features, uniqueness & impact
├── requirements.txt                             ← Consolidated Python dependencies
├── .env.example                                 ← API key template — copy to .env
├── .gitignore                                   ← Files excluded from version control
│
├── backend/                                     ← Python FastAPI backend
│   ├── main.py                                  ← Core application (60+ endpoints, all modules)
│   │                                            ← Contains: FastAPI app, all models, blockchain,
│   │                                            ←   quantum optimizer, RAG, AI chat, weather,
│   │                                            ←   citizen reporting, policy engine, resilience
│   │                                            ←   analyzer, TTS/STT, and all business logic
│   ├── requirements.txt                         ← Backend Python package list
│   └── test.py                                  ← Automated test suite for API endpoints
│
└── frontend/                                    ← Next.js 15 frontend application
    │
    ├── app/                                     ← Next.js App Router directory
    │   ├── layout.tsx                           ← Root layout: fonts, ThemeProvider, metadata
    │   ├── loading.tsx                          ← Global loading/suspense UI component
    │   ├── globals.css                          ← Global styles, CSS variables, animations
    │   │                                        ←   Includes: ClimaX theme tokens, particle
    │   │                                        ←   animations, hero background effects
    │   ├── page.tsx                             ← Main entry: landing page + dashboard
    │   │                                        ←   Contains: system status bar, climate metrics,
    │   │                                        ←   tab navigation, dark mode toggle,
    │   │                                        ←   backend health polling
    │   │
    │   └── components/                          ← Feature-level UI modules
    │       │
    │       ├── weather-widget.tsx               ← Live weather dashboard
    │       │                                    ←   Displays: temperature, humidity, wind speed,
    │       │                                    ←   pressure, AQI, precipitation, weather icons
    │       │                                    ←   APIs: /weather/{city}, /weather/{city}/forecast,
    │       │                                    ←         /weather/{city}/air-quality
    │       │
    │       ├── citizen-reporting.tsx            ← Disaster report submission form
    │       │                                    ←   Features: browser geolocation, disaster type
    │       │                                    ←   selector, severity slider, image URL,
    │       │                                    ←   description text, verification status
    │       │                                    ←   API: POST /citizen-report, GET /citizen-reports
    │       │
    │       ├── voice-chat.tsx                   ← Multilingual AI voice assistant
    │       │                                    ←   Languages: English, Hindi, Kannada, Telugu,
    │       │                                    ←             Tamil, Bengali
    │       │                                    ←   Features: TTS audio playback, STT recording,
    │       │                                    ←   chat history, language selector
    │       │                                    ←   APIs: POST /chat, POST /api/voice-chat,
    │       │                                    ←         POST /api/text-to-speech,
    │       │                                    ←         POST /api/speech-to-text
    │       │
    │       ├── regional-analysis.tsx            ← Regional climate intelligence dashboard
    │       │                                    ←   Features: climate metric charts, trend analysis,
    │       │                                    ←   strategy generation, region comparison,
    │       │                                    ←   full-region reports
    │       │                                    ←   APIs: /region/{region}/data,
    │       │                                    ←         /region/{region}/metrics,
    │       │                                    ←         /region/{region}/trends,
    │       │                                    ←         /region/{region}/strategies,
    │       │                                    ←         /region/{region}/full-analysis
    │       │
    │       ├── emergency-contacts.tsx           ← Emergency directory by language
    │       │                                    ←   Features: multi-language support, disaster
    │       │                                    ←   type filtering, contact cards with icons
    │       │                                    ←   API: GET /emergency-contacts/{language},
    │       │                                    ←        GET /disaster-guide/{disaster_type}
    │       │
    │       ├── blockchain-dashboard.tsx         ← Blockchain ledger viewer and manager
    │       │                                    ←   Features: citizen & org registration,
    │       │                                    ←   alert submission, block explorer, mining,
    │       │                                    ←   tamper detection, chain verification
    │       │                                    ←   APIs: /blockchain/view, /blockchain/mine,
    │       │                                    ←         /blockchain/verify, /blockchain/status,
    │       │                                    ←         /citizen/register, /organization/register,
    │       │                                    ←         /alerts/submit, /alerts/verify
    │       │
    │       ├── blockchain-analytics.tsx         ← Analytics overlay for blockchain data
    │       │                                    ←   Displays: block count charts, transaction
    │       │                                    ←   volume, alert distribution, gov action logs
    │       │
    │       ├── quantum-optimizer.tsx            ← QAOA resource allocation interface
    │       │                                    ←   Features: multi-region setup, resource
    │       │                                    ←   inventory input, demand configuration,
    │       │                                    ←   allocation visualization, efficiency score,
    │       │                                    ←   quantum runtime display
    │       │                                    ←   API: POST /optimize-resources
    │       │
    │       ├── policy-engine.tsx                ← AI policy generation interface
    │       │                                    ←   Features: disaster pattern input by region,
    │       │                                    ←   evidence-based policy drafting, structured
    │       │                                    ←   policy reports with implementation steps
    │       │                                    ←   API: POST /generate-evidence-based-policies
    │       │
    │       └── resilience-analyzer.tsx          ← Location readiness scoring tool
    │                                            ←   Features: any-level location analysis
    │                                            ←   (country/state/district/city/locality/ward),
    │                                            ←   multi-dimension scoring, risk tier,
    │                                            ←   analysis history, recommendations
    │                                            ←   API: POST /analyze
    │
    ├── components/                              ← Shared UI components
    │   ├── theme-provider.tsx                   ← Dark/light mode React context wrapper
    │   └── ui/                                  ← shadcn/ui component library (40+ components)
    │       ├── accordion.tsx                    ← Expandable content sections
    │       ├── alert.tsx                        ← Alert/notification banners
    │       ├── alert-dialog.tsx                 ← Confirmation modal dialogs
    │       ├── avatar.tsx                       ← User/org avatar component
    │       ├── badge.tsx                        ← Status and label badges
    │       ├── button.tsx                       ← Button variants (primary, ghost, outline)
    │       ├── card.tsx                         ← Content card container
    │       ├── chart.tsx                        ← Chart wrapper with theming
    │       ├── checkbox.tsx                     ← Checkbox input
    │       ├── dialog.tsx                       ← Modal dialog
    │       ├── dropdown-menu.tsx                ← Dropdown menu component
    │       ├── form.tsx                         ← React Hook Form integration
    │       ├── input.tsx                        ← Text input field
    │       ├── label.tsx                        ← Form field label
    │       ├── progress.tsx                     ← Progress bar
    │       ├── select.tsx                       ← Select/dropdown component
    │       ├── separator.tsx                    ← Visual divider
    │       ├── sidebar.tsx                      ← Collapsible sidebar layout
    │       ├── skeleton.tsx                     ← Loading skeleton placeholder
    │       ├── slider.tsx                       ← Range slider input
    │       ├── switch.tsx                       ← Toggle switch
    │       ├── table.tsx                        ← Data table component
    │       ├── tabs.tsx                         ← Tab navigation
    │       ├── textarea.tsx                     ← Multi-line text input
    │       ├── toast.tsx                        ← Toast notification system
    │       ├── toaster.tsx                      ← Toast container/renderer
    │       ├── tooltip.tsx                      ← Hover tooltip
    │       ├── calendar.tsx                     ← Date picker calendar
    │       ├── carousel.tsx                     ← Image/content carousel
    │       ├── collapsible.tsx                  ← Collapsible section
    │       ├── command.tsx                      ← Command palette / search
    │       ├── drawer.tsx                       ← Mobile-friendly bottom drawer
    │       ├── hover-card.tsx                   ← Hover preview card
    │       ├── input-otp.tsx                    ← OTP input field
    │       ├── menubar.tsx                      ← Horizontal menu bar
    │       ├── navigation-menu.tsx              ← Navigation menu with dropdowns
    │       ├── pagination.tsx                   ← Page navigation controls
    │       ├── popover.tsx                      ← Floating popover panel
    │       ├── radio-group.tsx                  ← Radio button group
    │       ├── resizable.tsx                    ← Resizable panel layout
    │       ├── scroll-area.tsx                  ← Custom-styled scroll container
    │       ├── sheet.tsx                        ← Slide-in sheet/panel
    │       ├── sonner.tsx                       ← Sonner toast integration
    │       ├── toggle.tsx                       ← Toggle button
    │       ├── toggle-group.tsx                 ← Grouped toggle buttons
    │       ├── use-mobile.tsx                   ← Mobile breakpoint detection hook
    │       └── use-toast.ts                     ← Toast state management hook
    │
    ├── hooks/                                   ← Custom React hooks
    │   ├── use-mobile.tsx                       ← Returns true if viewport < 768px
    │   └── use-toast.ts                         ← Toast notification hook
    │
    ├── lib/                                     ← Utility functions
    │   └── utils.ts                             ← `cn()` — Tailwind class merger utility
    │
    ├── public/                                  ← Static assets served by Next.js
    │   ├── climax-logo.png                      ← Platform logo (used in header & landing)
    │   ├── climate-hero.png                     ← Landing page hero background image
    │   ├── ai-analysis.png                      ← Feature section illustration
    │   ├── nature-green.png                     ← Background texture image
    │   ├── placeholder-logo.png                 ← Default fallback logo
    │   ├── placeholder-logo.svg                 ← SVG fallback logo
    │   └── placeholder-user.jpg                 ← Default user avatar
    │
    ├── package.json                             ← Node.js dependency manifest & scripts
    ├── package-lock.json                        ← Locked dependency tree (npm)
    ├── pnpm-lock.yaml                           ← Locked dependency tree (pnpm)
    ├── next.config.mjs                          ← Next.js configuration (images, rewrites)
    ├── postcss.config.mjs                       ← PostCSS config (Tailwind integration)
    ├── tailwind.config                          ← Tailwind CSS theme & plugin config
    └── components.json                          ← shadcn/ui registry & path configuration
```

---

## Backend Module Map (`backend/main.py`)

The entire backend is contained in `main.py`. Here is a logical breakdown by module:

| Line Range (approx.) | Module | Description |
|---|---|---|
| 1–50 | System setup | UTF-8 config, imports |
| 51–100 | AI client config | Groq/OpenAI client, model selection |
| 101–200 | Data models | Pydantic models (DisasterAlert, WeatherData, etc.) |
| 201–400 | Weather module | OpenWeatherMap integration, AQI, forecast |
| 401–700 | AI/RAG module | LLM chat, RAG retrieval, context building |
| 701–900 | Quantum optimizer | QAOA simulation, resource allocation |
| 901–1100 | Blockchain module | Block class, chain, mining, verification |
| 1101–1400 | Citizen module | Registration, key generation, report submission |
| 1401–1600 | Policy engine | Feedback aggregation, policy generation |
| 1601–1800 | Resilience analyzer | Location scoring, risk assessment |
| 1801–2000 | Regional analysis | Trends, metrics, strategy generation |
| 2001–2200 | TTS/STT module | Voice chat, audio generation, speech recognition |
| 2201–2556 | Core models & utils | Enums, helpers, data classes |
| 2556–4080 | API endpoints | All 60+ `@app.route` definitions |

---

## Key File Quick Reference

| I need to... | File |
|---|---|
| Add a new API endpoint | `backend/main.py` → add `@app.get/post(...)` |
| Add a new frontend page | `frontend/app/[page-name]/page.tsx` |
| Add a new dashboard tab | `frontend/app/page.tsx` → add `<TabsTrigger>` + `<TabsContent>` |
| Add a new UI component | `frontend/components/ui/` → use shadcn/ui generator |
| Change the platform theme colors | `frontend/app/globals.css` → CSS custom properties |
| Add a new language for voice chat | `frontend/app/components/voice-chat.tsx` → `languages` array |
| Add a new disaster type | `backend/main.py` → `DisasterType` enum |
| Add new resilience scoring dimensions | `backend/main.py` → resilience analyzer section |
| Change blockchain mining difficulty | `backend/main.py` → `Block.mine_block()` method |
| Configure CORS allowed origins | `backend/main.py` → `CORSMiddleware` config |
