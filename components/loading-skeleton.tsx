import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function LoadingSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-12 w-12 rounded-full" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-40 rounded-sm" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-40 rounded-sm" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-40 rounded-sm" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-20 rounded-sm" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-20 rounded-sm" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-20 rounded-sm" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-20 rounded-sm" />
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  );
}
