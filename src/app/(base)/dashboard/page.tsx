"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AgentTableComponent from "@/components/table/agentTableComponent";
const queryClient = new QueryClient();


export default function DashboardPage() {



  return (
    <ContentLayout title="All Agents">
      {/* <Breadcrumb>
        <BreadcrumbList> */}
          {/* <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator /> */}
          {/* <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem> */}
        {/* </BreadcrumbList>
      </Breadcrumb> */}
      <QueryClientProvider client={queryClient}>
        <AgentTableComponent />
      </QueryClientProvider>
    </ContentLayout>
  );
}
