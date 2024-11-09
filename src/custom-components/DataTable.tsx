import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // assuming you're using a UI library
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Assuming you have a Dropdown component
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

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
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Filter data whenever filterText or data changes
  useEffect(() => {
    if (filterText === "") {
      setFilteredData(data); // Show all data if filter text is empty
    } else {
      setFilteredData(
        data.filter((row) =>
          // Check if any value in the row includes the filterText
          Object.values(row).some((value) =>
            value?.toString().toLowerCase().includes(filterText.toLowerCase())
          )
        )
      );
    }
  }, [filterText, data]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };
  return (
    <>
    <Input
        placeholder="Type in to search data"
        value={filterText}
        onChange={handleFilterChange}
        style={{ marginBottom: "10px", padding: "5px" }}
      />
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
        {filteredData.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              !hiddenColumns.includes(column.key) && (
                <TableCell key={column.key}>
                  {column.key=='date'?format(row[column.key as keyof T],'dd-MM-yyyy'):row[column.key as keyof T]}
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
    </>
  );
}
