import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
export const ShimmerCount = () => {
  return (
    <Card x-chunk="dashboard-01-chunk-1" >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-[150px] dark:bg-primary/10" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-[100px] dark:bg-primary/10" />
    </CardContent>
  </Card>
  );
};
