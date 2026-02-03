import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreditCard, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'

async function getPayments(userId) {
  return db.payment.findMany({
    where: {
      serviceRequest: {
        property: { ownerId: userId }
      }
    },
    include: {
      serviceRequest: {
        include: {
          property: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function OwnerPaymentsPage() {
  const session = await auth()
  const payments = await getPayments(session.user.id)

  const totalPaid = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)

  function getPaymentStatusColor(status) {
    const colors = {
      PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
      REFUNDED: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
    return colors[status] || 'bg-slate-500/10 text-slate-400'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Payments</h1>
        <p className="text-slate-400 mt-1">Track payments for service requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <CreditCard className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Paid</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <CreditCard className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10">
                <FileText className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-100">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments list */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-slate-700 mx-auto" />
              <p className="text-slate-500 mt-4">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-lg bg-slate-800/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-200 truncate">
                      {payment.description || payment.serviceRequest?.property?.name}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getPaymentStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                    <p className="font-semibold text-slate-100">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

