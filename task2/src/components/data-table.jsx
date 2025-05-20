"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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
import { FormModal } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AppSidebar } from "@/components/app-sidebar"; // Import AppSidebar
import { DragHandle } from "@/components/drag-handle";
import { useSortable } from "@dnd-kit/sortable"; // Add this import

export const schema = z.object({
  ID: z.string(),
  CustomerName: z.string(),
  Division: z.string(),
  Gender: z.string(),
  MaritalStatus: z.string(),
  Age: z.number(),
  Income: z.number(),
});

// Create a context for managing the form popup state
export const FormContext = React.createContext();

export function DataTable({ data, onAddRecord, onEditRecord, onDeleteRecord, onDeleteSelectedRecords }) {
  const searchInputRef = React.useRef(null); // Define the search input ref
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editRecord, setEditRecord] = React.useState(null);

  const handleFormSubmit = (formData) => {
    onAddRecord({ ...formData, ID: `ID${Date.now()}` });
    setIsFormOpen(false);
  };

  const handleEditSubmit = (updatedData) => {
    onEditRecord(editRecord.ID, updatedData);
    setIsEditOpen(false);
    setEditRecord(null);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setIsEditOpen(true);
  };

  const handleCopy = (record) => {
    const copiedRecord = { ...record, ID: `COPY${Date.now()}` };
    onAddRecord(copiedRecord);
    toast.success("Record copied!");
  };

  const handleFavorite = (record) => {
    toast.success(`${record.CustomerName} marked as favorite!`);
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p className="text-lg font-medium">No valid data available</p>
        <p className="text-sm">Try adjusting your filters or adding new records.</p>
      </div>
    );
  }

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState(""); // Global filter state
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [isSearchFocused, setIsSearchFocused] = React.useState(false); // Track focus state of the search box

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), // Adjust activation constraint
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const filteredData = React.useMemo(() => {
    const validData = data.filter((row) => row.ID);
    if (!globalFilter) return validData;

    const lowerCaseFilter = globalFilter.toLowerCase();
    return validData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowerCaseFilter)
      )
    );
  }, [data, globalFilter]);

  const handleDelete = (id) => {
    if (typeof onDeleteRecord === 'function') {
      onDeleteRecord(id);
      toast.success("Record deleted successfully!");
    }
  };

  const handleDeleteSelected = () => {
    const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    if (selectedIds.length > 0 && typeof onDeleteSelectedRecords === 'function') {
      onDeleteSelectedRecords(selectedIds);
      setRowSelection({});
      toast.success(`${selectedIds.length} record(s) deleted successfully!`);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      console.log("Drag operation detected, but no data modification occurs.");
      // No data modification here to ensure charts remain unaffected
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => {
        const ref = React.useRef();

        React.useEffect(() => {
          if (ref.current) {
            ref.current.indeterminate = table.getIsSomePageRowsSelected(); // Set indeterminate state
          }
        }, [table.getIsSomePageRowsSelected()]);

        return (
          <div className="flex items-center justify-center">
            <Checkbox
              ref={ref} // Attach ref to the checkbox
              checked={table.getIsAllPageRowsSelected()} // Select only if all rows are selected
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 30,
    },
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.ID} />,
      size: 30,
    },
    { accessorKey: "CustomerName", header: "Customer Name" },
    { accessorKey: "Division", header: "Division" },
    {
      accessorKey: "Gender",
      header: "Gender",
      cell: ({ row }) => {
        const gender = row.original.Gender;
        return gender === "M" ? "Male" : gender === "F" ? "Female" : gender;
      },
    },
    { accessorKey: "MaritalStatus", header: "Marital Status" },
    { accessorKey: "Age", header: "Age" },
    { accessorKey: "Income", header: "Income" },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <RowActions
          row={row}
          onEdit={handleEdit}
          onDelete={() => handleDelete(row.original.ID)} // Pass the record ID for deletion
          onCopy={handleCopy}
          onFavorite={handleFavorite}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData, // Use filtered data
    columns,
    state: { sorting, columnVisibility, rowSelection, pagination },
    getRowId: (row) => (row.ID || row.id)?.toString(), // Handle both ID and id
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    enableRowSelection: true, // Enable row selection
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function RowActions({ row, onEdit, onDelete, onCopy, onFavorite }) {
    const record = row?.original;

    if (!record) {
      return null;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-8 text-[oklch(var(--muted-foreground))] hover:bg-[oklch(var(--muted))] hover:text-[oklch(var(--foreground))]"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => onEdit(record)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(record)}>
            Make a Copy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFavorite(record)}>
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDelete(record.ID)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function DraggableRow({ row }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
      id: row.original.ID || row.id,
    });

    return (
      <TableRow
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className={`relative z-0 ${isDragging ? "opacity-50" : ""}`}
        {...attributes}
        {...listeners}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <>
      <Tabs defaultValue="outline" className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative flex items-center">
              <Input
                ref={searchInputRef} // Attach the ref to the search input
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`transition-all duration-[2000ms] ease-out ${
                  isSearchFocused ? "w-[240px]" : "w-[160px]"
                }`}
                style={{
                  borderRadius: "10px",
                  backgroundColor: "transparent",
                  color: "white",
                }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(true)}
              className="bg-transparent text-[oklch(var(--foreground))] hover:bg-gray-300 hover:text-[oklch(var(--foreground))]"
            >
              <PlusIcon className="size-4 mr-1" />
              <span className="hidden lg:inline">Add Customer</span>
            </Button>
          </div>
        </div>
        <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="overflow-hidden rounded-[0.75rem] border">
            <DndContext sensors={sensors} collisionDetection={closestCenter}>
              <SortableContext
                items={data.filter((item) => item.ID || item.id).map((item) => item.ID || item.id)} // Use only valid IDs
                strategy={verticalListSortingStrategy}
              >
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <DraggableRow
                          key={row.id}
                          row={row}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                          No data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          </div>
          <div className="flex justify-end px-4">
            {Object.keys(rowSelection).some((id) => rowSelection[id]) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Selected
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="w-20" id="rows-per-page">
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
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <FormModal
        isOpen={isFormOpen} // Render the form modal for adding new records
        onClose={() => setIsFormOpen(false)} // Close the modal
        onSubmit={handleFormSubmit} // Handle form submission
      />
      <FormModal
        isOpen={isEditOpen} // Render the form modal for editing records
        onClose={() => setIsEditOpen(false)} // Close the modal
        onSubmit={handleEditSubmit} // Handle edit submission
        defaultValues={editRecord} // Pass the record to be edited as default values
      />
    </>
  );
}