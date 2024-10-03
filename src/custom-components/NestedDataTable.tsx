import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Column {
  key: string;
  label: string;
}

interface Action {
  label: string;
  onClick: (row: any) => void;
}

interface NestedDataTableProps<T> {
  columns: Column[];
  data: T[];
  actions: Action[];
  hiddenColumns?: string[];
  nestedData?: (row: T) => T[] | null;
  nestedColumns?: Column[];
  collapsibleTriggerColumn?: string;
}

export function NestedDataTable<T extends Record<string, any>>({
  columns,
  data,
  actions,
  hiddenColumns = [],
  nestedData,
  nestedColumns,
  collapsibleTriggerColumn,
}: NestedDataTableProps<T>) {
  const [openRows, setOpenRows] = useState<number[]>([]);

  const handleToggleRow = (index: number) => {
    setOpenRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(
            (column) =>
              !hiddenColumns.includes(column.key) && (
                <TableHead key={column.key}>{column.label}</TableHead>
              )
          )}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <Collapsible key={index} open={openRows.includes(index)} asChild>
            <>
              {/* Parent Row */}
              <TableRow>
                {columns.map(
                  (column) =>
                    !hiddenColumns.includes(column.key) && (
                      <TableCell key={column.key}>
                        {collapsibleTriggerColumn === column.key ? (
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" onClick={() => handleToggleRow(index)}>
                              {row[column.key as keyof T]}
                            </Button>
                          </CollapsibleTrigger>
                        ) : (
                          row[column.key as keyof T]
                        )}
                      </TableCell>
                    )
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {actions.map((action, idx) => (
                        <DropdownMenuItem key={idx} onClick={() => action.onClick(row)}>
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              {/* Collapsible Nested Rows */}
              {nestedData && nestedColumns && (
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {nestedColumns.map((nestedColumn) => (
                              <TableHead key={nestedColumn.key}>{nestedColumn.label}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {nestedData(row)?.map((nestedRow, nestedIndex) => (
                            <TableRow key={nestedIndex}>
                              {nestedColumns.map((nestedColumn) => (
                                <TableCell key={nestedColumn.key}>
                                  {nestedRow[nestedColumn.key as keyof T]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              )}
            </>
          </Collapsible>
        ))}
      </TableBody>
    </Table>
  );
}
