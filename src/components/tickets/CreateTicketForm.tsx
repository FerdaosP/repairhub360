import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface Customer {
  id: string
  first_name: string
  last_name: string
}

const formSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  device_type: z.enum(["phone", "tablet", "laptop", "desktop", "other"]),
  device_model: z.string().min(1, "Device model is required"),
  serial_number: z.string().optional(),
  issue_description: z.string().min(1, "Issue description is required"),
  estimated_cost: z.string().optional(),
})

interface CreateTicketFormProps {
  onSuccess: () => void
}

export function CreateTicketForm({ onSuccess }: CreateTicketFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, first_name, last_name')
        .order('first_name')
      
      if (error) {
        console.error('Error fetching customers:', error)
        return
      }

      setCustomers(data || [])
    }

    fetchCustomers()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      device_type: "phone",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('repair_tickets')
        .insert({
          customer_id: values.customer_id,
          device_type: values.device_type,
          device_model: values.device_model,
          serial_number: values.serial_number || null,
          issue_description: values.issue_description,
          estimated_cost: values.estimated_cost ? parseFloat(values.estimated_cost) : null,
          status: 'pending'
        })

      if (error) throw error

      form.reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="device_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="device_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Model</FormLabel>
              <FormControl>
                <Input placeholder="e.g. iPhone 12 Pro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter serial number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issue_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimated_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Cost (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter estimated cost"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Ticket</Button>
      </form>
    </Form>
  )
}