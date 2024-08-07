'use client';
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ColumnSettings from '@/components/table/table-element/column-settings';
import GroupingsTableHeaders from '@/components/table/table-element/groupings-table-headers';
import PaginationBar from '@/components/table/table-element/pagination';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useEffect, useRef, useState } from 'react';
import { SquarePen } from 'lucide-react';
import GroupingPathCell from '@/components/table/table-element/grouping-path-cell';
import { GroupingPath } from '@/models/groupings-api-results';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useLocalStorage from '@/hooks/use-local-storage';

const GroupingsTable = ({ groupingPaths }: { groupingPaths: GroupingPath[] }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [overflowingCells, setOverflowingCells] = useState<Record<string, boolean>>({});

    // Create a dynamic ref object
    const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        const checkOverflow = () => {
            const newOverflowingCells: Record<string, boolean> = {};
            // Check each cell's overflow status
            Object.keys(cellRefs.current).forEach((cellId) => {
                const cell = cellRefs.current[cellId];
                if (cell) {
                    const { scrollWidth, clientWidth } = cell;
                    newOverflowingCells[cellId] = scrollWidth > clientWidth;
                }
            });
            setOverflowingCells(newOverflowingCells);
        };

        checkOverflow(); // Check overflow on mount
        window.addEventListener('resize', checkOverflow); // Recheck on resize

        return () => {
            window.removeEventListener('resize', checkOverflow); // Cleanup
        };
    }, [groupingPaths]);

    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>('columnVisibility', {
        description: true,
        path: false
    });

    const table = useReactTable({
        columns: GroupingsTableHeaders,
        data: groupingPaths,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting, columnVisibility },
        initialState: { pagination: { pageSize: 20 } },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        enableMultiSort: true
    });

    const columnCount = table.getHeaderGroups()[0].headers.length;

    return (
        <div className="">
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color text-center pt-3">Manage Groupings</h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <div className="hidden sm:block">
                        <ColumnSettings table={table} />
                    </div>
                </div>
            </div>
            <div className="overflow-hidden">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`border-solid 
                                        border-t-[1px] border-b-[2px] py-3 leading-[1.5] ${columnCount === 2 && index === 1 ? 'w-2/3' : 'w-1/3'} ${
                                            header.column.id !== 'name' ? 'hidden sm:table-cell' : ''
                                        }`}
                                    >
                                        <div className="flex items-center text-[0.8rem] font-bold text-uh-black uppercase">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() && <SortArrow direction={header.column.getIsSorted()} />}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row, index) => (
                            <TableRow key={row.id} className={index % 2 === 0 ? 'bg-light-grey' : ''}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={`p-0 ${cell.column.id !== 'name' ? 'hidden sm:table-cell' : ''}`}
                                        width={cell.column.columnDef.size}
                                    >
                                        <div className="flex items-center pl-2 pr-2 text-[15.5px] overflow-hidden whitespace-nowrap">
                                            <div className="m-2">
                                                {cell.column.id === 'name' && (
                                                    <Link href={`/groupings/${cell.row.getValue('path')}`}>
                                                        <div className="flex">
                                                            <SquarePen className="text-text-primary w-[1.25em] h-[1.25em]" data-testid={'square-pen-icon'} />
                                                            <div className="text-table-text text-[1rem] pl-2">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                            {cell.column.id === 'description' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                ref={(el) => {
                                                                    cellRefs.current[cell.id] = el;
                                                                }}
                                                                className={`text-table-text text-[1rem] ${
                                                                    columnCount === 3 ? 'truncate sm:max-w-[calc(6ch+1em)] md:max-w-[calc(40ch+1em)]' : 'truncate'
                                                                }`}
                                                            >
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </div>
                                                        </TooltipTrigger>

                                                        {overflowingCells[cell.id] && (
                                                            <TooltipContent className="bg-black text-white max-w-[190px] max-h-[170px] overflow-auto">
                                                                <p className="whitespace-normal break-words text-center">
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </p>
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {cell.column.id === 'path' && <GroupingPathCell path={cell.row.getValue('path')} />}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PaginationBar table={table} />
        </div>
    );
};


export default GroupingsTable;
