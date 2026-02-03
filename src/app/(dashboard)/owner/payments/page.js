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
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
      COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      FAILED: 'bg-red-100 text-red-700 border-red-200',
      REFUNDED: 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return colors[status] || 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Payments</h1>
        <p className="text-slate-500 mt-1">Track payments for service requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Paid</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-950">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments list */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mx-auto">
                <CreditCard className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 mt-4 font-medium">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-blue-950 truncate">
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
                    <p className="font-bold text-blue-950">
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
