import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // assuming you're using a UI library
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Assuming you have a Dropdown component
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

interface Column {
  key: string;
  label: string;
}

interface Action {
  label: string;
  onClick: (row: any) => void; // Action function that receives the row data
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  actions: Action[]; // List of actions to display in the dropdown
  hiddenColumns?: string[]; // Add hiddenColumns prop
}

export function DataTable<T extends Record<string, any>>({ columns, data, actions, hiddenColumns = [] }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            !hiddenColumns.includes(column.key) && (
              <TableHead key={column.key}>{column.label}</TableHead>
            )
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              !hiddenColumns.includes(column.key) && (
                <TableCell key={column.key}>
                  {row[column.key as keyof T]}
                </TableCell>
              )
            ))}
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
        ))}
      </TableBody>
    </Table>
  );
}
