"use client";
import React, { useEffect, useState } from 'react'
import { ngxCsv } from "ngx-csv";
// import { useGetUsers } from '@/api/useGetUsers';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebounce';

interface ExportType {
    columns: any,
    type: string,
    setState: any
}

const UsersExportData = ({ columns, type, setState }: ExportType) => {
    const [sorting, setSorting] = useState<any>([]);
    const [columnFilters, setColumnFilters]: any = useState<ColumnFiltersState>([{ id: 'noLimit', value: 'no' }]);
    const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
    const [pagination, setPagination] = useState<any>({ pageIndex: 0, pageSize: 20 });
    // const { allUsersData, isAllUsersDataLoading }: any = useGetUsers({
    //     sorting,
    //     columnFilters: debouncedColumnFilters,
    //     pagination
    // });

    const allUsersData = {results: []};
    useEffect(()=>{
       allUsersData && downloadCSV();        
    },[allUsersData]);

    const downloadCSV = () => {
        const headers = columns
            .filter((col: any) => col?.accessorKey !== 'Select' && col?.header !== 'Action' && col?.header !== 'Image')
            .map((col: any) => col?.accessorKey || col?.header);
        const result = allUsersData?.results?.map((user: any) => {
            return columns
                .filter((col: any) => col?.accessorKey !== 'Select' && col?.header !== 'Action' && col?.header !== 'Image')
                .map((col: any) => {
                    return col?.accessorKey ? user[col?.accessorKey] : '';
                });
        });
        const options = {
            fieldSeparator: ",", quoteStrings: '"', decimalseparator: ".",
            showLabels: true, useBom: true, noDownload: false, headers: headers
        };
        new ngxCsv(result, type, options);
        setState(false);
    };

    return (<></>);
}



export default UsersExportData;