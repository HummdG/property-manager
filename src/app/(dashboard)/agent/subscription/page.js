'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionCard, PlanSelector, TermsModal } from '@/components/agent'
import { useAgentStore } from '@/stores/agent-store'

export default function SubscriptionPage() {
  const {
    subscription,
    plans,
    tcAccepted,
    subscriptionLoading,
    setSubscription,
    setPlans,
    setTcAccepted,
    setSubscriptionLoading
  } = useAgentStore()

  const [error, setError] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState('monthly')

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    setSubscriptionLoading(true)
    setError('')

    try {
      const response = await fetch('/api/agent/subscription')
      if (!response.ok) throw new Error('Failed to fetch subscription data')

      const data = await response.json()
      setSubscription(data.subscription)
      setPlans(data.plans)
      setTcAccepted(data.tcAccepted)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubscriptionLoading(false)
    }
  }

  const handleAcceptTerms = async () => {
    try {
      const response = await fetch('/api/agent/subscription/accept-tc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: true })
      })

      if (!response.ok) throw new Error('Failed to accept terms')

      setTcAccepted(true)
      setShowTerms(false)

      // If a plan was selected before T&C, subscribe now
      if (selectedPlanId) {
        await handleSubscribe(selectedPlanId, selectedBillingPeriod)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSelectPlan = async (planId, billingPeriod) => {
    setSelectedPlanId(planId)
    setSelectedBillingPeriod(billingPeriod)

    // Check if T&C accepted
    if (!tcAccepted) {
      setShowTerms(true)
      return
    }

    await handleSubscribe(planId, billingPeriod)
  }

  const handleSubscribe = async (planId, billingPeriod) => {
    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/agent/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingPeriod })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to subscribe')
      }

      const data = await response.json()
      setSubscription(data.subscription)
      setSelectedPlanId(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of the current billing period.')) {
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/agent/subscription', {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to cancel subscription')

      const data = await response.json()
      setSubscription(data.subscription)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Subscription</h1>
        <p className="text-slate-500 mt-1">Manage your subscription plan and billing</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* T&C notice */}
      {!tcAccepted && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Terms & Conditions Required</p>
                <p className="text-sm text-amber-700 mt-1">
                  You must accept the terms and conditions before subscribing to a plan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current subscription */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-blue-950 mb-4">Current Plan</h2>
          <SubscriptionCard
            subscription={subscription}
            onManage={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
            onCancel={handleCancelSubscription}
          />
        </div>

        {/* Plan selector */}
        <div className="lg:col-span-2">
          <div id="plans-section">
            <h2 className="text-lg font-semibold text-blue-950 mb-4">Available Plans</h2>
            {plans.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-slate-400">
                  No subscription plans available at this time.
                </CardContent>
              </Card>
            ) : (
              <PlanSelector
                plans={plans}
                currentPlanId={subscription?.planId}
                onSelect={handleSelectPlan}
                isLoading={isProcessing}
              />
            )}
          </div>
        </div>
      </div>

      {/* Features comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-950">Inquiry Management</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Track rent, sale & maintenance inquiries</li>
                <li>• Follow-up scheduling & reminders</li>
                <li>• Client communication history</li>
                <li>• Status tracking & reporting</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-950">Activity Tracking</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Daily activity logging</li>
                <li>• GPS location tracking</li>
                <li>• Time tracking per activity</li>
                <li>• Performance analytics</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-950">Third-Party Listings</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Airbnb integration</li>
                <li>• Property Finder sync</li>
                <li>• Dubizzle listings</li>
                <li>• Fee tracking & management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms modal */}
      <TermsModal
        open={showTerms}
        onOpenChange={setShowTerms}
        onAccept={handleAcceptTerms}
        isLoading={isProcessing}
      />
    </div>
  )
}

