"use client";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
// import { useGetUsers } from '@/api/useGetUsers';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebounce';

interface ExportType {
    columns: any;
    type: string;
    setState: any;
}

const UsersExportData = ({ columns, type, setState }: ExportType) => {

 //old header name.
    // const requiredHeaders = [
    //     "S.N.",
    //     "First Name",
    //     "Image",
    //     "Partner Name",
    //     "Reality Tv Show",
    //     "Email",
    //     "Password",
    //     "Group",
    //     "Ethnicity",
    //     "Religion",
    //     "Gender",
    //     "Political Affiliation",
    //     "Sexual Orientation",
    //     "Interests",
    //     "About Partner",
    //     "State",
    //     "City",
    //     "Zip Code",
    //     "Social Account",
    //     "Children",
    // ];

    // const requiredHeaders = [
    //     "S/N",
    //     "Group",
    //     "Image",
    //     "First Name",
    //     "Partner's Name",
    //     "Email",
    //     "Password",
    //     "Gender",
    //     "Religion",
    //     "Race",
    //     "Political Affiliation",
    //     "Sexual Orientation",
    //     "Interests",
    //     "About",
    //     "State",
    //     "City",
    //     "Zip Code",
    //   ];

      const requiredHeaders = [
        "S/N",
        "Group",
        "Image",
        "First Name",
        "Partner's Name",
        "Email",
        "Password",
        "Gender",
        "Religion",
        "Race",
        "Political Affiliation",
        "Sexual Orientation",
        "Interests",
        "Zip Code",
        "Children",
        "About",
      ];

    
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
    
    useEffect(() => {
        if (allUsersData) {
            downloadXLSX();
        }
    }, [allUsersData]);

    const downloadXLSX = () => {
        // Extract headers
        // const headers = columns
        //     .filter((col: any) => col?.accessorKey !== 'Select' && col?.header !== 'Action' && col?.header !== 'Image')
        //     .map((col: any) => col?.accessorKey || col?.header);

        // Map data rows
        // const rows = allUsersData?.results?.map((user: any) => {
        //     return columns
        //         .filter((col: any) => col?.accessorKey !== 'Select' && col?.header !== 'Action' && col?.header !== 'Image')
        //         .map((col: any) => (col?.accessorKey ? user[col?.accessorKey] : ''));
        // });

        const rows = allUsersData?.results?.map((user: any, index: number) => {
            return [
              index + 1, // S/N
              user.groupType || "",
              user.avatar || "",
              user.name || "",
              user.partnerName || "",
              user.email || "",
              user.password || "",
              user.gender || "",
              user.religion || "",
              user.race || "",
              user.politicalAffiliation || "",
              user.sexualOrientation || "",
              user.interests?.map((i: any) => i.title).join(", ") || "",
              user.zipCode || "",
              user.children
                ?.map((child: any) => `${child?.name?.trim()} - ${child?.age} - ${child?.gender}`)
                .join(" | ") || "",
              user.description || "",
            ];
          });
      
        //   user.state || "",
        //   user.city || "",

        //   user.socialAccount?.map((account: any) => `${account?.platform} - ${account?.handle}`)
        //   .join(" | ") || "",
        //   user.children
        //   ?.map((child: any) => `${child?.name?.trim()} - ${child?.age} - ${child?.gender}`)
        //   .join(" | ") || "",

        // Combine headers and rows
        const data = [requiredHeaders, ...rows];

        // Create a new worksheet from the data
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users Data');

        // Generate a timestamp for the filename
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const timestamp = `${formattedDate}_${formattedTime}`;
        const epochNow = new Date().getTime();
        // Write the file with a timestamped name
        XLSX.writeFile(wb, `${type}-${epochNow}.xlsx`);

        // Update state
        setState(false);
    };

    return <></>;
};

export default UsersExportData;
