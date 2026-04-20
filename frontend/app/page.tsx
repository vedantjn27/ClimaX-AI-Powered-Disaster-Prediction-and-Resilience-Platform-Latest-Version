"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Users,
  Shield,
  MessageSquare,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Moon,
} from "lucide-react"
import WeatherWidget from "./components/weather-widget"
import CitizenReporting from "./components/citizen-reporting"
import VoiceChat from "./components/voice-chat"
import RegionalAnalysis from "./components/regional-analysis"
import EmergencyContacts from "./components/emergency-contacts"
import BlockchainDashboard from "./components/blockchain-dashboard"
import BlockchainAnalytics from "./components/blockchain-analytics"
import QuantumOptimizer from "./components/quantum-optimizer"
import PolicyEngine from "./components/policy-engine"
import ResilienceAnalyzer from "./components/resilience-analyzer"

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState({
    ai_agents: "online",
    quantum_optimizer: "ready",
    blockchain: "active",
    rag_system: "loaded",
    weather_service: "connected",
    backend_connected: false,
  })

  const [climateMetrics, setClimateMetrics] = useState({
    temperature: 32,
    aqi: 156,
    rainfall_deficit: 25,
    renewable_percent: 68.5,
  })

  const [darkMode, setDarkMode] = useState(false)
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const isDevelopment = process.env.NODE_ENV === "development"
  const backendUrl = isDevelopment ? "http://localhost:8000" : ""

  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        const response = await fetch(`${backendUrl}/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (response.ok) {
          setSystemStatus((prev) => ({ ...prev, backend_connected: true }))
        } else {
          setSystemStatus((prev) => ({ ...prev, backend_connected: false }))
        }
      } catch {
        setSystemStatus((prev) => ({ ...prev, backend_connected: false }))
      }
    }
    fetchSystemHealth()
    const healthCheckInterval = setInterval(fetchSystemHealth, 30000)
    return () => clearInterval(healthCheckInterval)
  }, [backendUrl])

  /* ══════════════════════════════════════════════════════════
     SCROLLABLE BRANDING / LANDING PAGE
     ══════════════════════════════════════════════════════════ */
  if (showLanding) {
    return (
      <div className="bg-[#0a0f1a] text-white overflow-x-hidden">

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 climax-hero-bg"></div>
          <div className="absolute inset-0" style={{ backgroundImage: "url('/climate-hero.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.22, mixBlendMode: "screen" }}></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="climax-particle climax-particle-1" style={{ fontSize: "2.5rem" }}>🌍</div>
            <div className="climax-particle climax-particle-2" style={{ fontSize: "2rem" }}>🌊</div>
            <div className="climax-particle climax-particle-3" style={{ fontSize: "2.5rem" }}>🔥</div>
            <div className="climax-particle climax-particle-4" style={{ fontSize: "2rem" }}>❄️</div>
            <div className="climax-particle climax-particle-5" style={{ fontSize: "2.5rem" }}>🌿</div>
            <div className="climax-particle climax-particle-6" style={{ fontSize: "2rem" }}>⚡</div>
          </div>
          <div className="relative z-10 px-6 max-w-5xl">
            <div className="mb-8 animate-bounce" style={{ animationDuration: "2.5s" }}>
              <img src="/climax-logo.png" alt="ClimaX Logo" className="w-28 h-28 md:w-36 md:h-36 rounded-3xl shadow-2xl mx-auto" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.35), 0 0 120px rgba(16,185,129,0.15)" }} />
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              Clima<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">X</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light mb-3">Climate Resilience Operating System</p>
            <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto mb-10">
              The world&apos;s first platform that fuses Multi-Agent AI, Quantum Computing, and Blockchain into a single operating system for climate disaster preparedness and response.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { icon: "🤖", label: "Multi-Agent AI" }, { icon: "⚛️", label: "Quantum Optimization" },
                { icon: "🔗", label: "Blockchain Verified" }, { icon: "🌡️", label: "Live Weather" },
                { icon: "📊", label: "Policy Intelligence" }, { icon: "🚨", label: "Disaster Response" },
              ].map((f) => (
                <span key={f.label} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-white bg-white/10 border border-white/20 backdrop-blur-md">{f.icon} {f.label}</span>
              ))}
            </div>
            <div className="animate-bounce mt-2">
              <svg className="w-6 h-6 mx-auto text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <span className="text-xs text-white/30 mt-1 block">Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* ═══ WHY CLIMAX ═══ */}
        <section className="relative py-24 px-6">
          <div className="absolute inset-0" style={{ backgroundImage: "url('/weather-storm.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.06 }}></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold tracking-widest uppercase text-cyan-400">Why ClimaX?</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5">Climate Disasters Don&apos;t Wait.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Neither Should We.</span></h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">Every year, climate disasters cause $300B+ in damages and displace millions. Traditional systems are reactive, siloed, and slow. ClimaX changes everything.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "⚡", title: "Real-time Intelligence", desc: "Live weather data, air quality monitoring, and predictive analytics — processed in milliseconds.", color: "from-blue-500/20 to-blue-600/5" },
                { icon: "🎯", title: "Proactive, Not Reactive", desc: "AI agents continuously analyze threats and generate disaster preparedness policies before disasters strike.", color: "from-emerald-500/20 to-emerald-600/5" },
                { icon: "🔒", title: "Trustworthy & Transparent", desc: "Every alert and policy recommendation is cryptographically signed and blockchain-verified. Zero manipulation.", color: "from-purple-500/20 to-purple-600/5" },
              ].map((item) => (
                <div key={item.title} className={`bg-gradient-to-b ${item.color} border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:-translate-y-1`}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ THREE CORE PILLARS ═══ */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold tracking-widest uppercase text-emerald-400">Core Technology</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3">Three Pillars. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">One Mission.</span></h2>
            </div>

            {/* AI */}
            <div className="flex flex-col lg:flex-row items-center gap-10 mb-20">
              <div className="lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.15)" }}>
                  <img src="/ai-analysis.png" alt="AI Analysis" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="lg:w-1/2">
                <span className="text-xs font-bold tracking-widest uppercase text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">Pillar 1</span>
                <h3 className="text-3xl font-bold mt-4 mb-4">Multi-Agent AI Analysis</h3>
                <p className="text-white/60 mb-4 leading-relaxed">Our multi-agent AI system deploys specialized agents for infrastructure analysis, economic impact assessment, social vulnerability mapping, and environmental risk scoring — all working in parallel to deliver comprehensive resilience assessments in seconds.</p>
                <div className="flex flex-wrap gap-2">
                  {["Resilience Scoring", "Threat Detection", "Policy Generation", "Regional Analysis"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantum */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 mb-20">
              <div className="lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ boxShadow: "0 0 60px rgba(168,85,247,0.15)" }}>
                  <img src="/quantum-computing.png" alt="Quantum Computing" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="lg:w-1/2">
                <span className="text-xs font-bold tracking-widest uppercase text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">Pillar 2</span>
                <h3 className="text-3xl font-bold mt-4 mb-4">Quantum-Optimized Resources</h3>
                <p className="text-white/60 mb-4 leading-relaxed">When disaster strikes, resource allocation is life-or-death. Our quantum optimization engine uses QAOA algorithms to solve complex resource distribution — finding optimal solutions for shelter placement, medical supply routing, and evacuation planning.</p>
                <div className="flex flex-wrap gap-2">
                  {["QAOA Solver", "Resource Allocation", "Evacuation Routing", "Supply Chain"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Blockchain */}
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ boxShadow: "0 0 60px rgba(16,185,129,0.15)" }}>
                  <img src="/nature-green.png" alt="Blockchain Verification" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="lg:w-1/2">
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">Pillar 3</span>
                <h3 className="text-3xl font-bold mt-4 mb-4">Blockchain-Verified Trust</h3>
                <p className="text-white/60 mb-4 leading-relaxed">Every citizen alert, disaster report, and feedback submission is cryptographically signed with ECDSA keys and immutably recorded on our blockchain ledger. Complete data integrity, zero tampering, full public trust.</p>
                <div className="flex flex-wrap gap-2">
                  {["ECDSA Signatures", "Immutable Ledger", "Citizen Reporting", "Data Integrity"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="relative py-24 px-6">
          <div className="absolute inset-0" style={{ backgroundImage: "url('/climate-hero.png')", backgroundSize: "cover", backgroundPosition: "center bottom", opacity: 0.05 }}></div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <span className="text-sm font-semibold tracking-widest uppercase text-cyan-400">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16">From Data to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Decision.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Ingest", desc: "Real-time weather, AQI, and satellite data streams from global APIs.", icon: "🌐" },
                { step: "02", title: "Analyze", desc: "Multi-agent AI processes data across 6 vulnerability categories.", icon: "🧠" },
                { step: "03", title: "Optimize", desc: "Quantum algorithms compute optimal resource allocation and routes.", icon: "⚛️" },
                { step: "04", title: "Act", desc: "Blockchain-verified alerts and policy recommendations deployed instantly.", icon: "🚀" },
              ].map((item, i) => (
                <div key={item.step} className="relative">
                  {i < 3 && <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent"></div>}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <span className="text-xs font-bold text-cyan-400">STEP {item.step}</span>
                    <h4 className="text-lg font-bold mt-2 mb-2">{item.title}</h4>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ IMPACT STATS ═══ */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-900/30 via-emerald-900/20 to-purple-900/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-widest uppercase text-emerald-400">Built for Impact</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3">Platform Capabilities</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "6", label: "AI Analysis Categories", sub: "Infrastructure · Economic · Social · Environmental · Governance · Emergency" },
                { value: "200+", label: "Cities Supported", sub: "Real-time weather and AQI data globally" },
                { value: "<3s", label: "Analysis Speed", sub: "Full resilience assessment in seconds" },
                { value: "100%", label: "Verifiable", sub: "Every data point blockchain-signed" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold mb-1">{stat.label}</div>
                  <div className="text-xs text-white/40">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MODULES GRID ═══ */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold tracking-widest uppercase text-cyan-400">System Modules</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3">Everything You Need. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">One Platform.</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🌤️", title: "Weather Intelligence", desc: "Live temperature, humidity, wind, pressure with auto-location detection.", color: "border-blue-500/30" },
                { icon: "📍", title: "Regional Analysis", desc: "Deep-dive climate analysis — overview, risk assessment, mitigation strategies.", color: "border-emerald-500/30" },
                { icon: "🛡️", title: "Resilience Analyzer", desc: "AI-powered resilience scoring across 6 weighted categories.", color: "border-purple-500/30" },
                { icon: "⛓️", title: "Blockchain Dashboard", desc: "Register identities, submit signed alerts, view immutable history.", color: "border-amber-500/30" },
                { icon: "⚛️", title: "Quantum Optimizer", desc: "QAOA-based resource allocation for optimal disaster response.", color: "border-pink-500/30" },
                { icon: "📜", title: "Policy Engine", desc: "Evidence-based policies from disaster pattern analysis.", color: "border-cyan-500/30" },
              ].map((mod) => (
                <div key={mod.title} className={`bg-white/5 border ${mod.color} rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1`}>
                  <span className="text-3xl">{mod.icon}</span>
                  <h4 className="text-lg font-bold mt-3 mb-2">{mod.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0 climax-hero-bg" style={{ opacity: 0.6 }}></div>
          <div className="absolute inset-0" style={{ backgroundImage: "url('/weather-storm.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1, mixBlendMode: "screen" }}></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <img src="/climax-logo.png" alt="ClimaX" className="w-16 h-16 rounded-xl mx-auto mb-6 shadow-lg" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Protect Your Community?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">Access the full ClimaX dashboard — real-time weather, AI analysis, quantum optimization, and blockchain-verified disaster reporting.</p>
            <button
              onClick={() => setShowLanding(false)}
              className="group px-12 py-5 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-500 shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ boxShadow: "0 0 50px rgba(59,130,246,0.35)" }}
            >
              <span className="flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Enter Dashboard
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </button>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-8 px-6 border-t border-white/10 text-center">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/climax-logo.png" alt="ClimaX" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-lg">ClimaX</span>
              <span className="text-white/30 text-sm ml-2">v2.0</span>
            </div>
            <p className="text-white/30 text-sm">Built with Next.js · FastAPI · Quantum Computing · Blockchain · Multi-Agent AI</p>
          </div>
        </footer>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════
     MAIN DASHBOARD
     ══════════════════════════════════════════════════════════ */
  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-950" : "bg-gradient-to-br from-blue-50 via-green-50 to-purple-50"}`}>
      {/* Header */}
      <header className={`shadow-lg border-b transition-colors duration-500 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  ClimaX
                </h1>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>AI + Quantum + Blockchain Climate Resilience</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${systemStatus.backend_connected ? "bg-green-500" : "bg-yellow-500"}`}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
                <Badge
                  variant="outline"
                  className={`${systemStatus.backend_connected ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}
                >
                  {systemStatus.backend_connected ? "Live" : "Demo"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className={`transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" className={darkMode ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : ""}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Climate Hero */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: "220px" }}>
          <div className="absolute inset-0 climax-hero-bg"></div>
          <div className="absolute inset-0" style={{ backgroundImage: "url('/climate-hero.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25, mixBlendMode: "screen" }}></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="climax-particle climax-particle-1">🌍</div>
            <div className="climax-particle climax-particle-2">🌊</div>
            <div className="climax-particle climax-particle-3">🔥</div>
            <div className="climax-particle climax-particle-4">❄️</div>
            <div className="climax-particle climax-particle-5">🌿</div>
            <div className="climax-particle climax-particle-6">⚡</div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
              Climate Resilience Intelligence
            </h2>
            <p className="text-white/85 text-base md:text-lg max-w-2xl mb-5 drop-shadow">
              Real-time monitoring, AI-driven analysis &amp; quantum-optimized disaster preparedness — all in one platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 py-1 text-sm">
                <Shield className="h-3.5 w-3.5 mr-1.5" /> Blockchain Verified
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 py-1 text-sm">
                ⚛️ Quantum Optimized
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 py-1 text-sm">
                🤖 AI-Powered Alerts
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform shadow-lg ${darkMode ? "shadow-blue-500/20" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{climateMetrics.temperature}°C</div>
              <p className="text-xs opacity-90">+2°C from yesterday</p>
              <div className="mt-2 h-1 bg-white/20 rounded-full"><div className="h-1 bg-white rounded-full" style={{ width: "65%" }}></div></div>
            </CardContent>
          </Card>
          <Card className={`bg-gradient-to-r from-red-500 to-red-600 text-white transform hover:scale-105 transition-transform shadow-lg ${darkMode ? "shadow-red-500/20" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Air Quality Index</CardTitle>
              <Wind className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{climateMetrics.aqi}</div>
              <p className="text-xs opacity-90">Moderate - Unhealthy</p>
              <div className="mt-2 h-1 bg-white/20 rounded-full"><div className="h-1 bg-white rounded-full" style={{ width: "78%" }}></div></div>
            </CardContent>
          </Card>
          <Card className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white transform hover:scale-105 transition-transform shadow-lg ${darkMode ? "shadow-orange-500/20" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Rainfall Deficit</CardTitle>
              <Droplets className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{climateMetrics.rainfall_deficit}%</div>
              <p className="text-xs opacity-90">Below normal levels</p>
              <div className="mt-2 h-1 bg-white/20 rounded-full"><div className="h-1 bg-white rounded-full" style={{ width: "25%" }}></div></div>
            </CardContent>
          </Card>
          <Card className={`bg-gradient-to-r from-green-500 to-green-600 text-white transform hover:scale-105 transition-transform shadow-lg ${darkMode ? "shadow-green-500/20" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Renewable Energy</CardTitle>
              <Sun className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{climateMetrics.renewable_percent}%</div>
              <p className="text-xs opacity-90">Of total energy mix</p>
              <div className="mt-2 h-1 bg-white/20 rounded-full"><div className="h-1 bg-white rounded-full" style={{ width: "68%" }}></div></div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-3 lg:grid-cols-9 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="voice">Voice AI</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="quantum">Quantum</TabsTrigger>
            <TabsTrigger value="policy">Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700" : "bg-gradient-to-br from-orange-50 to-red-50"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className={darkMode ? "text-white" : ""}>Active Alerts</span>
                    <Badge variant="outline">{systemStatus.backend_connected ? "Real-time" : "Demo"}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { type: "Heat Wave", region: "Northern Districts", severity: "High", time: "2 hours ago" },
                    { type: "Air Quality", region: "Urban Areas", severity: "Moderate", time: "4 hours ago" },
                    { type: "Drought", region: "Agricultural Zones", severity: "Medium", time: "1 day ago" },
                  ].map((alert, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                      <div>
                        <div className={`font-medium ${darkMode ? "text-white" : ""}`}>{alert.type} - {alert.region}</div>
                        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{alert.time}</div>
                      </div>
                      <Badge variant={alert.severity === "High" ? "destructive" : alert.severity === "Moderate" ? "default" : "secondary"}>{alert.severity}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className={`${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700" : "bg-gradient-to-br from-blue-50 to-green-50"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className={darkMode ? "text-white" : ""}>Blockchain-Verified Reports</span>
                    <Badge variant="outline">{systemStatus.backend_connected ? "Immutable" : "Demo"}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { type: "Flood", location: "Downtown Area", status: "Verified", time: "30 min ago", hash: "0x1a2b3c" },
                    { type: "Heat Stress", location: "Industrial Zone", status: "Pending", time: "1 hour ago", hash: "0x4d5e6f" },
                    { type: "Air Pollution", location: "Residential Area", status: "Verified", time: "2 hours ago", hash: "0x7g8h9i" },
                  ].map((report, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                      <div>
                        <div className={`font-medium ${darkMode ? "text-white" : ""}`}>{report.type} - {report.location}</div>
                        <div className={`text-sm flex items-center space-x-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          <span>{report.time}</span>
                          <code className={`text-xs px-1 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>{report.hash}</code>
                        </div>
                      </div>
                      <Badge variant={report.status === "Verified" ? "default" : "secondary"}>{report.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weather">
            <WeatherWidget backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
          </TabsContent>
          <TabsContent value="reporting">
            <CitizenReporting backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
          </TabsContent>
          <TabsContent value="analysis">
            <Tabs defaultValue="regional" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
                <TabsTrigger value="resilience">Resilience Analyzer</TabsTrigger>
              </TabsList>
              <TabsContent value="regional">
                <RegionalAnalysis backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
              </TabsContent>
              <TabsContent value="resilience">
                <ResilienceAnalyzer backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="voice">
            <VoiceChat backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
          </TabsContent>
          <TabsContent value="emergency">
            <EmergencyContacts backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
          </TabsContent>
          <TabsContent value="blockchain" className="space-y-6">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dashboard">Blockchain Dashboard</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <BlockchainDashboard backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
              </TabsContent>
              <TabsContent value="analytics">
                <BlockchainAnalytics backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="quantum">
            <QuantumOptimizer backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
          </TabsContent>
          <TabsContent value="policy">
            <PolicyEngine backendConnected={systemStatus.backend_connected} backendUrl={backendUrl} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
