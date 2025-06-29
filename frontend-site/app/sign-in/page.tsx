"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Mail,
  Lock,
  Building2,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      
      // Redirect to calculator page after successful login
      router.push("/calculate");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: "admin@example.com", role: "admin", password: "password123" },
    { email: "org@example.com", role: "organization", password: "password123" },
    { email: "applicant@example.com", role: "applicant", password: "password123" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-white/80"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SolarCalc SA</h1>
              <p className="text-xs text-slate-600">Premium Solar Solutions</p>
            </div>
          </Link>
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-800 transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form */}
            <div className="order-2 lg:order-1">
              <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-3xl">
                <CardHeader className="space-y-2 pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                      <Building2 className="w-4 h-4 mr-1" /> Sales Agent Portal
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-center text-slate-800">
                    Welcome Back
                  </CardTitle>
                  <p className="text-slate-600 text-center">
                    Sign in to access the professional solar calculator
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-600">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center text-sm font-medium">
                        <Mail className="w-4 h-4 text-amber-600 mr-1" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center text-sm font-medium">
                        <Lock className="w-4 h-4 text-amber-600 mr-1" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                      {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>

                  {/* Demo Accounts */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Demo Accounts:</h4>
                    <div className="space-y-2">
                      {demoAccounts.map((account, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setEmail(account.email);
                            setPassword(account.password);
                          }}
                          className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-800">{account.email}</p>
                              <p className="text-xs text-slate-500 capitalize">{account.role} access</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Features */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Professional Solar
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    Sales Platform
                  </span>
                </h2>
                <p className="text-lg text-slate-600 max-w-lg">
                  Empower your sales presentations with accurate calculations, compelling visualizations, and professional reporting.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Real-Time Calculations</h3>
                    <p className="text-slate-600">
                      Instant ROI calculations with South African tariff structures and weather data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Client Presentations</h3>
                    <p className="text-slate-600">
                      Professional reports and visualizations that build confidence and close deals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Load Shedding Protection</h3>
                    <p className="text-slate-600">
                      Calculate backup power requirements and demonstrate value during outages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                <div className="flex items-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mr-2" />
                  <h4 className="font-semibold text-amber-800">Ready to Use</h4>
                </div>
                <p className="text-amber-700 text-sm">
                  Pre-configured with optimal defaults for South African market conditions. Just enter client-specific details and present immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}