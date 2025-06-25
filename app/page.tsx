// app/weather/page.tsx or app/page.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import Image from "next/image";

type WeatherCondition = {
  text: string
  icon: string
  code: number
}

type WeatherData = {
  temperatureC: number
  temperatureF: number
  isDay: boolean
  condition: WeatherCondition
  windMph: number
  windKph: number
  windDegree: number
  windDir: string
  pressureMb: number
  pressureIn: number
  precipMm: number
  precipIn: number
  humidity: number
  cloud: number
  feelsLikeC: number
  feelsLikeF: number
  windChillC: number
  windChillF: number
  heatIndexC: number
  heatIndexF: number
  dewPointC: number
  dewPointF: number
  visibilityKm: number
  visibilityMiles: number
  uvIndex: number
  gustMph: number
  gustKph: number
}


export default function WeatherApp() {
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const fetchWeather = async () => {
    setLoading(true)
    setError("")
    setWeather(null)

    try {
      // You can replace this with a real API like OpenWeatherMap
      const API_KEY = 'f605bd62ef1e4d94b9b115203252406'
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?q=${city}'&key=${API_KEY}`, {
      })

      if (!res.ok) throw new Error("City not found")
      const data = await res.json()

      setWeather({
        temperatureC: data.current.temp_c,
        temperatureF: data.current.temp_f,
        isDay: data.current.is_day === 1,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon,
          code: data.current.condition.code,
        },
        windMph: data.current.wind_mph,
        windKph: data.current.wind_kph,
        windDegree: data.current.wind_degree,
        windDir: data.current.wind_dir,
        pressureMb: data.current.pressure_mb,
        pressureIn: data.current.pressure_in,
        precipMm: data.current.precip_mm,
        precipIn: data.current.precip_in,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
        feelsLikeC: data.current.feelslike_c,
        feelsLikeF: data.current.feelslike_f,
        windChillC: data.current.windchill_c,
        windChillF: data.current.windchill_f,
        heatIndexC: data.current.heatindex_c,
        heatIndexF: data.current.heatindex_f,
        dewPointC: data.current.dewpoint_c,
        dewPointF: data.current.dewpoint_f,
        visibilityKm: data.current.vis_km,
        visibilityMiles: data.current.vis_miles,
        uvIndex: data.current.uv,
        gustMph: data.current.gust_mph,
        gustKph: data.current.gust_kph
      });

    } catch (err: any) {
      setError(err.message || "Failed to fetch weather.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-md mx-auto mt-10 p-4">
        <div className="space-y-2 mb-4">
          <Label htmlFor="city">Enter City</Label>
          <div className="flex gap-2">
            <Input
                id="city"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key == 'Enter') fetchWeather()
                }}
            />
            <Button onClick={fetchWeather} disabled={loading || !city}>
              {loading ? "Loading..." : "Get Weather"}
            </Button>
          </div>
        </div>

        {loading && (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
        )}

        {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {weather && (
            <Card className="mt-4">
              <CardContent className="p-4 space-y-2">
                <Image className='place-self-center mb-16' width={128} height={128} src={"https:"+weather.condition.icon.replace('64x64','128x128')} alt={weather.condition.text} />
                <p><strong>Temperature:</strong> {weather.temperatureC}°C / {weather.temperatureF}°F</p>
                <p><strong>Feels Like:</strong> {weather.feelsLikeC}°C / {weather.feelsLikeF}°F</p>
                <p><strong>Wind Chill:</strong> {weather.windChillC}°C / {weather.windChillF}°F</p>
                <p><strong>Heat Index:</strong> {weather.heatIndexC}°C / {weather.heatIndexF}°F</p>
                <p><strong>Dew Point:</strong> {weather.dewPointC}°C / {weather.dewPointF}°F</p>
                <p><strong>Humidity:</strong> {weather.humidity}%</p>
                <p><strong>Cloud Cover:</strong> {weather.cloud}%</p>
                <p><strong>Wind:</strong> {weather.windKph} km/h ({weather.windMph} mph) {weather.windDir} ({weather.windDegree}°)</p>
                <p><strong>Gusts:</strong> {weather.gustKph} km/h ({weather.gustMph} mph)</p>
                <p><strong>Pressure:</strong> {weather.pressureMb} mb / {weather.pressureIn} in</p>
                <p><strong>Precipitation:</strong> {weather.precipMm} mm / {weather.precipIn} in</p>
                <p><strong>Visibility:</strong> {weather.visibilityKm} km / {weather.visibilityMiles} miles</p>
                <p><strong>UV Index:</strong> {weather.uvIndex}</p>
                <p><strong>Is Daytime:</strong> {weather.isDay ? "Yes" : "No"}</p>
                <p><strong>Condition:</strong> {weather.condition.text}</p>
              </CardContent>
            </Card>
        )}

      </div>
  )
}
