import { Skeleton } from "./ui/skeleton";

export function SavedTweetsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
          <div className="border rounded-lg p-4 w-full flex flex-col gap-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
