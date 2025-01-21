"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Stepper } from "@/components/business/stepper"
import { CountrySelection } from "@/components/business/country-selection"
import { PackageSelection } from "@/components/business/package-selection"
import { CompanyDetails } from "@/components/business/company-details"
import { OwnerInformation } from "@/components/business/owner-information"
import { AddressDetails } from "@/components/business/address-details"
import { Review } from "@/components/business/review"
import { Payment } from "@/components/business/payment"
import { Building } from "lucide-react"

interface FormData {
  country?: {
    name: string
  }
  package?: {
    name: string
    price: number
  }
  company?: {
    name: string
    type: string
    industry: string
  }
  owner?: Array<{
    id: string
    fullName: string
    ownership: string
    isCEO?: boolean
    birthDate?: string
    document?: File | null
  }>
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

const steps = [
  { id: 1, name: "Country", description: "Select country" },
  { id: 2, name: "Package", description: "Choose package" },
  { id: 3, name: "Company", description: "Company details" },
  { id: 4, name: "Owner", description: "Owner information" },
  { id: 5, name: "Address", description: "Address details" },
  { id: 6, name: "Review", description: "Review details" },
  { id: 7, name: "Payment", description: "Complete payment" },
  { id: 8, name: "Complete", description: "Registration complete" },
]

export default function BusinessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showRegistration = searchParams.get("register") === "true"
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({})
  const [hasRegisteredBusiness, setHasRegisteredBusiness] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = sessionStorage.getItem("businessRegistrationStep")
      const savedData = sessionStorage.getItem("businessRegistrationData")

      if (savedStep) {
        setCurrentStep(Number.parseInt(savedStep, 10))
      }

      if (savedData) {
        setFormData(JSON.parse(savedData))
      }

      if (savedStep || savedData) {
        router.push("/dashboard/business?register=true")
      }
    }
  }, [router])

  useEffect(() => {
    if (showRegistration) {
      setCurrentStep((prevStep) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("businessRegistrationStep", prevStep.toString())
        }
        return prevStep
      })
    }
  }, [showRegistration])

  const handleNext = (stepData: any) => {
    setFormData((prev) => {
      const newData = { ...prev }

      switch (currentStep) {
        case 1:
          newData.country = {
            name: stepData.name,
          }
          break
        case 2:
          newData.package = {
            name: stepData.name,
            price: stepData.price,
          }
          break
        case 3:
          newData.company = {
            name: stepData.name,
            type: stepData.type,
            industry: stepData.industry,
          }
          break
        case 4:
          // Handle owner data with new fields
          newData.owner = stepData.map((owner: any) => ({
            id: owner.id,
            fullName: owner.fullName,
            ownership: owner.ownership,
            isCEO: owner.isCEO,
            birthDate: owner.birthDate,
            document: owner.document,
          }))
          break
        case 5:
          newData.address = {
            street: stepData.street,
            city: stepData.city,
            state: stepData.state,
            postalCode: stepData.postalCode,
            country: stepData.country,
          }
          break
        default:
          Object.assign(newData, stepData)
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("businessRegistrationData", JSON.stringify(newData))
      }
      return newData
    })
    setCurrentStep((prev) => {
      const newStep = prev + 1
      if (typeof window !== "undefined") {
        sessionStorage.setItem("businessRegistrationStep", newStep.toString())
      }
      return newStep
    })
  }

  const handleBack = () => {
    if (currentStep === 1) {
      router.push("/dashboard/business")
    } else {
      setCurrentStep((prev) => {
        const newStep = prev - 1
        if (typeof window !== "undefined") {
          sessionStorage.setItem("businessRegistrationStep", newStep.toString())
        }
        return newStep
      })
    }
  }

  const handleEdit = (step: number) => {
    setCurrentStep(step)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("businessRegistrationStep", step.toString())
    }
  }

  const handlePaymentComplete = () => {
    setHasRegisteredBusiness(true)
    setCurrentStep(8)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("businessRegistrationData")
      sessionStorage.removeItem("businessRegistrationStep")
    }
  }

  const renderRegistrationStep = () => {
    switch (currentStep) {
      case 1:
        return <CountrySelection onNext={handleNext} initialData={formData.country} />
      case 2:
        return <PackageSelection onNext={handleNext} onBack={handleBack} initialData={formData.package} />
      case 3:
        return <CompanyDetails onNext={handleNext} onBack={handleBack} initialData={formData.company} />
      case 4:
        return <OwnerInformation onNext={handleNext} onBack={handleBack} initialData={formData.owner} />
      case 5:
        return <AddressDetails onNext={handleNext} onBack={handleBack} initialData={formData.address} />
      case 6:
        return (
          <Review
            data={formData as Required<FormData>}
            onNext={() => setCurrentStep(7)}
            onBack={handleBack}
            onEdit={handleEdit}
          />
        )
      case 7:
        return <Payment amount={formData.package?.price || 0} onComplete={handlePaymentComplete} onBack={handleBack} />
      case 8:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Registration Complete!
            </h2>
            <p className="text-gray-600 mb-6">Thank you for registering your business with us.</p>
            <Button
              onClick={() => router.push("/dashboard/business")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Go to Business Dashboard
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const renderBusinessDashboard = () => {
    if (!hasRegisteredBusiness) {
      return (
        <Card>
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
              onClick={() => router.push("/dashboard/business?register=true")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Building className="mr-2 h-4 w-4" />
              Start Business Registration
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Business Overview
            </CardTitle>
            <CardDescription>Key information about your registered business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.company && (
                <div>
                  <h3 className="font-medium text-gray-900">{formData.company.name}</h3>
                  <p className="text-gray-500">Type: {formData.company.type}</p>
                  <p className="text-gray-500">Industry: {formData.company.industry}</p>
                </div>
              )}
              {formData.owner && formData.owner.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900">Ownership Structure</h3>
                  <div className="mt-2 space-y-2">
                    {formData.owner.map((owner) => (
                      <p key={owner.id} className="text-gray-500">
                        {owner.fullName} - {owner.ownership}%{owner.isCEO && " (CEO)"}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {showRegistration ? (
          <>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Business Registration
              </h1>
              <p className="text-gray-500 mt-2">Complete the following steps to register your business.</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Stepper steps={steps} currentStep={currentStep} />
                <div className="mt-8">{renderRegistrationStep()}</div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Business
              </h1>
              <p className="text-gray-500 mt-2">Manage and overview your business details.</p>
            </div>
            {renderBusinessDashboard()}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

