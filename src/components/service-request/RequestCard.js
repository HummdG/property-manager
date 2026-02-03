import { MapPin, Calendar, User, Wrench } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'

export function RequestCard({ request, onClick }) {
  return (
    <Card
      className="border-slate-200 bg-white hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick?.(request)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority}
              </Badge>
              <Badge className={getStatusColor(request.status)}>
                {request.status.replace('_', ' ')}
              </Badge>
            </div>
            <h3 className="font-bold text-blue-950 truncate group-hover:text-amber-600 transition-colors">{request.title}</h3>
            <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">{request.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
            <span className="truncate max-w-[150px] font-medium">{request.property?.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 text-blue-500" />
            <span>{request.category?.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>

        {request.jobAssignment?.trader && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
              <User className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <span className="text-sm text-slate-500">
              Assigned to: <span className="font-semibold text-blue-950">{request.jobAssignment.trader.name}</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
