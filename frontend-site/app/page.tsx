"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sun,
  Zap,
  TrendingDown,
  Shield,
  Users,
  Award,
  Leaf,
  DollarSign,
  ExternalLink,
  Linkedin,
  Instagram,
} from "lucide-react"
import { GoogleLoginButton } from "@/components/google-login-button"
import { FloatingBills } from "@/components/floating-bills"
import Image from "next/image"

export default function SolarCalculatorLanding() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 relative">
      {/* Fixed Solar Panel Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40"></div>
        <Image
          src="/images/solar-panels-hero.jpg"
          alt="Solar panels background"
          fill
          className="object-cover opacity-15"
          priority
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/70"></div>
      </div>

      <FloatingBills />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SolarCalc SA</h1>
              <p className="text-xs text-slate-600">Premium Solar Solutions</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors">
              Solutions
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors">
              About
            </a>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1"
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
            <GoogleLoginButton />
          </nav>

          <div className="md:hidden">
            <GoogleLoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-32 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-amber-100 text-amber-800 border-amber-200">
            🌟 South Africa's Leading Solar Partner
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Calculate Your Solar Savings
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              in Minutes
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how much you can save with premium solar panel installations. Get instant calculations tailored for
            South African businesses, including load shedding protection and Eskom tariff analysis.
          </p>

          <div className="flex justify-center mb-12 relative">
            {/* Subtle shadow above the cards */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-b from-slate-300/30 to-transparent rounded-xl blur-sm z-0" />
            <a href="/sign-in" className="z-10">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Interactive Calculator
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg transition-all rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-slate-800">R2.5M+</div>
              <div className="text-slate-600">Average Business Savings</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg transition-all rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-slate-800">500+</div>
              <div className="text-slate-600">Installations Completed</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg transition-all rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-slate-800">85%</div>
              <div className="text-slate-600">Load Shedding Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Solar Section */}
      <section className="py-32 px-4 bg-white/70 backdrop-blur-sm relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose Solar Energy?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transform your business with clean, reliable energy that protects against load shedding and reduces
              operational costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Reduce Costs</h3>
                <p className="text-slate-600">Cut electricity bills by up to 90% with premium solar installations.</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Load Shedding Protection</h3>
                <p className="text-slate-600">
                  Keep your business running during Eskom outages with reliable backup power.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Environmental Impact</h3>
                <p className="text-slate-600">Reduce your carbon footprint and contribute to a sustainable future.</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Premium Quality</h3>
                <p className="text-slate-600">
                  Industry-leading panels with 25-year warranties and expert installation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Solar Solutions */}
      <section className="py-32 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Solar Solutions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive solar panel systems designed for South African businesses of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all rounded-3xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Commercial Solar</h3>
                <p className="text-slate-600 mb-6">
                  Complete solar solutions for offices, warehouses, and retail spaces. Includes battery backup and
                  monitoring systems.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 10kW - 100kW+ systems</li>
                  <li>• Battery backup included</li>
                  <li>• Real-time monitoring</li>
                  <li>• 25-year warranty</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 bg-white/90 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all rounded-3xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Industrial Solar</h3>
                <p className="text-slate-600 mb-6">
                  Large-scale solar installations for manufacturing and industrial facilities with high energy demands.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 100kW - 1MW+ systems</li>
                  <li>• Grid-tie capabilities</li>
                  <li>• Load management</li>
                  <li>• Custom engineering</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 bg-white/90 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all rounded-3xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Solar Financing</h3>
                <p className="text-slate-600 mb-6">
                  Flexible financing options including leasing, PPA agreements, and government incentive assistance.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Zero upfront costs</li>
                  <li>• Flexible payment terms</li>
                  <li>• Tax incentive assistance</li>
                  <li>• ROI guarantees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Ready to Start Saving with Solar?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of South African businesses already saving money and protecting against load shedding with our
            premium solar solutions.
          </p>
          <div className="flex justify-center">
            <a href="/calculate">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Try Interactive Calculator
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/95 backdrop-blur-sm text-white py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">SolarCalc SA</h3>
                  <p className="text-xs text-slate-400">Premium Solar Solutions</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                South Africa's leading solar panel provider, helping businesses reduce costs and protect against load
                shedding.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Commercial Solar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Industrial Solar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Solar Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Financing Options
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/company/solarcalc-sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/solarcalc_sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              <p className="text-slate-400 text-sm mt-4">Follow us for solar tips and industry updates</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>
              &copy; 2024 SolarCalc SA. All rights reserved. | Helping South African businesses go solar since 2020.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
