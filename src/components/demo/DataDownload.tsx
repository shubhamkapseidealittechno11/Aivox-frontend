"use client";
// import { useGetUsers } from "@/api/useGetUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import React from 'react'
import { Button } from "@/components/ui/button";
import { ngxCsv } from "ngx-csv";
import { Skeleton } from "../ui/skeleton";

interface DownloadType {
    sorting: SortingState,
    columnFilters: ColumnFiltersState,
    setOpen? :any,
    columns: any,
    type: string
}

const DataDownload = ({ columns, type, sorting, columnFilters }: DownloadType) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button className="ml-auto" onClick={() => setOpen(true)}>
                Export CSV
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[360px] max-h-[400px] py-10 px-5 overflow-y-auto">
                    <ExportCSV columns={columns} type={type} sorting={sorting} columnFilters={columnFilters} setOpen={setOpen}/>
                </DialogContent>
            </Dialog>
        </>
    );
}

const ExportCSV= ({ columns, type, sorting, columnFilters, setOpen }: DownloadType) => {
    const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
    const select = 25;
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, pageSize: select
    });

    // Conditional data fetching
    // const { allUsersData, isAllUsersDataLoading } = useGetUsers({ sorting, columnFilters: debouncedColumnFilters, pagination });

    const [allUsers, setAllUsers]: any = useState([]);

    useEffect(() => {
        const data = type === 'user' ? "" : [];
        setAllUsers(data);
    }, ["allUsersData", type]);


    const ExportButton = () => {
        if (!allUsers || !allUsers?.counts) return null;
        const buttons = [];
        for (let i = 1, index = 0; i < allUsers?.counts; i += select, index++) {
            buttons.push(
                <div className="py-2 flex items-center" key={i}>
                    Export CSV {`(${i}-${Math.min(i + select, allUsers?.counts)-1})`}
                    <Button className="ml-auto" onClick={() => getData(index)}>Download</Button>
                </div>
            );
        }
        return <div>{buttons}</div>;
    };

    const getData = (index: number) => {
        setPagination((prevState: any) => ({
            ...prevState, pageIndex: index,
        }));
        downloadCSV();
    };

    const downloadCSV = () => {
        const headers = columns
            .filter((col: any) => col?.header !== 'Action' && col?.header !== 'Image')
            .map((col: any) => col?.accessorKey || col?.header);
        const data = allUsers?.results?.map((user: any) => {
            return columns
                .filter((col: any) => col?.header !== 'Action' && col?.header !== 'Image')
                .map((col: any) => {
                    return col?.accessorKey ? user[col?.accessorKey] : '';
                });
        });
        const options = {
            fieldSeparator: ",", quoteStrings: '"', decimalseparator: ".",
            showLabels: true, useBom: true, noDownload: false, headers: headers
        };
        new ngxCsv(data, type, options);
        setOpen(false);
    };
    return ( 
        <>
        { !allUsers?.counts ?
        <>
            <div className="flex items-baseline space-x-6">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[150px]" />
            </div>
            <div className="flex items-baseline space-x-6">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[150px]" />
            </div>
        </>
        : <ExportButton/>
        }
        </>
    )
}

export default DataDownload;