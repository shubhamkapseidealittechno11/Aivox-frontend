import React from 'react'
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
import ChatHistory from '@/components/details/chatHistory';

const AgentDeatil = ({ params }: any) => {
    // params.slug is a catch-all array; agent id is expected at index 0
    const agentId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

    return (
        <ContentLayout title="">
            <Breadcrumb>
                <BreadcrumbList>
                    {/* <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem> */}
                    {/* <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Agent Details</BreadcrumbPage>
                    </BreadcrumbItem> */}
                </BreadcrumbList>
            </Breadcrumb>


<ChatHistory message={params} />


        </ContentLayout>
    )
}

export default AgentDeatil