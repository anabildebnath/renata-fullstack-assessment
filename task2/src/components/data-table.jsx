// src/components/data-table.jsx
"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Assuming these components/hooks exist and are correctly implemented
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  // ChartConfig is not exported by your chart.jsx
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// Sheet components are no longer used if using FormModal instead
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Import the FormModal component (adjust path if necessary)
// NOTE: The definition of FormModal and the helper form components (Form, FormField, etc.)
// that you provided *should* be in a separate file, e.g., "@/components/ui/form.jsx".
// Ensure that file exports { FormModal } and the helper components you use.
import { FormModal } from "@/components/ui/form";

// InputForm is no longer needed if using FormModal
// import { InputForm } from "@/components/input-form";


// Updated schema to match your data.json structure
export const schema = z.object({
  ID: z.string(), // ID is a string in your data
  CustomerName: z.string(),
  Division: z.string(),
  Gender: z.string(),
  MaritalStatus: z.string(),
  Age: z.number(),
  Income: z.number(),
});

// Drag handle component - uses the correct ID prop
function DragHandle({ id }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Column definitions - Updated to match data.json keys
const columns = [
  // Drag handle column - uses the correct ID from row.original
  {
    id: "drag", // This id is for the column itself, not the row data
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.ID} />, // Use row.original.ID
    size: 30, // Optional: give drag handle column a fixed size
  },
  { accessorKey: "CustomerName", header: "Customer Name" },
  { accessorKey: "Division", header: "Division" },
  { accessorKey: "Gender", header: "Gender" },
  { accessorKey: "MaritalStatus", header: "Marital Status" },
  { accessorKey: "Age", header: "Age" },
  { accessorKey: "Income", header: "Income" },
  // Add more columns here if your data.json has more fields you want to display
];

export function DataTable({ data: initialData }) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]); // State for filtering
  const [globalFilter, setGlobalFilter] = React.useState(""); // State for search box
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [isFormOpen, setIsFormOpen] = React.useState(false); // State to control FormModal

  // Ensure unique sensors are created once
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse button to be pressed for 500 milliseconds, or the movement of 5 pixels
      activationConstraint: {
        delay: 500,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Press and hold for 250 milliseconds, with a tolerance of 5 pixels
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      // Use the keyboard to activate dnd events
      coordinateGetter: ({ current }) => {
        if (current) {
          return {
            x: current.clientX,
            y: current.clientY,
          };
        }
        return undefined;
      },
    })
  );


  // Get data IDs for sorting - Use the correct property name 'ID'
  const dataIds = React.useMemo(() => data.map(r => r.ID), [data]);


  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, globalFilter, pagination },
    // Use the correct property name 'ID' for getRowId
    getRowId: row => row.ID.toString(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleDragEnd = event => {
    const { active, over } = event;
    // Check if dragging and dropping on a different item
    if (active && over && active.id !== over.id) {
      setData(old => {
        // Find the current index of the dragged item using its ID
        const oldIndex = dataIds.indexOf(active.id);
         // Find the new index based on where it was dropped using the target item's ID
        const newIndex = dataIds.indexOf(over.id);

        // If both items are found in the current data array
        if (oldIndex !== -1 && newIndex !== -1) {
             // Use arrayMove from @dnd-kit/sortable to reorder the data
            return arrayMove(old, oldIndex, newIndex);
        }
        // If for some reason an item wasn't found, return the original data
         return old;
      });
    }
  };

  // Function to handle data submission from the form modal
  // You will need to implement logic here to generate a unique ID
  // and add the new item to the 'data' state.
  const handleFormSubmit = (formData) => {
    console.log("Form data submitted:", formData);
    // Example: Generate a simple unique ID (replace with a better method)
    const newId = `ITEM${Date.now()}`;
    const newItem = {
      ID: newId,
      ...formData, // Add other form fields
    };

    // Basic validation against schema (optional, react-hook-form with zod does this)
    try {
      schema.parse(newItem);
      setData((prevData) => [...prevData, newItem]); // Add new item to data state
      toast.success("New item added!"); // Show a success toast
      setIsFormOpen(false); // Close the modal on success
    } catch (error) {
      console.error("Validation Error or Failed to add item:", error);
      toast.error("Failed to add item."); // Show an error toast
      // Keep the modal open or provide feedback
    }
  };


  return (
    // Use a Fragment <> to return multiple top-level elements (Tabs and FormModal)
    <>
      <Tabs defaultValue="outline" className="flex w-full flex-col gap-6">
        {/* Top controls */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          {/* View Selector */}
          <Select defaultValue="outline">
            <SelectTrigger className="flex w-fit @4xl/main:hidden" id="view-selector">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
               {/* Update SelectItem values/labels if needed to match your tabs */}
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem> {/* Fixed closing tag */}
            </SelectContent>
          </Select>
          {/* Tabs List */}
          <TabsList className="hidden @4xl/main:flex">
             {/* Update TabsTrigger values/labels if needed */}
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="past-performance">Past Performance <Badge variant="secondary">3</Badge></TabsTrigger>
            <TabsTrigger value="key-personnel">Key Personnel <Badge variant="secondary">2</Badge></TabsTrigger>
            <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
            {/* Button to trigger the FormModal */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(true)} // Open the FormModal
            >
              <PlusIcon className="size-4 mr-1" />
              <span className="hidden lg:inline">Add Item</span> {/* Changed text */}
            </Button>
          </div>
        </div>

        {/* Table Content for "outline" tab */}
        <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="overflow-hidden rounded-lg border">
             {/* DndContext for row dragging */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
              <Table>
                {/* Table Header */}
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id}>
                      {hg.headers.map(header => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                {/* Table Body */}
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                      {table.getRowModel().rows.map(row => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() ? "selected" : undefined} // Fixed syntax
                          className="relative z-0"
                        >
                          {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4 px-0"> {/* Removed px-4/lg:px-6 as TabsContent already has it */}
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

         {/* Other tabs - Fixed syntax */}
        <TabsContent value="past-performance">
          {/* Content for Past Performance */}
          <div className="h-40 w-full flex items-center justify-center border rounded-lg">
             <p>Past Performance content goes here (likely needs data structure updates too)</p>
          </div>
        </TabsContent>
         <TabsContent value="key-personnel">
           {/* Content for Key Personnel */}
           <div className="h-40 w-full flex items-center justify-center border rounded-lg">
             <p>Key Personnel content goes here (likely needs data structure updates too)</p>
          </div>
        </TabsContent>
         <TabsContent value="focus-documents">
           {/* Content for Focus Documents - Fixed syntax */}
           <div className="h-40 w-full flex items-center justify-center border rounded-lg">
             <p>Focus Documents content goes here (likely needs data structure updates too)</p>
           </div> {/* Correct closing div */}
         </TabsContent> {/* Correct closing TabsContent */}

      </Tabs> {/* Correct closing Tabs tag */}

      {/* Render the FormModal outside the Tabs, as a sibling */}
      {/* Pass the state and the submit handler */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit} // Pass the handler to the modal
      />
    </> 
  );
}