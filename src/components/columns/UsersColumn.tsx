"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: number;
  name: string;
  email: string;
  totalFollowers: Number;
  totalFollowing: Number;
  createdAt :String;
  status: string;
};

export const UsersColumn : ColumnDef<User>[] = [
  {
    accessorKey: "_id",
    header: "Id"
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "totalFollowers",
    header: "Follower"
  },
  {
    accessorKey: "totalFollowing",
    header: "Following"
  },
  {
    accessorKey: "createdAt",
    cell: (info) => {
      const createdAt = info.getValue<string>();
      return format(new Date(createdAt), 'dd MMM, yy \'at\' h:mm a');
    },
    header: "Created At",
  },
  {
    accessorKey: "status",
    header: "Status"
  }
];