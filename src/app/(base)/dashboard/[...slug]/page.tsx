import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import AgentDetail from "@/components/details/agentDetail";
import FullAgentChat from "@/components/demo/FullAgentChat";

const AgentDeatil = ({ params }: any) => {
  // params.slug is a catch-all array; agent id is expected at index 0
  const agentId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  return (
    <ContentLayout title="Aivox">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Agent Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="h-[80vh] w-full flex overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[65%] h-full  p-6 ">
          <AgentDetail data={{ id: params.slug }} />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[35%] h-full  overflow-hidden bg-white">
          <div className="h-full overflow-y-auto">
            <FullAgentChat agentId={agentId} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default AgentDeatil;
