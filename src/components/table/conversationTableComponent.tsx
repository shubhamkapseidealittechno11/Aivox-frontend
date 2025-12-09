"use client";
import { useGetConversation } from "@/api/useGetConversation";
import { useDebounce } from "@/hooks/useDebounce";
import { User } from "@/types/Users";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table,
} from "@tanstack/react-table";
import { useState, useEffect, useRef } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { cn, formatName } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { titleCase } from "@/lib/utils";
// import AuthService from "@/api/auth/AuthService";
import agentsApi from "@/api/agentActionsApi";
import { useTheme } from "next-themes";
import { Badge } from "../ui/badge";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddAgentConfig from "../form/AddAgent";

const conversationTableComponent = () => {
    
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const { theme } = useTheme();
  // const { directLogout } = AuthService();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { deleteAgent } = agentsApi();
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [allAgents, setAllagents]: any = useState([]);
  const tableRef = useRef<Table<User> | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // column filters state of the table
  const [columnFilters, setColumnFilters]: any = useState<ColumnFiltersState>(
    []
  );
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(
    columnFilters,
    1000
  );

  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
  });

  const { allConversationData, isAllDataLoading }: any = useGetConversation({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination,
  });


  useEffect(() => {
    if (allConversationData?.error) {
      404 != allConversationData?.status &&
        toast({
          title: allConversationData?.errorMessage
            ? allConversationData?.errorMessage
            : "Uh oh! Something went wrong.",
          variant: "destructive",
          description: allConversationData?.error,
        });
      // (allAgentData?.status == 401 || allAgentData?.status == 403) &&
      //   directLogout();
    }
    setAllagents(allConversationData);
  }, [allConversationData, pathname]);

  //   async function updateData(data: any) {
  //     const status: any = data.status == "active" ? "inactive" : "active";
  //     Swal.fire({
  //       // title: status == "active" ? "Active" : "Inactive",
  //       text: `Are you sure you want to ${status} this user.`,
  //       showCancelButton: true,
  //          confirmButtonColor: `#DCEDC0`,
  //       cancelButtonColor: "white",
  //       icon: "warning",
  //       customClass: {
  //         popup: "max-w-full md:max-w-[400px] px-8 py-4 rounded-2xl",
  //         icon: "text-[9.275px] mt-[0!important]",
  //         htmlContainer:
  //           "px-[0!important] pb-[0!important] [font-size:16px!important]",
  //         actions: "-mx-5",
  //         confirmButton: '[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] text-black bg-btn !rounded-[24px] hover:!bg-none',
  //         cancelButton: `w-[calc(50%_-10px)] text-black border border-[#e2e8f0] border-solid px-[0!important] !rounded-[20px]`,
  //       },
  //       confirmButtonText: `Confirm ${
  //         data.status == "active" ? "Inactive" : "Active"
  //       }`,
  //     }).then(async (result: any) => {
  //       if (result.value) {
  //         await updateUser({ status: status, userId: data?.publicId })
  //           .then(async (res: any) => {
  //             if (!res.error) {
  //               const updatedUsers = allUsers?.results?.map((res: any) => {
  //                 if (data?.publicId == res?.publicId) {
  //                   res.status = status;
  //                   return res;
  //                 } else {
  //                   return res;
  //                 }
  //               });
  //               setAllUsers({ ...allUsers, results: updatedUsers });
  //               toast({
  //                 title: "Status updated sucessfully.",
  //                 description: res?.message,
  //               });
  //             } else {
  //               toast({
  //                 variant: "destructive",
  //                 title: "Uh oh! Something went wrong.",
  //                 description: res?.errorMessage,
  //               });
  //             }
  //           })
  //           .catch((err: any) => {
  //             toast({
  //               variant: "destructive",
  //               title: "Error occurred",
  //               description:
  //                 err?.message || "There was a problem with your request.",
  //             });
  //           });
  //       }
  //     });
  //   }

  //   // old delete code
  //   async function deleteData(data: any) {
  //     Swal.fire({
  //       text: `Are you sure you want to delete this user.`,
  //       showCancelButton: true,
  //            confirmButtonColor: `#DCEDC0`,
  //       cancelButtonColor: "white",
  //       confirmButtonText: "Confirm Delete",
  //       // icon: "warning",
  //        imageUrl: '/dlt.png',
  //       imageAlt: 'Custom image',
  //       imageWidth: 60,
  //       imageHeight: 60,
  //       customClass: {
  //         popup: "max-w-full md:max-w-[400px] px-8 py-4 rounded-2xl",
  //         icon: "text-[9.275px] mt-[0!important]",
  //         htmlContainer:
  //           "px-[0!important] pb-[0!important] [font-size:16px!important]",
  //         actions: "-mx-5",
  //        confirmButton: '[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] text-black bg-btn !rounded-[24px] hover:!bg-none',
  //         cancelButton: `w-[calc(50%_-10px)] text-black border border-[#e2e8f0] border-solid px-[0!important] !rounded-[20px]`,
  //       },
  //     }).then(async (result: any) => {
  //       if (result.value) {
  //         await deleteUser(data?.id)
  //           .then((res: any) => {
  //             if (!res.error) {
  //               const deletedData = (allUsers.results = allUsers?.results?.filter(
  //                 (res: any) => data?.id !== res?.id
  //               ));
  //               setAllUsers({ ...allUsers, results: deletedData });

  //               toast({
  //                 title: "Deleted sucessfully.",
  //                 description: res?.message,
  //               });
  //             } else {
  //               toast({
  //                 variant: "destructive",
  //                 title: "Uh oh! Something went wrong.",
  //                 description: res?.errorMessage,
  //               });
  //             }
  //           })
  //           .catch((err: any) => {
  //             toast({
  //               variant: "destructive",
  //               title: "Error occurred",
  //               description:
  //                 err?.message || "There was a problem with your request.",
  //             });
  //           });
  //       }
  //     });
  //   }

  async function deleteData(data: any) {
    Swal.fire({
      text: `Are you sure you want to delete this Agent.`,
      showCancelButton: true,
      confirmButtonColor: `#DCEDC0`,
      cancelButtonColor: "white",
      confirmButtonText: "Confirm Delete",
      // icon: "warning",
      imageUrl: "/dlt.png",
      imageAlt: "Custom image",
      imageWidth: 60,
      imageHeight: 60,
      customClass: {
        popup: "max-w-full md:max-w-[400px] px-8 py-4 rounded-2xl",
        icon: "text-[9.275px] mt-[0!important]",
        htmlContainer:
          "px-[0!important] pb-[0!important] [font-size:16px!important]",
        actions: "-mx-5",
        confirmButton:
          "[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] text-black bg-btn !rounded-[24px] hover:!bg-none",
        cancelButton: `w-[calc(50%_-10px)] text-black border border-[#e2e8f0] border-solid px-[0!important] !rounded-[20px]`,
      },
    }).then(async (result: any) => {
      if (result.value) {
        await deleteAgent(data?._id)
          .then((res: any) => {
            if (!res.error) {
              const deletedData = (allAgents.results =
                allAgents?.results?.filter(
                  (res: any) => data?._id !== res?._id
                ));
              setAllagents({ ...allAgents, results: deletedData });

              toast({
                title: "Deleted sucessfully.",
                description: res?.message,
              });
            } else {
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: res?.errorMessage,
              });
            }
          })
          .catch((err: any) => {
            toast({
              variant: "destructive",
              title: "Error occurred",
              description:
                err?.message || "There was a problem with your request.",
            });
          });
      }
    });
  }

  const userColumns: ColumnDef<any>[] = [

    {
      header: "Agent",
      accessorKey: "agent_id",
      accessorFn: (row: any) => row,
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const row: any = info.row.original;
         const agentId = row?.agent_id;
        return (
          <div className="flex">
            {/* <Avatar className="border border-[#000]">
              <AvatarImage
                src={row?.logo?.startsWith("https://") ? row?.logo : row?.logo}
              />
              <AvatarFallback className={"bg-[#fff]"}>
                {formatName(row.name) || "DI"}
              </AvatarFallback>
            </Avatar> */}
            <p className="m-2">
              {row?.agent_id ? titleCase(agentId?.trim()) : "N/A"}
            </p>
          </div>
        );
      },
    },

    {
      header: " Session",
      accessorKey: "session_id",
      cell: (info) => {
        const createdAt = info.getValue<string>();
        return (
          <div className="text-left">
            {createdAt ? (
              <p>{createdAt}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">N/A</p>
            )}
          </div>
        );
      },
      enableColumnFilter: false,
      enableSorting: false,
    },

    {
      header: "Start ",
      enableSorting: false,
      enableColumnFilter: true,
      accessorKey: "start_timestamp",
      cell: (info) => {
        const start:any = info.getValue<boolean>();

        return (
          <div
            
          >
            {start ? format(new Date(start), "dd MMM, yy 'at' h:mm a") : "N/A"}
          </div>
        );
      },
    },

     {
      header: "End ",
      enableSorting: false,
      enableColumnFilter: true,
      accessorKey: "end_timestamp",
      cell: (info) => {
        const end :any = info.getValue<boolean>();

        return (
          <div    
          >
            {end ? format(new Date(end), "dd MMM, yy 'at' h:mm a") : "N/A"}
          </div>
        );
      },
    },

    // {
    //   id: "actions",
    //   header: "Action",
    //   enableSorting: false,
    //   cell: ({ row }) => {
    //     const rowData: any = row.original;
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuSeparator />
    //           <>
    //             {/* <DropdownMenuItem
    //             //   onClick={() => updates(rowData)}
    //               className="flex items-center space-x-2"
    //             >
    //               <Pencil className="h-4 w-4 text-muted-foreground" />
    //               <span>Update</span>
    //             </DropdownMenuItem> */}

    //             <DropdownMenuItem
    //               onClick={() => deleteData(rowData)}
    //               className="flex items-center space-x-2"
    //             >
    //               <Trash2 className="h-4 w-4 text-muted-foreground" />
    //               <span>Delete</span>
    //             </DropdownMenuItem>
    //           </>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  const details = (data: any, headerName: any) => {
    if (headerName !== "Select") {
      router.push(`conversations-history/${data?._id}`);
    }
  };

  return (
    <div className="relative ">
      {/* <p className="absolute right-0">ddd</p> */}
      {/* <div className=" ">
        <div className="absolute right-0  -top-2 justify-end">
          <Button onClick={() => setOpen((open) => !open)}>Create Agent</Button>
        </div>
      </div>

      <div className="text-left">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <AddAgentConfig
              setOpen={setOpen}
              setAllagents={setAllagents}
              allAgent
              s={allAgents}
            ></AddAgentConfig>
          </DialogContent>
        </Dialog>
      </div> */}

      {/* Table Component */}
      <TanStackBasicTable
        isTableDataLoading={isAllDataLoading}
        paginatedTableData={allAgents}
        columns={userColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        details={details}
        cursorPointer={"cursor-pointer"}
      />
    </div>
  );
};

export default conversationTableComponent;
