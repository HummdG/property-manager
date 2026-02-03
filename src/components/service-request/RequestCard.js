import { MapPin, Calendar, User, Wrench } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'

export function RequestCard({ request, onClick }) {
  return (
    <Card
      className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
      onClick={() => onClick?.(request)}
    >
      <CardContent className="p-4">
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
            <h3 className="font-semibold text-slate-100 truncate">{request.title}</h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{request.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-800 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[150px]">{request.property?.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            <span>{request.category?.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>

        {request.jobAssignment?.trader && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
            <User className="h-4 w-4 text-teal-400" />
            <span className="text-sm text-slate-400">
              Assigned to: <span className="text-slate-200">{request.jobAssignment.trader.name}</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

