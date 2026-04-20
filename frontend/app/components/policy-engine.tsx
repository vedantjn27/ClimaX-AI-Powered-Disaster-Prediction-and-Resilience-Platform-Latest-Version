"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, TrendingUp, Users, Building, Lightbulb, BarChart3, CheckCircle, Loader2, AlertTriangle } from "lucide-react"

interface PolicyEngineProps {
  backendConnected: boolean
  backendUrl: string
}

export default function PolicyEngine({ backendConnected, backendUrl }: PolicyEngineProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [policyResults, setPolicyResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [disasterPatterns, setDisasterPatterns] = useState([
    { region: "Kerala", disaster_type: "Flood" },
    { region: "Gujarat", disaster_type: "Earthquake" },
    { region: "Assam", disaster_type: "Flood" },
    { region: "Punjab", disaster_type: "Drought" },
  ])

  const [newPattern, setNewPattern] = useState({
    region: "",
    disaster_type: "",
  })

  const handleGeneratePolicies = async () => {
    if (disasterPatterns.length === 0) {
      alert("Please add at least one disaster pattern")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      if (backendConnected) {
        // Call real backend for AI-powered policy generation
        const response = await fetch(`${backendUrl}/generate-evidence-based-policies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(disasterPatterns.map((p) => ({ ...p, frequency: 5 }))),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData?.detail || `Server error (${response.status})`)
        }

        const data = await response.json()
        setPolicyResults(data.detailed_policy_report || [])
      } else {
        // Demo mode — simulate delay and show sample output
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const mockResults = disasterPatterns.map((pattern) => ({
          region: pattern.region,
          disaster_type: pattern.disaster_type,
          current_policies: ["Standard disaster preparedness protocols", "Community awareness programs"],
          evidence_based_recommendation: `For ${pattern.region}, implement a comprehensive ${pattern.disaster_type.toLowerCase()} management plan with AI-based early warning systems, real-time monitoring sensors, and mobile-first alert apps.`,
          factors_considered: [`Regional characteristics of ${pattern.region}`, "Population density", "Infrastructure quality", "Historical disaster data"],
          implementation_timeline: "6-12 months",
          budget_estimate: "₹200-400 crores",
          expected_impact: "40-60% reduction in disaster impact",
        }))
        setPolicyResults(mockResults)
      }
    } catch (err) {
      console.error("Policy generation failed:", err)
      setError(err instanceof Error ? err.message : "Policy generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const addDisasterPattern = () => {
    if (newPattern.region && newPattern.disaster_type) {
      setDisasterPatterns([...disasterPatterns, { region: newPattern.region, disaster_type: newPattern.disaster_type }])
      setNewPattern({ region: "", disaster_type: "" })
    }
  }

  const removePattern = (index: number) => {
    setDisasterPatterns(disasterPatterns.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Policy Engine Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 climax-img-nature">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-green-600" />
            <span>Evidence-Based Policy Engine</span>
            <Badge variant="outline" className="bg-green-100 text-green-700">
              {backendConnected ? "AI-Powered" : "Demo Mode"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {backendConnected
              ? "Generate data-driven policy recommendations with AI analysis"
              : "Connect backend for AI-powered evidence-based policy recommendations"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{disasterPatterns.length}</div>
              <div className="text-sm text-gray-600">Active Patterns</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{new Set(disasterPatterns.map((p) => p.region)).size}</div>
              <div className="text-sm text-gray-600">Regions Covered</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Building className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{new Set(disasterPatterns.map((p) => p.disaster_type)).size}</div>
              <div className="text-sm text-gray-600">Disaster Types</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Lightbulb className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{policyResults?.length || 0}</div>
              <div className="text-sm text-gray-600">Policies Generated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patterns">Disaster Patterns</TabsTrigger>
          <TabsTrigger value="generator">Policy Generator</TabsTrigger>
          <TabsTrigger value="results">Policy Results</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Add Disaster Pattern</span>
                </CardTitle>
                <CardDescription>Input regional disaster data for AI policy analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Region</label>
                  <Input
                    placeholder="Enter region name (e.g., Kerala, Bihar)"
                    value={newPattern.region}
                    onChange={(e) => setNewPattern((prev) => ({ ...prev, region: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Disaster Type</label>
                  <Select
                    value={newPattern.disaster_type}
                    onValueChange={(value) => setNewPattern((prev) => ({ ...prev, disaster_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flood">Flood</SelectItem>
                      <SelectItem value="Earthquake">Earthquake</SelectItem>
                      <SelectItem value="Cyclone">Cyclone</SelectItem>
                      <SelectItem value="Drought">Drought</SelectItem>
                      <SelectItem value="Heatwave">Heatwave</SelectItem>
                      <SelectItem value="Landslide">Landslide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={addDisasterPattern}
                  className="w-full"
                  disabled={!newPattern.region || !newPattern.disaster_type}
                >
                  Add Pattern
                </Button>
              </CardContent>
            </Card>

            {/* Current Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Current Patterns</span>
                </CardTitle>
                <CardDescription>Region-disaster combinations queued for AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {disasterPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{pattern.region}</div>
                        <div className="text-sm text-gray-600">{pattern.disaster_type}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{pattern.disaster_type}</Badge>
                        <Button variant="outline" size="sm" onClick={() => removePattern(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  {disasterPatterns.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No patterns added yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                <span>AI Policy Generator</span>
              </CardTitle>
              <CardDescription>
                {backendConnected
                  ? "Generate evidence-based policies using AI — real analysis, real recommendations"
                  : "Connect backend for live AI-powered policy generation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!backendConnected && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    Backend not connected. Demo mode will generate sample policies. Connect backend for real AI recommendations.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-center space-y-4">
                <Button
                  onClick={handleGeneratePolicies}
                  disabled={isGenerating || disasterPatterns.length === 0}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {backendConnected ? "AI Generating Policies..." : "Generating Demo Policies..."}
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Generate Evidence-Based Policies
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    <AlertDescription className="text-blue-700">
                      {backendConnected
                        ? "AI is analyzing disaster patterns, regional factors, and current policies to generate evidence-based recommendations..."
                        : "Generating demo policies..."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Analysis Factors</h4>
                  <div className="space-y-2 text-sm">
                    {["Regional geographic characteristics", "Historical disaster data", "Current policy effectiveness", "Population density and infrastructure", "Economic and social factors"].map((factor, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Policy Categories</h4>
                  <div className="space-y-2">
                    {["Early Warning Systems", "Infrastructure Development", "Community Preparedness", "Emergency Response", "Recovery and Rehabilitation", "Risk Reduction Measures"].map((category, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">{category}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {policyResults ? (
            <>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  AI successfully generated {policyResults.length} evidence-based policy recommendations.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {policyResults.map((policy, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{policy.region} — {policy.disaster_type} Policy</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline">{policy.implementation_timeline}</Badge>
                          <Badge variant="secondary">{policy.budget_estimate}</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Current Policies</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {(policy.current_policies || []).map((p: string, idx: number) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Evidence-Based Recommendation</h4>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                          {policy.evidence_based_recommendation}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Regional Factors</h5>
                          <div className="space-y-1">
                            {(policy.factors_considered || []).map((factor: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">{factor}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Implementation</h5>
                          <div className="text-sm text-gray-600">
                            <div>Timeline: {policy.implementation_timeline}</div>
                            <div>Budget: {policy.budget_estimate}</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Expected Impact</h5>
                          <div className="text-sm text-green-600 font-medium">{policy.expected_impact}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Policy Results</h3>
                <p className="text-gray-600">Add disaster patterns and click "Generate Evidence-Based Policies" to see AI recommendations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
