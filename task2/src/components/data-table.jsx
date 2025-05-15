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
import {
  SortableContext,
  useSortable,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
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
    </div>
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
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} onCopy={handleCopy} onFavorite={handleFavorite} />,
  },
];

// Row actions component
function RowActions({ row, onEdit, onDelete, onCopy, onFavorite }) {
  const record = row?.original; // Safely access row.original

  if (!record) {
    return null; // Return null if record is undefined
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
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

export function DataTable({ data, onAddRecord, onDeleteRecord, onEditRecord }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editRecord, setEditRecord] = React.useState(null); // State for the record being edited

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { delay: 500, tolerance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const table = useReactTable({
    data, // Use the `data` prop directly
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, globalFilter, pagination },
    getRowId: (row) => row.ID.toString(),
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

  const handleFormSubmit = (formData) => {
    const newId = `ITEM${Date.now()}`;
    const newItem = {
      ID: newId,
      ...formData,
      Age: Number(formData.Age), // Convert Age to a number
      Income: Number(formData.Income), // Convert Income to a number
    };

    try {
      schema.parse(newItem);
      onAddRecord(newItem); // Use the onAddRecord prop
      toast.success("New item added!");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Validation Error:", error);
      toast.error("Failed to add item.");
    }
  };

  const handleEditSubmit = (updatedData) => {
    const updatedItem = {
      ...editRecord,
      ...updatedData,
      Age: Number(updatedData.Age), // Convert Age to a number
      Income: Number(updatedData.Income), // Convert Income to a number
    };

    try {
      schema.parse(updatedItem);
      onEditRecord(editRecord.ID, updatedItem); // Use the onEditRecord prop
      toast.success("Item updated!");
      setIsEditOpen(false);
      setEditRecord(null);
    } catch (error) {
      console.error("Validation Error:", error);
      toast.error("Failed to update item.");
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record); // Set the record to be edited
    setIsEditOpen(true); // Open the edit modal
  };

  const handleCopy = (record) => {
    const copiedRecord = { ...record, ID: `COPY${Date.now()}` };
    onAddRecord(copiedRecord); // Use the onAddRecord prop
    toast.success("Record copied!");
  };

  const handleFavorite = (record) => {
    toast.success(`${record.CustomerName} marked as favorite!`);
  };

  const handleDelete = (id) => {
    onDeleteRecord(id); // Use the onDeleteRecord prop
    toast.success("Item deleted!");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.ID === active.id);
      const newIndex = data.findIndex((item) => item.ID === over.id);
      const reorderedData = arrayMove(data, oldIndex, newIndex);
      reorderedData.forEach((item, index) => (item.Order = index)); // Optional: Update order field
      onAddRecord(reorderedData); // Update parent state
    }
  };

  return (
    <>
      <Tabs defaultValue="outline" className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Select defaultValue="outline">
            <SelectTrigger className="flex w-fit @4xl/main:hidden" id="view-selector">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="hidden @4xl/main:flex">
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="past-performance">
              Past Performance <Badge variant="secondary">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="key-personnel">
              Key Personnel <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
              <PlusIcon className="size-4 mr-1" />
              <span className="hidden lg:inline">Add Item</span>
            </Button>
          </div>
        </div>
        <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="overflow-hidden rounded-lg border">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={data.map((item) => item.ID)} strategy={verticalListSortingStrategy}>
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
                    {data.length ? (
                      data.map((row) => (
                        <TableRow key={row.ID} data-state={rowSelection[row.ID] ? "selected" : undefined}>
                          {columns.map((column) => (
                            <TableCell key={column.accessorKey || column.id}>
                              {column.accessorKey ? row[column.accessorKey] : null}
                            </TableCell>
                          ))}
                          <TableCell>
                            <RowActions
                              row={{ original: row }} // Pass row.original explicitly
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onCopy={handleCopy}
                              onFavorite={handleFavorite}
                            />
                          </TableCell>
                        </TableRow>
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
        </TabsContent>
      </Tabs>
      <FormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
      {isEditOpen && editRecord && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogClose onClick={() => setIsEditOpen(false)} />
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedData = Object.fromEntries(formData.entries());
                handleEditSubmit(updatedData);
              }}
              className="space-y-4"
            >
              <div>
                <Label>Customer Name</Label>
                <Input name="CustomerName" defaultValue={editRecord.CustomerName} />
              </div>
              <div>
                <Label>Division</Label>
                <Input name="Division" defaultValue={editRecord.Division} />
              </div>
              <div>
                <Label>Gender</Label>
                <Select defaultValue={editRecord.Gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Marital Status</Label>
                <Select defaultValue={editRecord.MaritalStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Age</Label>
                <Input name="Age" type="number" defaultValue={editRecord.Age} />
              </div>
              <div>
                <Label>Income</Label>
                <Input name="Income" type="number" defaultValue={editRecord.Income} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}