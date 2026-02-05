'use client'

import { useState } from 'react'
import { Loader2, ScrollText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'

const termsContent = `
TERMS AND CONDITIONS FOR REAL ESTATE AGENT SERVICES

Last Updated: January 2026

1. ACCEPTANCE OF TERMS

By subscribing to our Agent Services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not subscribe to or use our services.

2. SERVICE DESCRIPTION

Our platform provides real estate agents with tools to:
- Manage client inquiries (rent, sale, and maintenance)
- Track daily activities and location logs
- Manage third-party property listings
- Access analytics and reporting features

3. SUBSCRIPTION AND PAYMENT

3.1 Subscription Plans: We offer various subscription plans with different features and pricing. Details of each plan are available on our pricing page.

3.2 Payment: Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law.

3.3 Auto-Renewal: Subscriptions automatically renew unless cancelled before the renewal date.

4. AGENT RESPONSIBILITIES

4.1 You must maintain accurate and current information in your profile.

4.2 You are responsible for all activities conducted through your account.

4.3 You must comply with all applicable real estate laws and regulations in your jurisdiction.

4.4 You must maintain appropriate licensing as required by your local regulatory authority.

5. DATA AND PRIVACY

5.1 You agree to handle all client data in accordance with applicable data protection laws.

5.2 You must obtain necessary consents before collecting and processing client information.

5.3 We may collect and process data about your use of the platform as described in our Privacy Policy.

6. THIRD-PARTY LISTINGS

6.1 Listing fees for third-party platforms (Airbnb, Property Finder, etc.) are separate from subscription fees.

6.2 You are responsible for ensuring compliance with each platform's terms of service.

6.3 We are not liable for any issues arising from third-party platform listings.

7. LOCATION TRACKING

7.1 Location tracking features are optional and require your explicit consent.

7.2 Location data is used for activity logging and reporting purposes.

7.3 You may disable location tracking at any time through your account settings.

8. LIMITATION OF LIABILITY

8.1 Our platform is provided "as is" without warranties of any kind.

8.2 We are not liable for any indirect, incidental, or consequential damages.

8.3 Our total liability shall not exceed the subscription fees paid in the preceding 12 months.

9. TERMINATION

9.1 You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.

9.2 We may suspend or terminate your account for violation of these terms.

10. GOVERNING LAW

These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates.

11. CONTACT

For questions about these terms, please contact support@goforproperties.com.
`

export function TermsModal({ open, onOpenChange, onAccept, isLoading }) {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setHasScrolled(true)
    }
  }

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      await onAccept()
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div
            onScroll={handleScroll}
            className="h-[400px] overflow-y-auto pr-4 text-sm text-slate-600 whitespace-pre-line"
          >
            {termsContent}
          </div>
        </div>

        {!hasScrolled && (
          <p className="text-xs text-amber-600 text-center py-2">
            Please scroll to read all terms before accepting
          </p>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAccepting || isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!hasScrolled || isAccepting || isLoading}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            {isAccepting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'I Accept the Terms'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

