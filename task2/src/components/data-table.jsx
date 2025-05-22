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
  UploadIcon,
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
import { FileUploadModal } from "@/components/file-upload-modal";

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

export function DataTable({ data, onAddRecord, onEditRecord, onDeleteRecord, onDeleteSelectedRecords, onApplyFilter }) {
  const searchInputRef = React.useRef(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editRecord, setEditRecord] = React.useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const handleFormSubmit = (formData) => {
    onAddRecord({ ...formData, ID: `ID${Date.now()}` });
    setIsFormOpen(false);
  };

  const handleEditSubmit = (updatedData) => {
    if (editRecord && editRecord.ID) {
      // Convert the form data to match the required format
      const formattedData = {
        ...updatedData,
        ID: editRecord.ID, // Preserve the original ID
        addedAt: editRecord.addedAt // Preserve the original timestamp
      };
      
      onEditRecord(editRecord.ID, formattedData);
      toast.success("Record updated successfully!");
      setIsEditOpen(false);
      setEditRecord(null);
    }
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

  const handleBatchUpload = (records) => {
    if (Array.isArray(records) && records.length > 0) {
      onAddRecord(records); // Pass the entire array to onAddRecord
    }
  };

  // Remove or modify the early return for empty data
  if (!Array.isArray(data)) {
    return <div>Invalid data format</div>;
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
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

  // Define DraggableRow component inside DataTable before it's used
  const DraggableRow = React.memo(({ row }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
      id: row.original.ID,
    });

    return (
      <TableRow
        ref={setNodeRef}
        key={row.original.ID}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className={`relative z-0 ${isDragging ? "opacity-50" : ""}`}
        {...attributes}
        {...listeners}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={`${row.original.ID}_${cell.id}`}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  });

  // Add handleDelete function before it's used
  const handleDelete = (id) => {
    if (typeof onDeleteRecord === 'function') {
      onDeleteRecord(id);
      toast.success("Record deleted successfully!");
    }
  };

  // Add handleDeleteSelected function
  const handleDeleteSelected = () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length > 0 && typeof onDeleteSelectedRecords === 'function') {
      onDeleteSelectedRecords(selectedIds);
      setRowSelection({}); // Clear selection after deletion
      toast.success(`${selectedIds.length} record(s) deleted successfully!`);
    }
  };

  // Define RowActions component before it's used in columns
  const RowActions = React.memo(({ row, onEdit, onDelete, onCopy, onFavorite }) => {
    const record = row?.original;
    if (!record) return null;

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
  });

  // Define columns with RowActions component
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
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
    },
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.ID} />,
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
          onDelete={handleDelete}
          onCopy={handleCopy}
          onFavorite={handleFavorite}
        />
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility, rowSelection, pagination },
    getRowId: (row) => row.ID,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Move table-dependent JSX into a separate component
  const TableContent = () => (
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
  );

  // Keep the rest of the component's UI elements visible even when data is empty
  return (
    <>
      <Tabs defaultValue="outline" className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <AppSidebar 
            setIsFormOpen={setIsFormOpen}
            onApplyFilter={onApplyFilter} // Pass onApplyFilter to AppSidebar
          />
          <div className="flex items-center gap-2 ml-auto">
            {/* Always show the search input and buttons */}
            <div className="relative flex items-center">
              <Input
                ref={searchInputRef}
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
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-transparent text-[oklch(var(--foreground))] hover:bg-slate-800 hover:text-[oklch(var(--foreground))]"
            >
              <UploadIcon className="size-4 mr-1" />
              <span className="hidden lg:inline">Import</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(true)}
              className="bg-transparent text-[oklch(var(--foreground))] hover:bg-slate-800 hover:text-[oklch(var(--foreground))]"
            >
              <PlusIcon className="size-4 mr-1" />
              <span className="hidden lg:inline">Add Customer</span>
            </Button>
          </div>
        </div>
        <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="overflow-hidden rounded-[0.75rem] border">
            {data.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter}>
                <SortableContext
                  items={data.filter((item) => item.ID || item.id).map((item) => item.ID || item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <TableContent />
                </SortableContext>
              </DndContext>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-lg font-medium text-muted-foreground">No customer data available</p>
                <p className="text-sm text-muted-foreground mb-4">Start by adding customers or importing data</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsFormOpen(true)}>
                    <PlusIcon className="size-4 mr-1" />
                    Add Customer
                  </Button>
                  <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
                    <UploadIcon className="size-4 mr-1" />
                    Import Data
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Move batch delete button here, before pagination */}
          {Object.keys(rowSelection).length > 0 && (
            <div className="flex justify-end mb-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Selected ({Object.keys(rowSelection).length})
              </Button>
            </div>
          )}

          {/* Pagination controls */}
          <div className="flex items-center justify-between px-4">
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
                    table.setPageSize(Number(value));
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
                  className="hidden h-8 w-8 p-0 lg:flex"
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
                  className="hidden h-8 w-8 p-0 lg:flex"
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
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleBatchUpload}
      />
    </>
  );
}