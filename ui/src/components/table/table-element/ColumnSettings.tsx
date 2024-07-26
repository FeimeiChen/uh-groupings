'use client';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {Table} from '@tanstack/table-core';
import {useState} from 'react';
import {GroupingPath} from '@/groupings/GroupingsApiResults';

interface ToggleProps {
    table: Table<GroupingPath>;
}
const ColumnSettings = ({table}: ToggleProps) => {
    const [columnSetting, setColumnSetting] = useState('All');
    const toggleColumnVisibility = (columnName: string) => {
        table.getColumn('DESCRIPTION')?.toggleVisibility(true);
        table.getColumn('GROUPING PATH')?.toggleVisibility(true);

        if (columnName === 'DESCRIPTION'){
            table.getColumn('GROUPING PATH')?.toggleVisibility(false);
        } else if (columnName === 'GROUPING PATH') {
            table.getColumn('DESCRIPTION')?.toggleVisibility(false);
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border border-gray-300 hover:bg-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-text-color">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
                    </svg>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup value={columnSetting} onValueChange={setColumnSetting}>
                    <DropdownMenuRadioItem value="description" onSelect={() => toggleColumnVisibility('DESCRIPTION')}>
                        Show Description</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="grouping path" onSelect={() => toggleColumnVisibility('GROUPING PATH')}>Show
                        Grouping Path</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="All" onSelect={() => toggleColumnVisibility('all')}>Show
                        All</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
export default ColumnSettings;