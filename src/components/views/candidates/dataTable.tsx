import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnSizingState,
    Updater,
} from "@tanstack/react-table";
import { useTableStore } from '@/store/tableStore';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    readonly columns: ColumnDef<TData, TValue>[];
    readonly data: TData[];
    readonly stickyConfig?: Record<string, string>;
    readonly enableLayoutFixed?: boolean;
    readonly tableId: 'projects' | 'topics' | 'candidates' | 'interns' | 'staff';
}

// Create a stable empty object outside the component
const EMPTY_COLUMN_SIZING = {};

export function DataTable<TData, TValue>({
    columns,
    data,
    stickyConfig = {},
    enableLayoutFixed = false,
    tableId,
}: DataTableProps<TData, TValue>) {
    // Use a stable selector that doesn't create new objects
    const selector = React.useCallback((state: any) => {
        return state.columnSizing[tableId] || EMPTY_COLUMN_SIZING;
    }, [tableId]);

    const columnSizing = useTableStore(selector);
    const setStoreColumnSizing = useTableStore((state) => state.setColumnSizing);

    const handleColumnSizingChange = React.useCallback(
        (updaterOrValue: Updater<ColumnSizingState>) => {
            const newSizing = typeof updaterOrValue === 'function' 
                ? updaterOrValue(columnSizing) 
                : updaterOrValue;
            setStoreColumnSizing(tableId, newSizing);
        },
        [columnSizing, setStoreColumnSizing, tableId]
    );

    const table = useReactTable({
        defaultColumn: {
            size: 150, //start with a default size
        },
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        state: {
            columnSizing,
        },
        onColumnSizingChange: handleColumnSizingChange,
    });

    return (
        <div className="rounded-md border overflow-x-auto relative">
            <Table style={{ ...(enableLayoutFixed ? { tableLayout: 'fixed' } : {}), width: 'max-content' }}>
                <TableHeader className="sticky top-0 z-20 bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    style={{ width: header.getSize(), minWidth: Math.max(header.getSize(), header.column.columnDef.minSize || 80) }}
                                    className={`relative group text-center whitespace-nowrap font-semibold
                                        ${
                                            stickyConfig[header.column.id]
                                                ? `sticky z-10 bg-gray-50 ${stickyConfig[header.column.id]}`
                                                : ''
                                        }`
                                    }
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                    {(header.column.getCanResize() || true) && (
                                        <div
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                            className={`absolute top-1/2 right-0 h-1/2 w-0.5 cursor-col-resize bg-blue-500/50 select-none touch-none transform -translate-y-1/2 ${
                                                header.column.getIsResizing() ? 'bg-blue-500 opacity-100' : ''
                                            }`}
                                        />
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows
                            .filter((row) => row && row.original) // Filter out undefined rows
                            .map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        style={{ width: cell.column.getSize(), minWidth: Math.max(cell.column.getSize(), cell.column.columnDef.minSize || 80) }}
                                        className={`text-center bg-white
                                            ${
                                                stickyConfig[cell.column.id]
                                                    ? `sticky z-10 ${stickyConfig[cell.column.id]}`
                                                    : ''
                                            }`
                                        }
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}