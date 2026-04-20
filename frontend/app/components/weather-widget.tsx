"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge, MapPin, Thermometer, AlertTriangle, Loader2 } from "lucide-react"

interface WeatherWidgetProps {
  backendConnected: boolean
  backendUrl: string
}

interface WeatherSuccessData {
  city: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  uvIndex: number
  feels_like: number
  weather_description: string
}

type WeatherData =
  | {
      success: true
      data: WeatherSuccessData
    }
  | {
      success: false
      error: string
    }

interface ForecastDay {
  date: string
  temp_max: number
  temp_min: number
  temp_avg: number
  humidity_avg: number
  wind_avg: number
  description: string
  rain_total: number
}

interface AQIData {
  aqi: number
  aqi_label: string
  aqi_color: string
  components: {
    pm2_5: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
}

interface WeatherAlert {
  severity: string
  title: string
  message: string
}

export default function WeatherWidget({ backendConnected, backendUrl }: WeatherWidgetProps) {
  const [city, setCity] = useState("")
  const [currentCity, setCurrentCity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [aqiData, setAqiData] = useState<AQIData | null>(null)
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [advisories, setAdvisories] = useState<string[]>([])
  const [forecastLoading, setForecastLoading] = useState(false)
  const [aqiLoading, setAqiLoading] = useState(false)
  const [alertsLoading, setAlertsLoading] = useState(false)

  // Auto-detect location on mount
  useEffect(() => {
    if (backendConnected) {
      detectLocation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendConnected])

  const detectLocation = async () => {
    setIsDetecting(true)
    try {
      if ("geolocation" in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
        })

        const { latitude, longitude } = position.coords

        // Reverse geocode using OpenWeatherMap
        const response = await fetch(
          `${backendUrl}/weather/${latitude},${longitude}`
        ).catch(() => null)

        // Try reverse geocoding via a simple lat/lon weather fetch
        // OpenWeatherMap returns the city name in the response
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=a4ea65c9b0f75b31dd8eed93ac3c5151`
        )
        const geoData = await geoResponse.json()

        if (geoData && geoData.length > 0) {
          const detectedCity = geoData[0].name
          setCity(detectedCity)
          // Always use coordinates for accurate backend fetching
          const coordCity = `${latitude},${longitude}`
          setCurrentCity(coordCity)
          await fetchAllWeatherData(coordCity)
        }
      }
    } catch (error) {
      console.error("Location detection failed:", error)
      // Fallback: just don't auto-load
    } finally {
      setIsDetecting(false)
    }
  }

  const fetchAllWeatherData = async (cityName: string) => {
    setIsLoading(true)
    setCurrentCity(cityName)

    try {
      // Fetch current weather
      if (backendConnected) {
        const response = await fetch(`${backendUrl}/weather/${encodeURIComponent(cityName)}`)
        const data = await response.json()

        if (data.success) {
          const wd: WeatherData = {
            success: true,
            data: {
              city: data.data.location,
              temperature: Math.round(data.data.temperature),
              condition: data.data.weather_description || "Clear",
              humidity: data.data.humidity,
              windSpeed: Math.round(data.data.wind_speed),
              visibility: 8,
              pressure: Math.round(data.data.pressure),
              uvIndex: 7,
              feels_like: Math.round(data.data.feels_like || data.data.temperature),
              weather_description: data.data.weather_description,
            },
          }
          setWeatherData(wd)

          // Fetch forecast, AQI, and alerts in parallel
          fetchForecast(cityName)
          fetchAQI(cityName)
          // Fetch alerts after we have weather + AQI data
          if (wd.success) {
            fetchAlerts(cityName, wd.data)
          }
        } else {
          throw new Error(data.error?.message || "Failed to fetch weather data")
        }
      }
    } catch (error) {
      console.error("Weather API error:", error)
      setWeatherData({
        success: false,
        error: "Unable to fetch weather data. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchForecast = async (cityName: string) => {
    setForecastLoading(true)
    try {
      const response = await fetch(`${backendUrl}/weather/${encodeURIComponent(cityName)}/forecast`)
      const data = await response.json()
      if (data.success) {
        setForecast(data.forecast)
      }
    } catch (error) {
      console.error("Forecast fetch failed:", error)
    } finally {
      setForecastLoading(false)
    }
  }

  const fetchAQI = async (cityName: string) => {
    setAqiLoading(true)
    try {
      const response = await fetch(`${backendUrl}/weather/${encodeURIComponent(cityName)}/air-quality`)
      const data = await response.json()
      if (data.success) {
        setAqiData(data)
      }
    } catch (error) {
      console.error("AQI fetch failed:", error)
    } finally {
      setAqiLoading(false)
    }
  }

  const fetchAlerts = async (cityName: string, weather: WeatherSuccessData) => {
    setAlertsLoading(true)
    try {
      const response = await fetch(`${backendUrl}/weather/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityName,
          temperature: weather.temperature,
          humidity: weather.humidity,
          wind_speed: weather.windSpeed,
          description: weather.condition,
          aqi: aqiData?.aqi || 0,
          aqi_label: aqiData?.aqi_label || "",
        }),
      })
      const data = await response.json()
      if (data.success) {
        setAlerts(data.alerts || [])
        setAdvisories(data.advisories || [])
      }
    } catch (error) {
      console.error("Alerts fetch failed:", error)
    } finally {
      setAlertsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!city.trim()) return
    await fetchAllWeatherData(city.trim())
  }

  const getWeatherIcon = (condition: string) => {
    if (condition?.toLowerCase().includes("rain")) return <CloudRain className="h-12 w-12 text-blue-500" />
    if (condition?.toLowerCase().includes("cloud")) return <Cloud className="h-12 w-12 text-gray-500" />
    return <Sun className="h-12 w-12 text-yellow-500" />
  }

  const getSmallWeatherIcon = (condition: string) => {
    if (condition?.toLowerCase().includes("rain")) return <CloudRain className="h-6 w-6 text-blue-500" />
    if (condition?.toLowerCase().includes("cloud")) return <Cloud className="h-6 w-6 text-gray-500" />
    return <Sun className="h-6 w-6 text-yellow-500" />
  }

  // AQI color based on 0-500 WAQI/IND AQI scale
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-600"     // Good
    if (aqi <= 100) return "text-lime-600"     // Satisfactory
    if (aqi <= 200) return "text-yellow-600"   // Moderate
    if (aqi <= 300) return "text-orange-600"   // Poor
    if (aqi <= 400) return "text-red-600"      // Very Poor
    return "text-purple-700"                   // Severe
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high": return "border-red-200 bg-red-50"
      case "medium": return "border-orange-200 bg-orange-50"
      default: return "border-yellow-200 bg-yellow-50"
    }
  }

  const getAlertTextColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-700"
      case "medium": return "text-orange-700"
      default: return "text-yellow-700"
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 climax-img-weather">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-blue-600" />
            <span>Real-time Weather Information</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {backendConnected ? "Live Data" : "Demo Mode"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {backendConnected
              ? "Live weather data with real-time updates"
              : "Weather service running in demo mode"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!backendConnected && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-yellow-700">
                Backend not connected. Connect the backend to see live weather data.
              </AlertDescription>
            </Alert>
          )}

          {isDetecting && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-700">
                Detecting your location...
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2 mb-6">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter city name (e.g., Mumbai, Delhi, London)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading || !city.trim()}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
            {backendConnected && (
              <Button variant="outline" onClick={detectLocation} disabled={isDetecting} className="bg-transparent">
                <MapPin className="h-4 w-4 mr-1" />
                {isDetecting ? "Detecting..." : "My Location"}
              </Button>
            )}
          </div>

          {weatherData && !weatherData.success && weatherData.error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{weatherData.error}</AlertDescription>
            </Alert>
          )}

          {weatherData && weatherData.success && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Weather */}
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{weatherData.data.city}</h3>
                      <p className="opacity-90">{weatherData.data.condition}</p>
                    </div>
                    {getWeatherIcon(weatherData.data.condition)}
                  </div>
                  <div className="text-4xl font-bold mb-2">{weatherData.data.temperature}°C</div>
                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <span className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-1" />
                      Feels like {weatherData.data.feels_like}°C
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Live Data
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4 text-center">
                    <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{weatherData.data.humidity}%</div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardContent className="p-4 text-center">
                    <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{weatherData.data.windSpeed}</div>
                    <div className="text-sm text-gray-600">km/h Wind</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-4 text-center">
                    <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{weatherData.data.visibility}</div>
                    <div className="text-sm text-gray-600">km Visibility</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-4 text-center">
                    <Gauge className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{weatherData.data.pressure}</div>
                    <div className="text-sm text-gray-600">hPa Pressure</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>5-Day Weather Forecast</CardTitle>
          <CardDescription>
            {currentCity ? `Extended outlook for ${currentCity}` : "Search a city to see forecast"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forecastLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
              <span className="text-gray-600">Loading forecast...</span>
            </div>
          ) : forecast.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="font-medium mb-2">{formatDate(day.date)}</div>
                    <div className="flex justify-center mb-2">{getSmallWeatherIcon(day.description)}</div>
                    <div className="text-sm mt-2">
                      <div className="font-bold">{Math.round(day.temp_max)}°</div>
                      <div className="text-gray-600">{Math.round(day.temp_min)}°</div>
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <Droplets className="h-3 w-3 text-blue-500 mr-1" />
                      <span className="text-xs">{day.rain_total}mm</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">{day.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Search for a city to see the weather forecast</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Weather Alerts & Advisories</span>
            {currentCity && <Badge variant="outline">{currentCity}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-orange-500 mr-2" />
              <span className="text-gray-600">Generating AI-powered alerts...</span>
            </div>
          ) : alerts.length > 0 || advisories.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <Alert key={index} className={getAlertColor(alert.severity)}>
                  <AlertTriangle className={`h-4 w-4 ${getAlertTextColor(alert.severity)}`} />
                  <AlertDescription className={getAlertTextColor(alert.severity)}>
                    <strong>{alert.title}:</strong> {alert.message}
                  </AlertDescription>
                </Alert>
              ))}
              {advisories.map((advisory, index) => (
                <Alert key={`adv-${index}`} className="border-blue-200 bg-blue-50">
                  <Sun className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    {advisory}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Search for a city to see weather alerts</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Air Quality Index */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-gray-600" />
            <span>Air Quality Index</span>
            {currentCity && <Badge variant="outline">{currentCity}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aqiLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-green-500 mr-2" />
              <span className="text-gray-600">Loading air quality data...</span>
            </div>
          ) : aqiData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getAQIColor(aqiData.aqi)}`}>{aqiData.aqi}</div>
                <div className="text-sm text-gray-600 mb-2">Current AQI</div>
                <Badge style={{ backgroundColor: aqiData.aqi_color, color: "white" }}>{aqiData.aqi_label}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>PM2.5:</span>
                  <span className="font-medium">{aqiData.components.pm2_5} μg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>PM10:</span>
                  <span className="font-medium">{aqiData.components.pm10} μg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>O3:</span>
                  <span className="font-medium">{aqiData.components.o3} μg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>NO2:</span>
                  <span className="font-medium">{aqiData.components.no2} μg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>SO2:</span>
                  <span className="font-medium">{aqiData.components.so2} μg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CO:</span>
                  <span className="font-medium">{aqiData.components.co} μg/m³</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Health Advisory:</strong>
                </p>
                <p>
                  {aqiData.aqi <= 50
                    ? "Air quality is Good. Enjoy outdoor activities with no restrictions."
                    : aqiData.aqi <= 100
                      ? "Air quality is Satisfactory. Unusually sensitive people should consider reducing prolonged outdoor exertion."
                      : aqiData.aqi <= 200
                        ? "Moderate air quality. People with respiratory or heart disease, the elderly and children should limit prolonged outdoor exertion."
                        : aqiData.aqi <= 300
                          ? "Poor air quality. Everyone may begin to experience health effects. Sensitive groups should avoid outdoor activity."
                          : aqiData.aqi <= 400
                            ? "Very Poor air quality. Health alert: everyone may experience more serious health effects. Avoid outdoor activity."
                            : "Severe air quality. Health warnings of emergency conditions. Everyone should avoid outdoor activity."}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Wind className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Search for a city to see air quality data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
