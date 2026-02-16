'use client'

import { Check, X, AlertCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusColors = {
  TRIAL: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PAST_DUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-600'
}

export function SubscriptionCard({ subscription, onManage, onCancel }) {
  if (!subscription) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-blue-950 mb-2">No Active Subscription</h3>
          <p className="text-sm text-slate-500 mb-4">
            Subscribe to access all features and manage your inquiries
          </p>
          <Button
            onClick={onManage}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            View Plans
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { plan, status, currentPeriodEnd, trialEndsAt, cancelAtPeriodEnd } = subscription

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-blue-950">{plan.name}</CardTitle>
            <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
          </div>
          <Badge className={statusColors[status]}>
            {status === 'TRIAL' && <Clock className="h-3 w-3 mr-1" />}
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pricing */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-blue-950">
            {formatCurrency(plan.monthlyPrice)}
          </span>
          <span className="text-slate-500">/month</span>
        </div>

        {/* Trial info */}
        {status === 'TRIAL' && trialEndsAt && (
          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <p className="text-blue-700">
              <Clock className="h-4 w-4 inline mr-1" />
              Trial ends on {formatDate(trialEndsAt)}
            </p>
          </div>
        )}

        {/* Cancel notice */}
        {cancelAtPeriodEnd && (
          <div className="p-3 bg-amber-50 rounded-lg text-sm">
            <p className="text-amber-700">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Your subscription will end on {formatDate(currentPeriodEnd)}
            </p>
          </div>
        )}

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-blue-950 text-sm">Plan Features:</h4>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <Check className="h-4 w-4 text-emerald-500" />
              {plan.maxInquiries ? `${plan.maxInquiries} inquiries/month` : 'Unlimited inquiries'}
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              {plan.maxThirdPartyPlatforms > 0 ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  {plan.maxThirdPartyPlatforms} third-party platforms
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-slate-300" />
                  No third-party platforms
                </>
              )}
            </li>
            {plan.features?.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Period info */}
        <div className="pt-4 border-t border-slate-100 text-sm text-slate-500">
          <p>Current period ends: {formatDate(currentPeriodEnd)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onManage} className="flex-1">
            Change Plan
          </Button>
          {!cancelAtPeriodEnd && (
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}



