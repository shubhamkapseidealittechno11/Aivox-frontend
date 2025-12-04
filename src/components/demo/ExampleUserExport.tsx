"use client";
import React, { useEffect } from 'react';
import * as XLSX from 'xlsx';

interface ExportType {
    type: string;
    setState: any;
}

const ExampleUserExport = ({ type, setState }: ExportType) => {
    const requiredHeaders = [
        "S.N.",
        "Name",
        "Reality Tv Show",
        "Email",
        "Password",
        "Group",
        "Ethnicity",
        "Religion",
        "Gender",
        "Political Affiliation",
        "Sexual Orientation",
        "Interests",
        "About Partner",
        "State ",
        "City",
        "Zip Code",
        "Facebook",
        "Children"
    ];

    useEffect(() => {
        downloadXLSX();
    }, []);

    const downloadXLSX = () => {

        // Generate a timestamp for the filename
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const timestamp = `${formattedDate}_${formattedTime}`;


        // Create an empty array of rows, one for the header
        const data = [requiredHeaders];

        // Create a new worksheet from the data
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Create a new workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');


        // Export the workbook to an .xlsx file with timestamp
        XLSX.writeFile(wb, `${type}_${timestamp}.xlsx`);

        // Update state if needed
        setState(false);
    };

    return <></>;
}

export default ExampleUserExport;
