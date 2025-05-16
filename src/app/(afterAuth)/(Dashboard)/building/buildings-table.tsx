"use client"

import { Building, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import Link from "next/link"

// Dummy data - replace with actual data fetching
const buildings = [
  {
    id: "1",
    name: "Crystal Tower",
    address: "123 Main St",
    totalFloors: 12,
    totalRooms: 48,
    occupancyRate: "85%",
    status: "active",
  },
  {
    id: "2",
    name: "Sunset Apartments",
    address: "456 Park Ave",
    totalFloors: 8,
    totalRooms: 32,
    occupancyRate: "92%",
    status: "active",
  },
  // Add more buildings...
]

export function BuildingsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Floors</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead>Occupancy</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.map((building) => (
            <TableRow key={building.id}>
              <TableCell className="font-medium">
                <Link href={`/building/${building.id}`} className="flex items-center gap-2 hover:underline">
                  <Building className="h-4 w-4" />
                  {building.name}
                </Link>
              </TableCell>
              <TableCell>{building.address}</TableCell>
              <TableCell>{building.totalFloors}</TableCell>
              <TableCell>{building.totalRooms}</TableCell>
              <TableCell>{building.occupancyRate}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                  {building.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

