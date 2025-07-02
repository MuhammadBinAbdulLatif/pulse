import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreatePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Top section with centered skeleton loaders */}
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>

      {/* Grid of skeleton cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            {/* CardHeader */}
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            {/* CardContent */}
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}