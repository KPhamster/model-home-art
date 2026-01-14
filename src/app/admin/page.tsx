"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList, Download, Search, Eye, MoreHorizontal,
  TrendingUp, Users, DollarSign, Package
} from "lucide-react";

// Placeholder data
const quoteRequests = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    category: "jersey",
    status: "NEW",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    category: "diploma",
    status: "IN_PROGRESS",
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    category: "fine-art",
    status: "QUOTED",
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    category: "photo",
    status: "CLOSED",
    createdAt: "2024-01-12T16:45:00Z",
  },
];

const stats = [
  { title: "New Quotes", value: "12", change: "+3", icon: ClipboardList },
  { title: "This Week", value: "28", change: "+8", icon: TrendingUp },
  { title: "Customers", value: "156", change: "+12", icon: Users },
  { title: "Revenue", value: "$4,250", change: "+$850", icon: DollarSign },
];

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  QUOTED: "bg-purple-100 text-purple-800",
  ACCEPTED: "bg-green-100 text-green-800",
  CLOSED: "bg-stone-100 text-stone-800",
};

export default function AdminPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuotes = quoteRequests.filter((quote) => {
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    const matchesSearch =
      quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExport = () => {
    // In production, this would generate and download a CSV
    const csv = [
      ["ID", "Name", "Email", "Category", "Status", "Created"],
      ...filteredQuotes.map((q) => [
        q.id,
        q.name,
        q.email,
        q.category,
        q.status,
        new Date(q.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quote-requests.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-wide py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage quote requests and orders
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="w-8 h-8 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="quotes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
            <TabsTrigger value="business">Business Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Quote Requests</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="QUOTED">Quoted</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{quote.name}</p>
                            <p className="text-sm text-muted-foreground">{quote.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{quote.category}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[quote.status]}>
                            {quote.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/quotes/${quote.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredQuotes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No quote requests found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4" />
                <p>Order management coming soon.</p>
                <p className="text-sm">Integrate with Stripe for order tracking.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-4" />
                <p>Contact messages will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>Business inquiries will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
