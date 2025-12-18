import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const ShimmerChart = () => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-[200px] mb-2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-60 w-full bg-muted rounded-lg shimmer" />
      </CardContent>
    </Card>
  );
};
