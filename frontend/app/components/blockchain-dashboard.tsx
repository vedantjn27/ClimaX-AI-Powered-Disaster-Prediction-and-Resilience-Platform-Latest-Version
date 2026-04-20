"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
  FileText,
  Hash,
  Clock,
  Activity,
  Database,
  Key,
  Zap,
} from "lucide-react"

interface BlockchainDashboardProps {
  backendConnected: boolean
  backendUrl: string
}

interface Block {
  index: number
  timestamp: string
  data: any[]
  previous_hash: string
  hash: string
  nonce: number
}

interface BlockchainStatus {
  total_blocks: number
  is_valid: boolean
  last_block_hash: string
  pending_transactions: number
}

export default function BlockchainDashboard({ backendConnected, backendUrl }: BlockchainDashboardProps) {
  const [blockchain, setBlockchain] = useState<Block[]>([])
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus>({
    total_blocks: 0,
    is_valid: true,
    last_block_hash: "",
    pending_transactions: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

  // Citizen Registration
  const [citizenForm, setCitizenForm] = useState({
    citizen_id: "",
    name: "",
  })

  // Organization Registration
  const [orgForm, setOrgForm] = useState({
    organization_name: "",
  })

  // Alert Submission
  const [alertForm, setAlertForm] = useState({
    organization_name: "",
    alert_message: "",
    alert_type: "",
    affected_area: "",
    timestamp: "",
    signature: "",
  })

  // Feedback Submission
  const [feedbackForm, setFeedbackForm] = useState({
    citizen_id: "",
    feedback: "",
    signature: "",
  })

  // Government Action
  const [govActionForm, setGovActionForm] = useState({
    feedback_id: "",
    action_taken: "",
    officer_name: "",
  })

  // Mining form
  const [miningData, setMiningData] = useState("")

  // Tampering form
  const [tamperForm, setTamperForm] = useState({
    block_index: "",
    new_data: "",
  })

  // Key display state (shown after registration)
  const [registrationResult, setRegistrationResult] = useState<{
    type: "citizen" | "organization"
    name: string
    citizen_id?: string
    public_key: string
    private_key: string
  } | null>(null)

  // Track which key was just copied for button feedback
  const [copiedKey, setCopiedKey] = useState<"public" | "private" | null>(null)

  // Refs to the visible textareas — select() + execCommand works on these reliably
  const publicKeyRef = useRef<HTMLTextAreaElement>(null)
  const privateKeyRef = useRef<HTMLTextAreaElement>(null)

  // Alert submit state
  const [alertSubmitStatus, setAlertSubmitStatus] = useState<string | null>(null)

  // Feedback submit state
  const [feedbackSubmitStatus, setFeedbackSubmitStatus] = useState<string | null>(null)

  // Active alerts state
  const [activeAlerts, setActiveAlerts] = useState<any[]>([])

  const fetchActiveAlerts = async () => {
    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/alerts/active`)
        if (response.ok) {
          const data = await response.json()
          setActiveAlerts(data)
        }
      }
    } catch (e) {
      console.error("Failed to fetch active alerts:", e)
    }
  }

  // Mock data for demonstration
  useEffect(() => {
    // Simulate blockchain data
    const mockBlockchain: Block[] = [
      {
        index: 0,
        timestamp: "2024-01-01T00:00:00Z",
        data: [{ type: "genesis", message: "Genesis Block" }],
        previous_hash: "0",
        hash: "000abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
        nonce: 0,
      },
      {
        index: 1,
        timestamp: "2024-01-15T10:30:00Z",
        data: [
          { type: "citizen_registration", citizen_id: "CIT001", name: "John Doe" },
          { type: "alert", organization: "Weather Dept", message: "Heat wave warning", severity: "high" },
        ],
        previous_hash: "000abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
        hash: "000def456ghi789jkl012mno345pqr678stu901vwx234yz567abc",
        nonce: 12847,
      },
      {
        index: 2,
        timestamp: "2024-01-20T14:45:00Z",
        data: [
          { type: "feedback", citizen_id: "CIT001", feedback: "Emergency response was excellent", rating: 5 },
          { type: "gov_action", feedback_id: 1, action: "Deployed additional ambulances", officer: "Officer Smith" },
        ],
        previous_hash: "000def456ghi789jkl012mno345pqr678stu901vwx234yz567abc",
        hash: "000ghi789jkl012mno345pqr678stu901vwx234yz567abc123def",
        nonce: 23891,
      },
    ]

    setBlockchain(mockBlockchain)
    setBlockchainStatus({
      total_blocks: mockBlockchain.length,
      is_valid: true,
      last_block_hash: mockBlockchain[mockBlockchain.length - 1]?.hash || "",
      pending_transactions: 3,
    })

    // Fetch alerts on load
    fetchActiveAlerts()
  }, [backendConnected, backendUrl])

  const handleViewBlockchain = async () => {
    setIsLoading(true)
    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/blockchain/view`)
        if (response.ok) {
          const data = await response.json()
          setBlockchain(data.chain)
        }
      }
    } catch (error) {
      console.error("Failed to fetch blockchain:", error)
    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  const handleVerifyBlockchain = async () => {
    setIsLoading(true)
    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/blockchain/verify`)
        if (response.ok) {
          const data = await response.json()
          setBlockchainStatus((prev) => ({ ...prev, is_valid: data.valid }))
        }
      } else {
        // Simulate verification
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setBlockchainStatus((prev) => ({ ...prev, is_valid: true }))
      }
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMineBlock = async () => {
    if (!miningData.trim()) return

    setIsLoading(true)
    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/blockchain/mine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [JSON.parse(miningData)] }),
        })
        if (response.ok) {
          const data = await response.json()
          // Refresh blockchain
          handleViewBlockchain()
        }
      } else {
        // Simulate mining
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const newBlock: Block = {
          index: blockchain.length,
          timestamp: new Date().toISOString(),
          data: [JSON.parse(miningData)],
          previous_hash: blockchain[blockchain.length - 1]?.hash || "0",
          hash: `000${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          nonce: Math.floor(Math.random() * 100000),
        }

        setBlockchain((prev) => [...prev, newBlock])
        setBlockchainStatus((prev) => ({
          ...prev,
          total_blocks: prev.total_blocks + 1,
          last_block_hash: newBlock.hash,
        }))
      }
      setMiningData("")
    } catch (error) {
      console.error("Mining failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterCitizen = async () => {
    if (!citizenForm.citizen_id || !citizenForm.name) return

    setIsLoading(true)
    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/citizen/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(citizenForm),
        })
        if (response.ok) {
          const data = await response.json()
          setRegistrationResult({
            type: "citizen",
            name: citizenForm.name,
            citizen_id: citizenForm.citizen_id,
            public_key: data.public_key || "",
            private_key: data.private_key || "",
          })
        } else {
          const err = await response.json().catch(() => ({}))
          alert(`Registration failed: ${err.detail || response.statusText}`)
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRegistrationResult({
          type: "citizen",
          name: citizenForm.name,
          citizen_id: citizenForm.citizen_id,
          public_key: "DEMO_PUBLIC_KEY_NOT_CONNECTED",
          private_key: "DEMO_PRIVATE_KEY_NOT_CONNECTED",
        })
      }
      setCitizenForm({ citizen_id: "", name: "" })
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterOrganization = async () => {
    if (!orgForm.organization_name) return

    setIsLoading(true)
    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/organization/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orgForm),
        })
        if (response.ok) {
          const data = await response.json()
          setRegistrationResult({
            type: "organization",
            name: orgForm.organization_name,
            public_key: data.public_key || "",
            private_key: data.private_key || "",
          })
        } else {
          const err = await response.json().catch(() => ({}))
          alert(`Registration failed: ${err.detail || response.statusText}`)
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRegistrationResult({
          type: "organization",
          name: orgForm.organization_name,
          public_key: "DEMO_PUBLIC_KEY_NOT_CONNECTED",
          private_key: "DEMO_PRIVATE_KEY_NOT_CONNECTED",
        })
      }
      setOrgForm({ organization_name: "" })
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAlert = async () => {
    if (!alertForm.organization_name || !alertForm.alert_message || !alertForm.alert_type || !alertForm.affected_area || !alertForm.signature) {
      setAlertSubmitStatus("Please fill all fields including your digital signature.")
      return
    }
    setIsLoading(true)
    setAlertSubmitStatus(null)
    try {
      const payload = { ...alertForm, timestamp: new Date().toISOString() }
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/alerts/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await response.json()
        if (response.ok) {
          setAlertSubmitStatus("✅ Alert submitted and verified on the blockchain!")
          setAlertForm({ organization_name: "", alert_message: "", alert_type: "", affected_area: "", timestamp: "", signature: "" })
          fetchActiveAlerts() // Refresh active alerts
        } else {
          setAlertSubmitStatus(`❌ Error: ${data.detail || "Submission failed"}`)
        }
      } else {
        setAlertSubmitStatus("✅ Alert simulated (backend not connected)")
      }
    } catch (e) {
      setAlertSubmitStatus("❌ Network error submitting alert")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.feedback) {
      setFeedbackSubmitStatus("Please enter feedback text.")
      return
    }
    setIsLoading(true)
    setFeedbackSubmitStatus(null)
    try {
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/feedback/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            citizen_id: feedbackForm.citizen_id || null,
            feedback: feedbackForm.feedback,
            signature: feedbackForm.signature || null,
          }),
        })
        const data = await response.json()
        if (response.ok) {
          setFeedbackSubmitStatus("✅ Feedback submitted to the blockchain!")
          setFeedbackForm({ citizen_id: "", feedback: "", signature: "" })
        } else {
          setFeedbackSubmitStatus(`❌ Error: ${data.detail || "Submission failed"}`)
        }
      } else {
        setFeedbackSubmitStatus("✅ Feedback simulated (backend not connected)")
      }
    } catch (e) {
      setFeedbackSubmitStatus("❌ Network error submitting feedback")
    } finally {
      setIsLoading(false)
    }
  }

  // Copy by selecting the actual visible textarea and using execCommand — most reliable method
  const copyKey = (ref: React.RefObject<HTMLTextAreaElement | null>, keyType: "public" | "private") => {
    const el = ref.current
    if (!el) return
    el.select()
    el.setSelectionRange(0, 99999) // for mobile
    const success = document.execCommand("copy")
    if (!success) {
      // Final fallback: navigator.clipboard
      navigator.clipboard.writeText(el.value).catch(console.error)
    }
    // Deselect
    window.getSelection()?.removeAllRanges()
    setCopiedKey(keyType)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Registration Key Display Panel */}
      {registrationResult && (
        <Card className="border-2 border-green-400 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>
                  {registrationResult.type === "citizen" ? "Citizen" : "Organization"} Registered: {registrationResult.name}
                  {registrationResult.citizen_id && ` (ID: ${registrationResult.citizen_id})`}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setRegistrationResult(null)}>✕</Button>
            </CardTitle>
            <CardDescription className="text-green-700">
              ⚠️ Save your private key now — it will not be shown again. Use it to sign alerts and feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">🔓 Public Key</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyKey(publicKeyRef, "public")}
                  className={copiedKey === "public" ? "bg-green-100 text-green-700 border-green-400" : ""}
                >
                  {copiedKey === "public" ? "✓ Copied!" : "Copy"}
                </Button>
              </div>
              <textarea
                ref={publicKeyRef}
                readOnly
                value={registrationResult.public_key}
                className="w-full text-xs font-mono bg-white border rounded p-2 resize-none h-20 select-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-red-600 uppercase tracking-wide">🔐 Private Key — Copy &amp; paste this into Signature fields</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyKey(privateKeyRef, "private")}
                  className={copiedKey === "private" ? "bg-green-100 text-green-700 border-green-400" : "border-red-300"}
                >
                  {copiedKey === "private" ? "✓ Copied!" : "Copy Private Key"}
                </Button>
              </div>
              <textarea
                ref={privateKeyRef}
                readOnly
                value={registrationResult.private_key}
                className="w-full text-xs font-mono bg-red-50 border border-red-200 rounded p-2 resize-none h-36 select-all"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blockchain Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Blocks</CardTitle>
            <Database className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockchainStatus.total_blocks}</div>
            <p className="text-xs opacity-90">Immutable records</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-r ${blockchainStatus.is_valid ? "from-green-500 to-green-600" : "from-red-500 to-red-600"} text-white`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Chain Status</CardTitle>
            {blockchainStatus.is_valid ? (
              <CheckCircle className="h-4 w-4 opacity-90" />
            ) : (
              <AlertTriangle className="h-4 w-4 opacity-90" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockchainStatus.is_valid ? "VALID" : "INVALID"}</div>
            <p className="text-xs opacity-90">
              {blockchainStatus.is_valid ? "Integrity verified" : "Tampering detected"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Pending Transactions</CardTitle>
            <Clock className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockchainStatus.pending_transactions}</div>
            <p className="text-xs opacity-90">Awaiting mining</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Network Hash Rate</CardTitle>
            <Activity className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 TH/s</div>
            <p className="text-xs opacity-90">Mining power</p>
          </CardContent>
        </Card>
      </div>

      {/* Blockchain Status Alert */}
      {!blockchainStatus.is_valid && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Blockchain Integrity Warning</AlertTitle>
          <AlertDescription className="text-red-700">
            Tampering detected in the blockchain. Some blocks may have been modified.
            <Button variant="link" className="p-0 h-auto text-red-700 underline ml-1" onClick={handleVerifyBlockchain}>
              Verify chain integrity
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!backendConnected && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Database className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Backend not connected. Blockchain operations are simulated for demonstration purposes.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="explorer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="explorer">Block Explorer</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="alerts">Alert System</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="mining">Mining</TabsTrigger>
          <TabsTrigger value="admin">Admin Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blockchain Explorer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>Blockchain Explorer</span>
                </CardTitle>
                <CardDescription>Browse all blocks in the climate resilience blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Button onClick={handleViewBlockchain} disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Refresh Blockchain"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleVerifyBlockchain}
                    disabled={isLoading}
                    className="w-full bg-transparent"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Integrity
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {blockchain.map((block) => (
                    <div
                      key={block.index}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedBlock(block)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Block #{block.index}</Badge>
                        <span className="text-xs text-gray-500">{new Date(block.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="font-mono text-xs truncate">{block.hash}</span>
                        </div>
                        <div className="text-gray-600">
                          {block.data.length} transaction{block.data.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Block Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Block Details</span>
                </CardTitle>
                <CardDescription>
                  {selectedBlock ? `Block #${selectedBlock.index} Information` : "Select a block to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBlock ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Index:</span>
                        <div className="font-mono">{selectedBlock.index}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Nonce:</span>
                        <div className="font-mono">{selectedBlock.nonce}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Timestamp:</span>
                        <div>{new Date(selectedBlock.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Hash:</span>
                        <div className="font-mono text-xs break-all bg-gray-100 p-2 rounded">{selectedBlock.hash}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Previous Hash:</span>
                        <div className="font-mono text-xs break-all bg-gray-100 p-2 rounded">
                          {selectedBlock.previous_hash}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-600 block mb-2">Transactions:</span>
                      <div className="space-y-2">
                        {selectedBlock.data.map((transaction, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="secondary">{transaction.type}</Badge>
                            </div>
                            <pre className="text-xs overflow-x-auto">{JSON.stringify(transaction, null, 2)}</pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select a block from the explorer to view its details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Citizen Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Citizen Registration</span>
                </CardTitle>
                <CardDescription>Register citizens on the blockchain for transparency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Citizen ID</label>
                  <Input
                    placeholder="Enter unique citizen ID"
                    value={citizenForm.citizen_id}
                    onChange={(e) => setCitizenForm((prev) => ({ ...prev, citizen_id: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    placeholder="Enter citizen's full name"
                    value={citizenForm.name}
                    onChange={(e) => setCitizenForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={handleRegisterCitizen}
                  disabled={isLoading || !citizenForm.citizen_id || !citizenForm.name}
                  className="w-full"
                >
                  {isLoading ? "Registering..." : "Register Citizen"}
                </Button>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Public Key Generation</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Upon registration, a unique public key will be generated for digital signatures and verification.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Organization Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-green-600" />
                  <span>Organization Registration</span>
                </CardTitle>
                <CardDescription>Register organizations for alert submission authority</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization Name</label>
                  <Input
                    placeholder="Enter organization name"
                    value={orgForm.organization_name}
                    onChange={(e) => setOrgForm((prev) => ({ ...prev, organization_name: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={handleRegisterOrganization}
                  disabled={isLoading || !orgForm.organization_name}
                  className="w-full"
                >
                  {isLoading ? "Registering..." : "Register Organization"}
                </Button>

                <div className="mt-4 space-y-3">
                  <h4 className="text-sm font-medium">Registered Organizations:</h4>
                  <div className="space-y-2">
                    {[
                      "National Weather Service",
                      "Disaster Management Authority",
                      "Municipal Corporation",
                      "Emergency Services",
                    ].map((org, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{org}</span>
                        <Badge variant="outline">Verified</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Submit Alert</span>
                </CardTitle>
                <CardDescription>Submit verified alerts to the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization Name</label>
                  <Input
                    placeholder="Your organization name"
                    value={alertForm.organization_name}
                    onChange={(e) => setAlertForm((prev) => ({ ...prev, organization_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Alert Type</label>
                  <Input
                    placeholder="e.g., Heat Wave, Flood, Cyclone"
                    value={alertForm.alert_type}
                    onChange={(e) => setAlertForm((prev) => ({ ...prev, alert_type: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Affected Area</label>
                  <Input
                    placeholder="Geographic area affected"
                    value={alertForm.affected_area}
                    onChange={(e) => setAlertForm((prev) => ({ ...prev, affected_area: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Alert Message</label>
                  <Textarea
                    placeholder="Detailed alert message"
                    value={alertForm.alert_message}
                    onChange={(e) => setAlertForm((prev) => ({ ...prev, alert_message: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Digital Signature (Private Key)</label>
                  <p className="text-xs text-gray-500 mb-1">Paste the full PEM private key you received when registering your organization</p>
                  <Textarea
                    placeholder="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"
                    value={alertForm.signature}
                    onChange={(e) => setAlertForm((prev) => ({ ...prev, signature: e.target.value }))}
                    rows={5}
                    className="font-mono text-xs"
                  />
                </div>
                {alertSubmitStatus && (
                  <p className={`text-sm mt-1 ${alertSubmitStatus.startsWith("✅") ? "text-green-700" : "text-red-700"}`}>{alertSubmitStatus}</p>
                )}
                <Button className="w-full" disabled={isLoading} onClick={handleSubmitAlert}>
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? "Submitting..." : "Submit Signed Alert"}
                </Button>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  <span>Active Alerts</span>
                </CardTitle>
                <CardDescription>Blockchain-verified active alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeAlerts.length === 0 ? (
                    <p className="text-sm text-gray-500">No active alerts found.</p>
                  ) : (
                    activeAlerts.map((alert, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="destructive">{alert.alert_type}</Badge>
                          <div className="flex items-center space-x-2">
                            {alert.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                            <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>Organization:</strong> {alert.organization_name}
                          </div>
                          <div>
                            <strong>Area:</strong> {alert.affected_area}
                          </div>
                          <div>
                            <strong>Message:</strong> {alert.alert_message}
                          </div>
                          <div className="flex flex-col mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded break-all gap-1">
                            <strong>Signature:</strong> 
                            <span className="font-mono text-[10px] break-all">{alert.signature.substring(0, 50)}...</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Submit Feedback</span>
                </CardTitle>
                <CardDescription>Submit citizen feedback to the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Citizen ID</label>
                  <Input
                    placeholder="Your registered citizen ID"
                    value={feedbackForm.citizen_id}
                    onChange={(e) => setFeedbackForm((prev) => ({ ...prev, citizen_id: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Feedback</label>
                  <Textarea
                    placeholder="Your feedback about government services or disaster response"
                    value={feedbackForm.feedback}
                    onChange={(e) => setFeedbackForm((prev) => ({ ...prev, feedback: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Digital Signature (Private Key — Optional)</label>
                  <p className="text-xs text-gray-500 mb-1">Paste your citizen private key to sign the feedback. Leave blank for anonymous submission.</p>
                  <Textarea
                    placeholder="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"
                    value={feedbackForm.signature}
                    onChange={(e) => setFeedbackForm((prev) => ({ ...prev, signature: e.target.value }))}
                    rows={5}
                    className="font-mono text-xs"
                  />
                </div>
                {feedbackSubmitStatus && (
                  <p className={`text-sm mt-1 ${feedbackSubmitStatus.startsWith("✅") ? "text-green-700" : "text-red-700"}`}>{feedbackSubmitStatus}</p>
                )}
                <Button className="w-full" disabled={isLoading} onClick={handleSubmitFeedback}>
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? "Submitting..." : "Submit Feedback"}
                </Button>
              </CardContent>
            </Card>

            {/* Government Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Government Actions</span>
                </CardTitle>
                <CardDescription>Log government responses to citizen feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Feedback ID</label>
                  <Input
                    placeholder="ID of the feedback being addressed"
                    value={govActionForm.feedback_id}
                    onChange={(e) => setGovActionForm((prev) => ({ ...prev, feedback_id: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Action Taken</label>
                  <Textarea
                    placeholder="Describe the action taken in response to the feedback"
                    value={govActionForm.action_taken}
                    onChange={(e) => setGovActionForm((prev) => ({ ...prev, action_taken: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Officer Name</label>
                  <Input
                    placeholder="Name of the responsible officer"
                    value={govActionForm.officer_name}
                    onChange={(e) => setGovActionForm((prev) => ({ ...prev, officer_name: e.target.value }))}
                  />
                </div>
                <Button className="w-full" disabled={isLoading}>
                  <FileText className="h-4 w-4 mr-2" />
                  Log Government Action
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Recent Actions:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Emergency response improvement</span>
                      <Badge variant="outline">Officer Smith</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Infrastructure repair initiated</span>
                      <Badge variant="outline">Officer Johnson</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mining" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mine New Block */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Mine New Block</span>
                </CardTitle>
                <CardDescription>Add new transactions to the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Transaction Data (JSON)</label>
                  <Textarea
                    placeholder='{"type": "example", "data": "sample transaction"}'
                    value={miningData}
                    onChange={(e) => setMiningData(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                <Button onClick={handleMineBlock} disabled={isLoading || !miningData.trim()} className="w-full">
                  {isLoading ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Mining Block...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Mine Block
                    </>
                  )}
                </Button>

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mining Progress</span>
                      <span>Finding nonce...</span>
                    </div>
                    <Progress value={33} className="h-2" />
                    <p className="text-xs text-gray-600">Solving proof-of-work puzzle. This may take a few moments.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mining Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Mining Statistics</span>
                </CardTitle>
                <CardDescription>Network mining information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">2.4 TH/s</div>
                    <div className="text-sm text-gray-600">Hash Rate</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">12.5s</div>
                    <div className="text-sm text-gray-600">Avg Block Time</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">4</div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-orange-600">98.7%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Recent Mining Activity:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Block #2 mined</span>
                      <Badge variant="outline">23,891 nonce</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Block #1 mined</span>
                      <Badge variant="outline">12,847 nonce</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Mining Rewards:</h4>
                  <p className="text-xs text-blue-700">
                    Miners receive transaction fees and contribute to network security through proof-of-work consensus.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blockchain Administration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span>Blockchain Administration</span>
                </CardTitle>
                <CardDescription>Administrative tools for blockchain management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleViewBlockchain} disabled={isLoading}>
                    <Database className="h-4 w-4 mr-2" />
                    View Chain
                  </Button>
                  <Button variant="outline" onClick={handleVerifyBlockchain} disabled={isLoading}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Chain
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3 text-red-600">Danger Zone</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Block Index to Tamper</label>
                      <Input
                        placeholder="Block index (for testing)"
                        value={tamperForm.block_index}
                        onChange={(e) => setTamperForm((prev) => ({ ...prev, block_index: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">New Data</label>
                      <Input
                        placeholder="Modified data (for testing)"
                        value={tamperForm.new_data}
                        onChange={(e) => setTamperForm((prev) => ({ ...prev, new_data: e.target.value }))}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      disabled={isLoading || !tamperForm.block_index || !tamperForm.new_data}
                      className="w-full"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Tamper Block (Testing Only)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>System Status</span>
                </CardTitle>
                <CardDescription>Overall blockchain system health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Blockchain Integrity</span>
                    <Badge variant={blockchainStatus.is_valid ? "default" : "destructive"}>
                      {blockchainStatus.is_valid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Network Status</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Consensus Algorithm</span>
                    <Badge variant="outline">Proof of Work</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Node Count</span>
                    <Badge variant="outline">5 Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backend Connection</span>
                    <Badge variant={backendConnected ? "default" : "secondary"}>
                      {backendConnected ? "Connected" : "Demo Mode"}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Recent System Events:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Block #2 added successfully</span>
                      <span className="text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Integrity verification passed</span>
                      <span className="text-gray-500">5 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New organization registered</span>
                      <span className="text-gray-500">10 min ago</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Security Features:</h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Cryptographic hash verification</li>
                    <li>• Digital signature validation</li>
                    <li>• Immutable transaction records</li>
                    <li>• Distributed consensus mechanism</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
