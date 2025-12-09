import { Label } from "@radix-ui/react-label";
import { Table, flexRender } from "@tanstack/react-table";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Icon, Search, X } from "lucide-react";
import { Button } from "../ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import React from "react";
import { Value } from "@radix-ui/react-select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { RotateCcw } from "lucide-react";
import { titleCase } from "@/lib/utils";
interface TanStackBasicTableFilterComponentProps<TData> {
  table: Table<TData>;
  setColumnFilters: any;
}

export default function TanStackBasicTableFilterComponent<TData>({
  table,
  setColumnFilters,
}: TanStackBasicTableFilterComponentProps<TData>) {
  const [filterValue, setFilterValue]: any = useState([]);
  const pathname = usePathname();
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const [searchValue, setSearchValue]: any = useState("");

  const [date, setDate] = React.useState<any>();
  const disabledDates = {
    after: new Date(),
  };


  useEffect(() => {
    if (date?.from && date?.to){
      setDateValue()
      setOpenDatePicker(false);
    }
  }, [date])

  const setDateValue = () => {
    setColumnFilters((prev: any) => {
      const updatedArr = [...prev];
      const filterMap = new Map(updatedArr.map((item) => [item.id, item]));
      filterMap.set("from", { id: "from", value: date?.from });
      filterMap.set("to", { id: "to", value: date?.to });
      return Array.from(filterMap.values());
    });
  };
  const reset = () => {
    setColumnFilters([]);
    setDate(null);
    setFilterValue([]);
  };
  const showDateFilter: any = ["/debate" ];

  const multiStatus: any = ["completed","pending","inProgress", "failed", "partially_completed" , "/dashboard"];

  const wanSide: any = ["/debate" ];

 const showSearchFilter: any = ["/dashboard" ];

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setColumnFilters([
      // { id: "status", value: selectedStatus },
      { id: "search", value },
    ]);
  };

  const HandelSearchClear = () => {
    setSearchValue("");
    setColumnFilters([
      // { id: "status", value: selectedStatus },
      { id: "search", value: "" },
    ]);
  };
  return (
    <>
      <div className="flex items-center mb-4 gap-3">
        {showDateFilter.includes(pathname) && (
          <>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <span>
                  <CalendarDateRangePicker
                date={date}
                setDate={setDate}
                disabledDates={disabledDates}
                open={openDatePicker}
                setOpen={setOpenDatePicker}
              />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-black dark:bg-white"
                  side="bottom"
                >
                  <p>Pick a date</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <span>
                    <Button disabled={!date} onClick={() => setDateValue()}>
                      Date Filter
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-black dark:bg-white"
                  side="bottom"
                >
                  <p>Date filter</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <span>
                    {date && (
                      <Button variant="ghost" onClick={() => reset()}>
                        <RotateCcw />
                      </Button>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-black dark:bg-white"
                  side="bottom"
                >
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
{showSearchFilter.includes(pathname) && (
            <>
              <div className="relative flex items-center border rounded-[10px] px-3 py-2 h-[36px]  dark:bg-muted">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-8 pr-7 w-full outline-none bg-transparent dark:bg-muted placeholder:!text-sm "
                  value={searchValue}
                  onChange={handleSearchChange}
                />

                {searchValue ? (
                  <div
                    className="relative flex items-center"
                    onClick={HandelSearchClear}
                  >
                    <X className="absolute right-2 " size={16} />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          )}

        <div className="ml-[auto]">
        { pathname.includes(wanSide) && <Sheet key="right">
            <SheetTrigger asChild>
              <Button variant="outline">
                {" "}
                <Filter className="h-4 w-4" />{" "}
                <div className="text-left">
                  {" "}
                  <span className="pl-2">Filter and Search Records</span>
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter and search records.</SheetDescription>
              </SheetHeader>
              <div className="pt-6">
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                  { table.getHeaderGroups()[0].headers.map(
                    (header) =>
                      !header.isPlaceholder &&
                      header.column.getCanFilter() && (
                        <div key={header.id} className="">
                          <Label className="block font-medium text-sm mb-2">
                            {`${flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}`}
                            :
                          </Label>

                          {header.column.columnDef.header === "Status" ||
                          header.column.columnDef.header === "Group Type" ||
                          header.column.columnDef.header === "Type" ? 
                          !pathname.includes("/bulk-user") && <Select
                              onValueChange={(e) => {
                                setFilterValue((prev: any) => {
                                  let arr = [...prev];
                                  const index = arr.findIndex(
                                    (el: any) => el?.id == header?.id
                                  );

                                  if (index == -1) {
                                    arr.push({ id: header?.id, value: e });
                                  } else {
                                    arr[index].value = e;
                                  }
                                  return arr;
                                });
                              }}
                              defaultValue={
                                (header.column.getFilterValue() as string) || ""
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Select ${
                                    header.column.columnDef.header === "Status"
                                      ? "Status"
                                      : header.column.columnDef.header ===
                                        "Group Type"
                                      ? "Group Type"
                                      : "AnswerType"
                                  }`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {/* <SelectItem value=" ">Select</SelectItem> */}
                                <SelectItem
                                  value={
                                    header.column.columnDef.header === "Status"
                                      ? "active"
                                      : header.column.columnDef.header ===
                                        "Group Type"
                                      ? "single"
                                      : "text"
                                  }
                                >
                                  {header.column.columnDef.header === "Status"
                                    ? "Active"
                                    : header.column.columnDef.header ===
                                      "Group Type"
                                    ? "Single"
                                    : "Text"}
                                </SelectItem>
                                <SelectItem
                                  value={
                                    header.column.columnDef.header === "Status"
                                      ? "inactive"
                                      : header.column.columnDef.header ===
                                        "Group Type"
                                      ? "senior"
                                      : "voice"
                                  }
                                >
                                  {header.column.columnDef.header === "Status"
                                    ? "Inactive"
                                    : header.column.columnDef.header ===
                                      "Group Type"
                                    ? "Senior"
                                    : "Voice"}
                                </SelectItem>
                                {header.column.columnDef.header ===
                                  "Group Type" && (
                                  <SelectItem
                                    value={
                                      header.column.columnDef.header ===
                                      "Group Type"
                                        ? "families"
                                        : ""
                                    }
                                  >
                                    {header.column.columnDef.header ===
                                    "Group Type"
                                      ? "Families"
                                      : ""}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                           : (
                            <Input
                              className="w-full"
                              placeholder={`Filter ${flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )} ...`}
                              defaultValue={
                                (header.column.getFilterValue() as string) || ""
                              }
                              onChange={(e) => {
                                setFilterValue((prev: any) => {
                                  let arr = [...prev];
                                  const index = arr.findIndex(
                                    (el: any) => el?.id == header?.id
                                  );

                                  if (index == -1) {
                                    arr.push({
                                      id: header?.id,
                                      value: e.target.value,
                                    });
                                  } else {
                                    arr[index].value = e.target.value;
                                  }
                                  return arr;
                                });
                                // header.column?.setFilterValue(e.target.value);
                              }}
                            />
                          )}


                       { pathname.includes("/bulk-user") &&  (<Select
                            onValueChange={(e) => {
                              setFilterValue((prev: any) => {
                                let arr = [...prev];
                                const index = arr.findIndex(
                                  (el: any) => el?.id == header?.id
                                );

                                if (index == -1) {
                                  arr.push({ id: header?.id, value: e });
                                } else {
                                  arr[index].value = e;
                                }
                                return arr;
                              });
                            }}
                            defaultValue={
                              (header.column.getFilterValue() as string) || ""
                            }
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Select ${
                                  header.column.columnDef.header === "Status"
                                    ? "Status"
                                    : header.column.columnDef.header === "Type"
                                    ? "Type"
                                    : "AnswerType"
                                }`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                multiStatus?.map((status:any, i:any)=>{   
                                  if (pathname === "/bulk-user" && status === "partially_completed") {
                                    return (
                                      <SelectItem value={status} key={i}>
                                        {status === 'partially_completed' ? "Partially Completed" : titleCase(status)}
                                      </SelectItem>
                                    );
                                  }
                        
                                  if (pathname.includes("bulk-user/") && status === "partially_completed") {
                                    return null;
                                  }
                        
                                  return (
                             
                                      <SelectItem
                                        value={status}
                                        key={i}
                                      >
                                        {status == 'partially_completed' ? "Partially Completed" :  titleCase(status)}
                                      </SelectItem>
                                  )
                                })
                              }
                            </SelectContent>
                          </Select>)
                          }
                          
                        </div>
                      )
                  )}
                </div>
              </div>

              <SheetFooter className="py-4">
                <SheetClose asChild>
                  <Button
                    onClick={() => {
                      setColumnFilters([]);
                      setFilterValue([]);
                    }}
                    className="px-6"
                  >
                    Reset
                  </Button>
                </SheetClose>

                <SheetClose asChild>
                  <Button
                    disabled={(table.getRowModel().rows.length == 0)? filterValue.length === 0:(table.getRowModel().rows.length == 0)}
                    type="submit"
                    onClick={() => {setColumnFilters(filterValue); 
                      // setFilterValue([]);
                     }}
                     className="border bg-[transparent] px-6 dark:text-muted-foreground"
                  >
                    Search
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet> }
        </div>
      </div>
    </>
  );
}
