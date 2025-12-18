import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
export const ShimmerCount = () => {
  return (
    <Card className="transition-all duration-300">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-28 mb-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
};
