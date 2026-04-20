"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, BarChart3, TrendingUp, Shield, AlertTriangle, CheckCircle, FileText, Loader2 } from "lucide-react"

interface ResilienceAnalyzerProps {
  backendConnected: boolean
  backendUrl: string
}

export default function ResilienceAnalyzer({ backendConnected, backendUrl }: ResilienceAnalyzerProps) {
  const [location, setLocation] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState([
    { location_name: "Mumbai, India", overall_score: 72, risk_level: "Medium", timestamp: "2024-01-15 14:30:00" },
    { location_name: "Delhi, India", overall_score: 68, risk_level: "Medium-High", timestamp: "2024-01-14 10:15:00" },
    { location_name: "Bangalore, India", overall_score: 78, risk_level: "Medium", timestamp: "2024-01-13 16:45:00" },
  ])

  const handleAnalyze = async () => {
    if (!location.trim()) {
      alert("Please enter a location to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: location.trim() }),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData?.detail || errData?.error?.message || `Server error (${response.status})`)
        }

        const result = await response.json()
        setAnalysisResult(result)

        setAnalysisHistory((prev) => [
          {
            location_name: result.location_info?.full_name || location,
            overall_score: result.overall_resilience_score,
            risk_level: result.risk_assessment?.risk_level || "Unknown",
            timestamp: new Date().toLocaleString(),
          },
          ...prev,
        ])
      } else {
        // Demo mode with sample data
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const mockResult = {
          location_info: {
            full_name: location,
            country: "India",
            population: "12.4 million",
            area_km2: "603.4",
            coordinates: { lat: 19.076, lon: 72.8777 },
            key_characteristics: ["Coastal megacity", "Financial hub", "Monsoon-prone", "Dense urban area"],
          },
          category_scores: { infrastructure: 75, economic: 82, social: 68, environmental: 45, governance: 70, emergency: 73 },
          overall_resilience_score: 69,
          risk_assessment: {
            primary_threats: ["Flooding", "Sea level rise", "Urban heat island", "Air pollution"],
            risk_level: "Medium-High",
            most_vulnerable_areas: ["Low-lying coastal areas", "Slum settlements", "Industrial zones"],
            climate_risks: ["Extreme rainfall", "Cyclones", "Temperature rise", "Water scarcity"],
          },
          strengths: ["Strong economic base and financial sector", "Well-developed transportation network", "Active civil society", "Experience in disaster management"],
          vulnerabilities: ["High population density in vulnerable areas", "Inadequate drainage infrastructure", "Air and water pollution", "Informal settlements lacking basic services"],
          recommendations: {
            immediate_actions: ["Upgrade storm water drainage systems", "Implement early warning systems for flooding", "Strengthen building codes in coastal areas"],
            medium_term_improvements: ["Develop climate-resilient infrastructure", "Improve waste management systems", "Create green corridors and urban forests"],
            long_term_strategic_goals: ["Transition to renewable energy sources", "Implement comprehensive coastal protection", "Develop climate adaptation strategies"],
          },
          data_sources_considered: ["Municipal disaster management plans", "Climate vulnerability assessments", "Infrastructure development reports", "Socio-economic surveys"],
          confidence_level: "High",
          last_updated: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          location_query: location,
        }
        setAnalysisResult(mockResult)
        setAnalysisHistory((prev) => [{ location_name: location, overall_score: 69, risk_level: "Medium-High", timestamp: new Date().toLocaleString() }, ...prev])
      }
    } catch (err) {
      console.error("Analysis failed:", err)
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearHistory = () => setAnalysisHistory([])

  return (
    <div className="space-y-6">
      {/* Analyzer Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 climax-img-earth">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Disaster Resilience Analyzer</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {backendConnected ? "Live AI Analysis" : "Demo Mode"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {backendConnected
              ? "Comprehensive disaster resilience analysis with real-time AI insights"
              : "Demo mode — connect backend for live AI-powered analysis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <MapPin className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold">Global</div>
              <div className="text-sm text-gray-600">Coverage</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold">6</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{analysisHistory.length}</div>
              <div className="text-sm text-gray-600">Analyses</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold">AI</div>
              <div className="text-sm text-gray-600">Powered</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analyzer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyzer">Resilience Analyzer</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Location Analysis</span>
              </CardTitle>
              <CardDescription>
                Enter any location worldwide for comprehensive disaster resilience analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!backendConnected && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    Backend not connected. Analysis will use demo data. Connect backend for live AI results.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter location (e.g., Mumbai, Delhi, Tokyo, New York)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !location.trim()}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {backendConnected ? "Analyzing with AI..." : "Running Demo Analysis..."}
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Analyze Disaster Resilience
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  <AlertDescription className="text-blue-700">
                    {backendConnected
                      ? "AI is analyzing infrastructure, economic, social, environmental, governance, and emergency preparedness factors..."
                      : "Generating demo analysis..."}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Analysis Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Categories</CardTitle>
              <CardDescription>Six key areas evaluated for disaster resilience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Infrastructure", description: "Transportation, utilities, healthcare facilities", icon: "🏗️", weight: "25%" },
                  { name: "Economic", description: "Financial stability, employment, recovery capacity", icon: "💰", weight: "20%" },
                  { name: "Social", description: "Community cohesion, education, demographics", icon: "👥", weight: "15%" },
                  { name: "Environmental", description: "Climate risks, natural barriers, air quality", icon: "🌍", weight: "15%" },
                  { name: "Governance", description: "Policy framework, institutional capacity", icon: "🏛️", weight: "10%" },
                  { name: "Emergency", description: "Preparedness, response systems, recovery", icon: "🚨", weight: "15%" },
                ].map((category, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <Badge variant="outline" className="text-xs">{category.weight}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {analysisResult ? (
            <>
              {/* Overall Score */}
              <Card className="bg-gradient-to-r from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Resilience Analysis: {analysisResult.location_info.full_name}</span>
                    <Badge
                      variant={
                        analysisResult.overall_resilience_score >= 80
                          ? "default"
                          : analysisResult.overall_resilience_score >= 60
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {analysisResult.risk_assessment.risk_level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1">
                      <Progress value={analysisResult.overall_resilience_score} className="h-4" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {analysisResult.overall_resilience_score}/100
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(analysisResult.category_scores).map(([category, score]: [string, any]) => (
                      <div key={category} className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-sm font-medium text-gray-600 mb-2 capitalize">{category}</div>
                        <div className="text-xl font-bold text-gray-900 mb-2">{score}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Location Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country:</span>
                        <span className="font-medium">{analysisResult.location_info.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Population:</span>
                        <span className="font-medium">{analysisResult.location_info.population}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium">{analysisResult.location_info.area_km2} km²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{analysisResult.confidence_level}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Characteristics</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.location_info.key_characteristics.map((char: string, index: number) => (
                          <Badge key={index} variant="outline">{char}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Primary Threats</h4>
                      <div className="space-y-2">
                        {analysisResult.risk_assessment.primary_threats.map((threat: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{threat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Climate Risks</h4>
                      <div className="space-y-2">
                        {analysisResult.risk_assessment.climate_risks.map((risk: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths and Vulnerabilities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span>Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysisResult.strengths.map((strength: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Vulnerabilities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysisResult.vulnerabilities.map((vulnerability: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{vulnerability}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-3">Immediate Actions</h4>
                      <div className="space-y-2">
                        {analysisResult.recommendations.immediate_actions.map((action: string, index: number) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 rounded">{action}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-700 mb-3">Medium-term Improvements</h4>
                      <div className="space-y-2">
                        {analysisResult.recommendations.medium_term_improvements.map((improvement: string, index: number) => (
                          <div key={index} className="text-sm p-2 bg-orange-50 rounded">{improvement}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-3">Long-term Goals</h4>
                      <div className="space-y-2">
                        {analysisResult.recommendations.long_term_strategic_goals.map((goal: string, index: number) => (
                          <div key={index} className="text-sm p-2 bg-green-50 rounded">{goal}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                <p className="text-gray-600">Enter a location and click "Analyze Disaster Resilience" to see results</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analysis History</span>
                <Button variant="outline" onClick={clearHistory} disabled={analysisHistory.length === 0}>
                  Clear History
                </Button>
              </CardTitle>
              <CardDescription>Previous resilience analyses</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisHistory.length > 0 ? (
                <div className="space-y-3">
                  {analysisHistory.map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{analysis.location_name}</div>
                        <div className="text-sm text-gray-600">{analysis.timestamp}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{analysis.overall_score}/100</div>
                        <Badge
                          variant={
                            analysis.risk_level.includes("Low")
                              ? "default"
                              : analysis.risk_level.includes("Medium")
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {analysis.risk_level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No analysis history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
