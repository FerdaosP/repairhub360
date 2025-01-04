import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Edit, Eye, Printer, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { CreateTicketForm } from "./CreateTicketForm"
import { ViewTicketDialog } from "./ViewTicketDialog"
import { EditTicketDialog } from "./EditTicketDialog"

interface Ticket {
  id: string
  customer_id: string
  device_type: string
  device_model: string
  serial_number: string | null
  issue_description: string
  diagnosis: string | null
  solution: string | null
  status: string
  technician_id: string | null
  estimated_cost: number | null
  final_cost: number | null
  created_at: string
  updated_at: string
  customer: {
    first_name: string
    last_name: string
    phone: string
  }
}

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('repair_tickets')
        .select(`
          *,
          customer:customers(first_name, last_name, phone)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('repair_tickets')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTickets(tickets.filter(ticket => ticket.id !== id))
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      })
    }
  }

  const filteredTickets = tickets.filter(ticket => 
    ticket.customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.device_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.issue_description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Repair Tickets</h2>
          <p className="text-muted-foreground">
            Manage repair tickets and track their status
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Ticket</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Repair Ticket</DialogTitle>
              <DialogDescription>
                Enter the repair ticket details below
              </DialogDescription>
            </DialogHeader>
            <CreateTicketForm onSuccess={() => {
              fetchTickets()
              toast({
                title: "Success",
                description: "Ticket created successfully",
              })
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  {ticket.customer.first_name} {ticket.customer.last_name}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {ticket.customer.phone}
                  </span>
                </TableCell>
                <TableCell>
                  {ticket.device_model}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {ticket.device_type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${ticket.status === 'completed' ? 'bg-green-100 text-green-700' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'}`}>
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTicket(ticket)
                        setShowViewDialog(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTicket(ticket)
                        setShowEditDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // TODO: Implement print functionality
                        toast({
                          title: "Coming Soon",
                          description: "Print functionality will be added soon",
                        })
                      }}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showViewDialog && selectedTicket && (
        <ViewTicketDialog
          ticket={selectedTicket}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}

      {showEditDialog && selectedTicket && (
        <EditTicketDialog
          ticket={selectedTicket}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={() => {
            fetchTickets()
            toast({
              title: "Success",
              description: "Ticket updated successfully",
            })
          }}
        />
      )}
    </div>
  )
}