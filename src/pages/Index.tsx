import React from "react";
import { Card } from "@/components/ui/card";
import {
  Wrench,
  UserCheck,
  Package,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const stats = [
  {
    label: "Active Repairs",
    value: "24",
    icon: Wrench,
    trend: "+12%",
    trendUp: true,
  },
  {
    label: "Customers",
    value: "1,234",
    icon: UserCheck,
    trend: "+3.2%",
    trendUp: true,
  },
  {
    label: "Inventory Items",
    value: "856",
    icon: Package,
    trend: "-2.1%",
    trendUp: false,
  },
  {
    label: "Revenue (MTD)",
    value: "$12,345",
    icon: DollarSign,
    trend: "+8.1%",
    trendUp: true,
  },
];

const recentTickets = [
  {
    id: "T-1234",
    customer: "John Doe",
    device: "iPhone 13 Pro",
    issue: "Screen Replacement",
    status: "In Progress",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    id: "T-1233",
    customer: "Jane Smith",
    device: "Samsung S21",
    issue: "Battery Replacement",
    status: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    id: "T-1232",
    customer: "Mike Johnson",
    device: "iPad Air",
    issue: "Won't Power On",
    status: "Pending",
    icon: AlertCircle,
    color: "text-orange-500",
  },
  {
    id: "T-1231",
    customer: "Sarah Williams",
    device: "MacBook Pro",
    issue: "Keyboard Issue",
    status: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
];

const Dashboard = () => {
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Last updated: Just now</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="relative overflow-hidden p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-brand-50 text-brand-600"
                )}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div
              className={cn(
                "mt-4 inline-flex items-center text-sm",
                stat.trendUp ? "text-green-600" : "text-red-600"
              )}
            >
              {stat.trend}
              <span className="ml-2 text-gray-500">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Tickets */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Tickets
        </h2>
        <div className="divide-y">
          {recentTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-gray-50",
                    ticket.color
                  )}
                >
                  <ticket.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {ticket.customer}
                    <span className="ml-2 text-sm text-gray-500">
                      {ticket.id}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {ticket.device} - {ticket.issue}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm",
                  ticket.status === "Completed"
                    ? "bg-green-50 text-green-700"
                    : ticket.status === "In Progress"
                    ? "bg-yellow-50 text-yellow-700"
                    : ticket.status === "Pending"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-red-50 text-red-700"
                )}
              >
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;