'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'

export function PlanSelector({ plans, currentPlanId, onSelect, isLoading }) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlanId || null)
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const handleSelect = (planId) => {
    setSelectedPlan(planId)
  }

  const handleSubscribe = () => {
    if (selectedPlan) {
      onSelect(selectedPlan, billingPeriod)
    }
  }

  return (
    <div className="space-y-6">
      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-all',
              billingPeriod === 'monthly'
                ? 'bg-white text-blue-950 shadow-sm'
                : 'text-slate-600 hover:text-blue-950'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-all',
              billingPeriod === 'yearly'
                ? 'bg-white text-blue-950 shadow-sm'
                : 'text-slate-600 hover:text-blue-950'
            )}
          >
            Yearly
            <span className="ml-1 text-xs text-emerald-600">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const isCurrent = currentPlanId === plan.id
          const price = billingPeriod === 'yearly' && plan.yearlyPrice
            ? plan.yearlyPrice / 12
            : plan.monthlyPrice

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative cursor-pointer transition-all duration-200',
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-200 shadow-lg'
                  : 'border-slate-200 hover:border-amber-200 hover:shadow-md'
              )}
              onClick={() => handleSelect(plan.id)}
            >
              {/* Popular badge */}
              {plan.sortOrder === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-blue-950 flex items-center justify-between">
                  {plan.name}
                  {isCurrent && (
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </CardTitle>
                {plan.description && (
                  <p className="text-sm text-slate-500">{plan.description}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-950">
                      {formatCurrency(price)}
                    </span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  {billingPeriod === 'yearly' && plan.yearlyPrice && (
                    <p className="text-xs text-slate-400 mt-1">
                      Billed as {formatCurrency(plan.yearlyPrice)} annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {plan.maxInquiries ? `${plan.maxInquiries} inquiries/month` : 'Unlimited inquiries'}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {plan.maxThirdPartyPlatforms > 0
                      ? `${plan.maxThirdPartyPlatforms} third-party platforms`
                      : 'Basic features'}
                  </li>
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Selection indicator */}
                <div className={cn(
                  'h-10 rounded-lg border-2 flex items-center justify-center transition-all',
                  isSelected
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-slate-200'
                )}>
                  {isSelected ? (
                    <Check className="h-5 w-5 text-amber-600" />
                  ) : (
                    <span className="text-sm text-slate-400">Select plan</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Subscribe button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubscribe}
          disabled={!selectedPlan || isLoading}
          className="px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : selectedPlan === currentPlanId ? (
            'Keep Current Plan'
          ) : (
            'Subscribe to Plan'
          )}
        </Button>
      </div>
    </div>
  )
}



