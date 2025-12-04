"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Addconfigurations from "@/components/form/Addconfigurations";
import { Card, CardContent } from "@/components/ui/card";
export default function ConfigurationsPage() {

  return (
    <ContentLayout title="Configurations">
         <Addconfigurations/>
    </ContentLayout>
  );
}
