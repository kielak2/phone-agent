
"use client"

import { useState } from "react"
import {
  CalendarDays,
  Phone,
  ShoppingCart,
  Users,
  Play,
  Pause,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Mock data
const callsData = [
  {
    id: "1",
    phoneNumber: "+1-555-0123",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerAddress: "123 Main St, New York, NY 10001",
    date: "2024-01-15",
    time: "14:30",
    duration: "5:23",
    status: "completed",
    hasOrder: true,
    orderItems: ["2x Premium T-Shirt ($29.99 each)", "1x Baseball Cap ($19.99)"],
    orderTotal: "$79.97",
    processed: false,
    audioUrl: "/audio/call-1.mp3",
    transcript:
      "Hello, I'd like to place an order for two premium t-shirts in size large and one baseball cap in blue...",
  },
  {
    id: "2",
    phoneNumber: "+1-555-0124",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    customerAddress: "456 Oak Ave, Los Angeles, CA 90210",
    date: "2024-01-15",
    time: "16:45",
    duration: "3:12",
    status: "completed",
    hasOrder: false,
    orderItems: [],
    orderTotal: "$0.00",
    processed: true,
    audioUrl: "/audio/call-2.mp3",
    transcript: "Hi, I was calling to ask about your return policy...",
  },
  {
    id: "3",
    phoneNumber: "+1-555-0125",
    customerName: "Mike Davis",
    customerEmail: "mike@example.com",
    customerAddress: "789 Pine St, Chicago, IL 60601",
    date: "2024-01-14",
    time: "11:20",
    duration: "7:45",
    status: "completed",
    hasOrder: true,
    orderItems: ["1x Wireless Headphones ($149.99)", "1x Phone Case ($24.99)"],
    orderTotal: "$174.98",
    processed: true,
    audioUrl: "/audio/call-3.mp3",
    transcript: "I'd like to order the wireless headphones I saw on your website...",
  },
]

const phoneNumbers = [
  { number: "+1-555-0123", label: "Main Store Line", active: true },
  { number: "+1-555-0124", label: "Customer Support", active: true },
  { number: "+1-555-0125", label: "Orders Only", active: false },
]

export default function Dashboard() {
  const [selectedCall, setSelectedCall] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [isPlaying, setIsPlaying] = useState(false)

  const filteredCalls = callsData.filter((call) => {
    if (filterStatus === "all") return true
    if (filterStatus === "orders") return call.hasOrder
    if (filterStatus === "processed") return call.processed
    if (filterStatus === "unprocessed") return !call.processed
    return true
  })

  const stats = {
    totalCalls: callsData.length,
    totalOrders: callsData.filter((call) => call.hasOrder).length,
    unprocessedCalls: callsData.filter((call) => !call.processed).length,
    totalRevenue: callsData.reduce((sum, call) => sum + Number.parseFloat(call.orderTotal.replace("$", "")), 0),
  }

  const toggleProcessed = (callId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggling processed status for call ${callId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-muted/40 border-r min-h-screen p-6">
          <div className="flex items-center gap-2 mb-8">
            <Phone className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">AI Phone Orders</h1>
          </div>

          <nav className="space-y-2">
            <Button variant="default" className="w-full justify-start">
              <CalendarDays className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Phone className="mr-2 h-4 w-4" />
              Phone Numbers
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Customers
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Monitor your AI phone orders and customer interactions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCalls}</div>
                <p className="text-xs text-muted-foreground">+2 from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders Placed</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.totalOrders / stats.totalCalls) * 100).toFixed(1)}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unprocessed</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unprocessedCalls}</div>
                <p className="text-xs text-muted-foreground">Calls requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From phone orders</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="calls" className="space-y-4">
            <TabsList>
              <TabsTrigger value="calls">Call History</TabsTrigger>
              <TabsTrigger value="phones">Phone Numbers</TabsTrigger>
            </TabsList>

            <TabsContent value="calls" className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="filter">Filter:</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter calls" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Calls</SelectItem>
                      <SelectItem value="orders">Orders Only</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="unprocessed">Unprocessed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="Search calls..." className="max-w-sm" />
              </div>

              {/* Calls Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Calls</CardTitle>
                  <CardDescription>All incoming calls and their details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCalls.map((call) => (
                        <TableRow key={call.id}>
                          <TableCell>
                            <div className="font-medium">{call.date}</div>
                            <div className="text-sm text-muted-foreground">{call.time}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{call.customerName}</div>
                            <div className="text-sm text-muted-foreground">{call.customerEmail}</div>
                          </TableCell>
                          <TableCell>{call.phoneNumber}</TableCell>
                          <TableCell>{call.duration}</TableCell>
                          <TableCell>
                            {call.hasOrder ? (
                              <Badge variant="default">{call.orderTotal}</Badge>
                            ) : (
                              <Badge variant="secondary">No Order</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {call.processed ? (
                                <Badge variant="default" className="bg-green-500">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Processed
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedCall(call)}>
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Call Details - {call.customerName}</DialogTitle>
                                    <DialogDescription>
                                      {call.date} at {call.time} • Duration: {call.duration}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="grid gap-6">
                                    {/* Customer Info */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Customer Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-sm font-medium">Name</Label>
                                            <p className="text-sm">{call.customerName}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">Email</Label>
                                            <p className="text-sm">{call.customerEmail}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Shipping Address</Label>
                                          <p className="text-sm">{call.customerAddress}</p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Order Details */}
                                    {call.hasOrder && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Order Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2">
                                            {call.orderItems.map((item, index) => (
                                              <div key={index} className="text-sm">
                                                {item}
                                              </div>
                                            ))}
                                          </div>
                                          <Separator className="my-4" />
                                          <div className="flex justify-between font-medium">
                                            <span>Total:</span>
                                            <span>{call.orderTotal}</span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Audio Player */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Call Recording</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center gap-4">
                                          <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            {isPlaying ? "Pause" : "Play"}
                                          </Button>
                                          <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                          </Button>
                                          <div className="flex-1 bg-muted h-2 rounded-full">
                                            <div className="bg-primary h-2 rounded-full w-1/3"></div>
                                          </div>
                                          <span className="text-sm text-muted-foreground">{call.duration}</span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Transcript */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Call Transcript</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <Textarea value={call.transcript} readOnly className="min-h-[100px]" />
                                      </CardContent>
                                    </Card>

                                    {/* Processing Status */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Processing Status</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            {call.processed ? (
                                              <Badge variant="default" className="bg-green-500">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Processed
                                              </Badge>
                                            ) : (
                                              <Badge variant="secondary">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending Processing
                                              </Badge>
                                            )}
                                          </div>
                                          <Button
                                            variant={call.processed ? "outline" : "default"}
                                            onClick={() => toggleProcessed(call.id)}
                                          >
                                            {call.processed ? "Mark as Unprocessed" : "Mark as Processed"}
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant={call.processed ? "outline" : "default"}
                                size="sm"
                                onClick={() => toggleProcessed(call.id)}
                              >
                                {call.processed ? "Unmark" : "Mark Done"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phone Numbers</CardTitle>
                  <CardDescription>Manage your AI-enabled phone numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phoneNumbers.map((phone, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{phone.number}</div>
                          <div className="text-sm text-muted-foreground">{phone.label}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={phone.active ? "default" : "secondary"}>
                            {phone.active ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      + Add New Phone Number
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
