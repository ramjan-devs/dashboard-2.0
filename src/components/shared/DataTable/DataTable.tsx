import { ArrowLeft, ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  getRowKey: (item: T) => string;
  showPagination?: boolean;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  title,
  columns,
  data,
  emptyMessage = "No data found",
  onRowClick,
  getRowKey,
  showPagination = false,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}: DataTableProps<T>) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="w-full space-y-4">
      {title && (
        <h2 className="text-xl font-semibold text-foreground p-2">
          {title}
        </h2>
      )}

      <div className="rounded-md overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={`px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap last:text-center ${column.hideOnMobile ? "" : ""
                    } ${column.headerClassName || ""}`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={getRowKey(item)}
                  className={
                    onRowClick
                      ? "cursor-pointer hover:bg-accent/50"
                      : "hover:bg-accent/50"
                  }
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      className={`px-2 sm:px-4 py-3 text-xs sm:text-sm whitespace-nowrap last:text-center ${column.hideOnMobile ? "" : ""
                        } ${column.cellClassName || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : column.accessor
                          ? String(item[column.accessor as keyof T])
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            Showing {startItem}-{endItem} of {totalItems}
          </div>
          <div className="flex gap-2">
           <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
            aria-label="Previous page"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
            aria-label="Next page"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          </div>
        </div>
      )}
    </div>
  );
}
