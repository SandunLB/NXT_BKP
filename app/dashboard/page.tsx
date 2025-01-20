"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Users, Activity, ArrowUpRight, ArrowDownRight, Building } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [hasRegisteredBusiness, setHasRegisteredBusiness] = useState<boolean | null>(null)

  useEffect(() => {
    const checkBusinessRegistration = setTimeout(() => {
      setHasRegisteredBusiness(false)
    }, 1000)

    return () => clearTimeout(checkBusinessRegistration)
  }, [])

  if (loading || hasRegisteredBusiness === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/signin")
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user.displayName || user.email?.split("@")[0]}
          </h1>
          <p className="text-gray-500 mt-2">Here's what's happening with your business today.</p>
        </div>

        {!hasRegisteredBusiness ? (
          <Card className="border border-indigo-100 hover:border-indigo-200 transition-colors">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Register Your Business
              </CardTitle>
              <CardDescription>Start your business journey by registering your company with us.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Registering your business is the first step towards growth and success. Our streamlined process makes it
                easy to get started.
              </p>
              <Button 
                onClick={() => router.push('/dashboard/business?register=true')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Building className="mr-2 h-4 w-4" />
                Start Business Registration
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border border-indigo-100 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-indigo-600">Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +20.1% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-100 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-indigo-600">Customers</CardTitle>
                <Users className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +180.1% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-100 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-indigo-600">Active Now</CardTitle>
                <Activity className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <div className="flex items-center text-sm text-red-500 mt-1">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  -201 since last hour
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-indigo-100 hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Recent Activity
              </CardTitle>
              <CardDescription>Your most recent transactions and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    <div className="flex-1">New customer signed up</div>
                    <div className="text-gray-500">2 min ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-indigo-100 hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center gap-4 rounded-lg border border-indigo-100 p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors cursor-pointer">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">Process Payment</div>
                    <div className="text-sm text-gray-500">Accept payments from customers</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border border-indigo-100 p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors cursor-pointer">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">Add Customer</div>
                    <div className="text-sm text-gray-500">Create a new customer profile</div>
                  </div>
                </div>
                {!hasRegisteredBusiness && (
                  <div
                    className="flex items-center gap-4 rounded-lg border border-indigo-100 p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors cursor-pointer"
                    onClick={() => router.push("/dashboard/business/register")}
                  >
                    <Building className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="font-medium">Register Business</div>
                      <div className="text-sm text-gray-500">Start your business registration process</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}