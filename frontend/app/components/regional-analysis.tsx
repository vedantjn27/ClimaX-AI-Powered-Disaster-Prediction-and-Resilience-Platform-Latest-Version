"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, BarChart3, TrendingUp, Thermometer, Wind, Droplets, Zap, Shield, Loader2, AlertTriangle, Leaf } from "lucide-react"

interface RegionalAnalysisProps {
  backendConnected: boolean
  backendUrl: string
}

interface AnalysisResult {
  overview: {
    summary: string
    key_stats: { label: string; value: string; trend: string }[]
    highlights: string[]
  }
  climate_data: {
    temperature_trend: string
    rainfall_pattern: string
    extreme_events: string[]
    seasonal_analysis: string
  }
  risk_assessment: {
    overall_risk: string
    primary_threats: string[]
    vulnerability_factors: string[]
    projected_impacts: string[]
  }
  mitigation: {
    immediate_actions: string[]
    long_term_strategies: string[]
    adaptation_measures: string[]
    estimated_investment: string
  }
}

interface RegionInfo {
  climate_type: string
  major_issues: string[]
  population: string
  key_sectors: string[]
  current_aqi: number
  avg_temp: number
  rainfall_deficit: number
  renewable_percent: number
}

export default function RegionalAnalysis({ backendConnected, backendUrl }: RegionalAnalysisProps) {
  const [selectedRegion, setSelectedRegion] = useState("Delhi")
  const [isLoading, setIsLoading] = useState(false)
  const [regionData, setRegionData] = useState<RegionInfo | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const regions = ["Delhi", "Mumbai", "Bangalore", "Uttarakhand", "Assam", "Gujarat", "Odisha", "Andhra Pradesh"]

  useEffect(() => {
    if (backendConnected) {
      handleRegionChange(selectedRegion)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendConnected])

  const handleRegionChange = async (region: string) => {
    setSelectedRegion(region)
    setIsLoading(true)
    setError(null)

    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/region/${encodeURIComponent(region)}/full-analysis`, {
          method: "POST",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setRegionData(data.region_data)
            setAnalysis(data.analysis)
          } else {
            throw new Error("Analysis failed")
          }
        } else {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData?.detail || "Failed to fetch analysis")
        }
      }
    } catch (err) {
      console.error("Failed to fetch region data:", err)
      setError(err instanceof Error ? err.message : "Failed to load analysis")
    } finally {
      setIsLoading(false)
    }
  }

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-600"
    if (aqi <= 100) return "text-yellow-600"
    if (aqi <= 150) return "text-orange-600"
    return "text-red-600"
  }

  const getRiskColor = (risk: string) => {
    const r = risk?.toLowerCase() || ""
    if (r.includes("high")) return "destructive"
    if (r.includes("medium")) return "secondary"
    return "default"
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "📈"
    if (trend === "down") return "📉"
    return "➡️"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 climax-img-nature">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span>Regional Climate Analysis</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {backendConnected ? "AI-Powered" : "Demo Mode"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {backendConnected
              ? "Comprehensive climate analysis with real-time AI insights"
              : "Connect the backend to see AI-generated regional analysis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    📍 {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoading && (
              <div className="flex items-center text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating AI analysis...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!backendConnected && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Backend not connected. Connect the backend to see live AI-generated regional analysis.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Region Stats Bar */}
      {regionData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-4 text-center">
              <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{regionData.avg_temp}°C</div>
              <div className="text-sm text-gray-600">Avg Temperature</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4 text-center">
              <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getAQIColor(regionData.current_aqi)}`}>{regionData.current_aqi}</div>
              <div className="text-sm text-gray-600">Current AQI</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{regionData.rainfall_deficit}%</div>
              <div className="text-sm text-gray-600">Rainfall Deficit</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{regionData.renewable_percent}%</div>
              <div className="text-sm text-gray-600">Renewable Energy</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis Tabs */}
      {analysis ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="climate">Climate Data</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>{selectedRegion} — Climate Overview</span>
                </CardTitle>
                <CardDescription>{regionData?.climate_type} climate • Population: {regionData?.population}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{analysis.overview.summary}</p>

                {analysis.overview.key_stats.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.overview.key_stats.map((stat, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-500">{stat.label}</div>
                        <div className="text-lg font-bold">{stat.value} {getTrendIcon(stat.trend)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {analysis.overview.highlights.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Key Highlights</h4>
                    <div className="space-y-2">
                      {analysis.overview.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regionData?.major_issues && (
                  <div>
                    <h4 className="font-medium mb-2">Major Issues</h4>
                    <div className="flex flex-wrap gap-2">
                      {regionData.major_issues.map((issue, idx) => (
                        <Badge key={idx} variant="outline">{issue}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="climate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-red-600" />
                  <span>Climate Data — {selectedRegion}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">🌡️ Temperature Trends</h4>
                    <p className="text-sm text-gray-700">{analysis.climate_data.temperature_trend}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">🌧️ Rainfall Patterns</h4>
                    <p className="text-sm text-gray-700">{analysis.climate_data.rainfall_pattern}</p>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">🌪️ Extreme Weather Events</h4>
                  <div className="space-y-2">
                    {analysis.climate_data.extreme_events.map((event, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">📅 Seasonal Analysis</h4>
                  <p className="text-sm text-gray-700">{analysis.climate_data.seasonal_analysis}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span>Risk Assessment — {selectedRegion}</span>
                  </div>
                  <Badge variant={getRiskColor(analysis.risk_assessment.overall_risk) as any}>
                    {analysis.risk_assessment.overall_risk} Risk
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Primary Threats</h4>
                    <div className="space-y-2">
                      {analysis.risk_assessment.primary_threats.map((threat, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-red-50 p-2 rounded">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Vulnerability Factors</h4>
                    <div className="space-y-2">
                      {analysis.risk_assessment.vulnerability_factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-orange-50 p-2 rounded">
                          <span className="text-orange-500">⚡</span>
                          <span className="text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Projected Impacts</h4>
                  <div className="space-y-2">
                    {analysis.risk_assessment.projected_impacts.map((impact, idx) => (
                      <div key={idx} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                        <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mitigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span>Mitigation Strategies — {selectedRegion}</span>
                </CardTitle>
                {analysis.mitigation.estimated_investment && (
                  <CardDescription>
                    Estimated Investment: {analysis.mitigation.estimated_investment}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-3">🚨 Immediate Actions</h4>
                    <div className="space-y-2">
                      {analysis.mitigation.immediate_actions.map((action, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">📋 Long-Term Strategies</h4>
                    <div className="space-y-2">
                      {analysis.mitigation.long_term_strategies.map((strategy, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-3">🌱 Adaptation Measures</h4>
                    <div className="space-y-2">
                      {analysis.mitigation.adaptation_measures.map((measure, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-green-500 font-bold">•</span>
                          <span>{measure}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : !isLoading && backendConnected && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Region</h3>
            <p className="text-gray-600">Choose a region from the dropdown to see AI-generated climate analysis</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
