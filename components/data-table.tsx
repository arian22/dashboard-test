"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  reviewer: z.string(),
})

function DragHandle({
  attributes,
  listeners,
}: {
  attributes?: React.HTMLAttributes<HTMLElement>
  listeners?: Record<string, any>
}) {
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const getColumns = (
  onOpen: (item: z.infer<typeof schema>) => void
): ColumnDef<z.infer<typeof schema>>[] => [
    {
      id: "drag",
      header: () => null,
      cell: () => null,
    },
    // TYPE
    {
      accessorKey: "type",
      header: "گروه",
    },
    // HEADER
    {
      accessorKey: "header",
      header: "تسک",
      enableHiding: false,
      cell: ({ row }) => (
        <div
          className="cursor-pointer hover:underline"
          onClick={() => onOpen(row.original)}
        >
          {row.original.header}
        </div>
      ),
    },
    // STATUS
    {
      accessorKey: "status",
      header: "وضعیت",
      cell: ({ row }) => {
        const status = row.original.status

        return (
          <div dir="rtl" className="flex items-center gap-2">
            {status === "انجام شده" && (
              <IconCircleCheckFilled className="text-primary size-4" />
            )}
            <span>{status}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "reviewer",
      header: "مدیر",
    },
    {
      id: "actions",
      header: () => null,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32">
            <DropdownMenuItem>اصلاح</DropdownMenuItem>
            <DropdownMenuItem>انتقال تسک</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">حذف</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]


function DraggableRow({
  row,
  onOpen,
}: {
  row: Row<z.infer<typeof schema>>
  onOpen: (item: z.infer<typeof schema>) => void
}) {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } =
    useSortable({ id: row.id })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === "drag" ? (
            <DragHandle attributes={attributes} listeners={listeners} />
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeRow, setActiveRow] = React.useState<z.infer<typeof schema> | null>(null)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const dragScrollX = React.useRef(0)
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id.toString()) || [],
    [data]
  )

  const openRow = React.useCallback((item: z.infer<typeof schema>) => {
    const el = scrollRef.current
    const x = el?.scrollLeft ?? 0

    setActiveRow(item)

    requestAnimationFrame(() => {
      if (el) el.scrollLeft = x
    })
  }, [])

  const table = useReactTable({
    data,
    columns: getColumns(openRow),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return

    setData((items) => {
      const ids = items.map((i) => i.id)
      const oldIndex = ids.indexOf(Number(active.id))
      const newIndex = ids.indexOf(Number(over.id))
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  if (!mounted) return null
  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">
              <Badge variant="secondary">10</Badge>
              تمام تسک ها</SelectItem>
            <SelectItem value="past-performance">
              <Badge variant="secondary">4</Badge>
              انجام شده </SelectItem>
            <SelectItem value="key-personnel">
              <Badge variant="secondary">6</Badge>
              در حال انجام </SelectItem>
            <SelectItem value="focus-documents">
              <Badge variant="secondary">71</Badge>
              تسک های بسته شده</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">
            <Badge variant="secondary">10</Badge>
            تمام تسک ها</TabsTrigger>
          <TabsTrigger value="past-performance">
            <Badge variant="secondary">4</Badge>
            انجام شده
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            <Badge variant="secondary">6</Badge>
            در حال انجام
          </TabsTrigger>
          <TabsTrigger value="focus-documents">
            <Badge variant="secondary">71</Badge>
            تسک های بسته شده</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <span>افزودن تسک</span>
            <IconPlus />
          </Button>
        </div>
      </div>
      <TabsContent
        ref={scrollRef}
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >

        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragStart={() => {
              dragScrollX.current = scrollRef.current?.scrollLeft ?? 0
            }}
            onDragEnd={(e) => {
              handleDragEnd(e)
              requestAnimationFrame(() => {
                const el = scrollRef.current
                if (el) el.scrollLeft = dragScrollX.current
              })
            }}
            sensors={sensors}
            id={sortableId}
          >

            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} onOpen={setActiveRow} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={getColumns(() => { }).length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit" dir="rtl">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                تعداد ردیف
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
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
            <div className="flex w-fit items-center justify-center text-sm font-medium" dir="rtl">
              صفحه {table.getState().pagination.pageIndex + 1} از {" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">


              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">صفحه بعدی</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">رفتن به صفحه آخر</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">صفحه قبلی</span>
                <IconChevronsRight />
              </Button>

              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">رفتن به صفحه اول</span>
                <IconChevronsLeft />
              </Button>

            </div>
          </div>
        </div>
        <div className="block md:hidden h-6" />
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      {activeRow && (
        <TableCellViewer
          item={activeRow}
          onClose={() => setActiveRow(null)}
        />
      )}
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({
  item,
  onClose,
}: {
  item: z.infer<typeof schema>
  onClose: () => void
}) {
  const isMobile = useIsMobile()

  return (
    <Drawer
      open={!!item}
      onOpenChange={(open) => {
        if (!open) {
          if (!open) onClose()
        }
      }}
      direction={isMobile ? "bottom" : "left"}
    >
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-right">{item.header}</DrawerTitle>
          <DrawerDescription className="text-right">
            اصلاح تسک
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">عنوان</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">گروه</Label>
                <Select defaultValue={item.type} dir="rtl">
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="سکه">
                      سکه
                    </SelectItem>
                    <SelectItem value="طلا">
                      طلا
                    </SelectItem>
                    <SelectItem value="ارز">
                      ارز
                    </SelectItem>
                    <SelectItem value="بانک">بانک</SelectItem>
                    <SelectItem value="موجودی">موجودی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">وضعیت</Label>
                <Select defaultValue={item.status} dir="rtl">
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="انجام شده">انجام شده</SelectItem>
                    <SelectItem value="در حال انجام">در حال انجام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">مدیر</Label>
              <Select defaultValue={item.reviewer} dir="rtl">
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="علی">علی</SelectItem>
                  <SelectItem value="محمد">
                    محمد
                  </SelectItem>
                  <SelectItem value="رضا">رضا</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <div className="block md:hidden h-6" />
        <DrawerFooter className="grid grid-cols-2 gap-2">
          <DrawerClose asChild>
            <Button className="w-full">اصلاح</Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              بستن
            </Button>
          </DrawerClose>
        </DrawerFooter>
        <div className="block md:hidden h-6" />

      </DrawerContent>
    </Drawer>
  )
}
