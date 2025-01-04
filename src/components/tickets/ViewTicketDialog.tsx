import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ViewTicketDialogProps {
  ticket: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewTicketDialog({ ticket, open, onOpenChange }: ViewTicketDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Customer</div>
            <div className="col-span-3">
              {ticket.customer.first_name} {ticket.customer.last_name}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Phone</div>
            <div className="col-span-3">{ticket.customer.phone}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Device</div>
            <div className="col-span-3">
              {ticket.device_model} ({ticket.device_type})
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Serial Number</div>
            <div className="col-span-3">{ticket.serial_number || "N/A"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Issue</div>
            <div className="col-span-3">{ticket.issue_description}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Status</div>
            <div className="col-span-3">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                ${ticket.status === 'completed' ? 'bg-green-100 text-green-700' :
                  ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'}`}>
                {ticket.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Created</div>
            <div className="col-span-3">
              {new Date(ticket.created_at).toLocaleString()}
            </div>
          </div>
          {ticket.diagnosis && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Diagnosis</div>
              <div className="col-span-3">{ticket.diagnosis}</div>
            </div>
          )}
          {ticket.solution && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Solution</div>
              <div className="col-span-3">{ticket.solution}</div>
            </div>
          )}
          {ticket.estimated_cost && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Estimated Cost</div>
              <div className="col-span-3">${ticket.estimated_cost}</div>
            </div>
          )}
          {ticket.final_cost && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Final Cost</div>
              <div className="col-span-3">${ticket.final_cost}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}