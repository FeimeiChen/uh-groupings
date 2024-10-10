import { ColumnDef } from '@tanstack/react-table';
import { GroupingPath } from '@/lib/types';
import Link from 'next/link';
import { SquarePen } from 'lucide-react';
import TooltipOnTruncate from '@/components/table/table-element/tooltip-on-truncate';
import GroupingPathCell from '@/components/table/table-element/grouping-path-cell'; // Adjust the import based on your actual file structure

const GroupingsTableColumns = (columnCount: number): ColumnDef<GroupingPath>[] => {
    return [
        {
            header: 'Grouping Name',
            accessorKey: 'name',
            enableHiding: false,
            sortDescFirst: true,
            cell: ({row}) => (
                <div className="m-2 'w-full'">
                    <Link href={`/groupings/${row.getValue('path')}`}>
                        <div className="flex">
                            <SquarePen size="1.25em" className="text-text-primary" data-testid={'square-pen-icon'}/>
                            <div className="pl-2">{row.getValue('name')}</div>
                        </div>
                    </Link>
                </div>
            )
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: ({row}) => (
                <TooltipOnTruncate value={String(row.getValue('description') as string)}>
                    <div
                        className={`${
                            columnCount === 3
                                ? 'truncate sm:max-w-[calc(6ch+1em)] md:max-w-[calc(40ch+1em)]'
                                : 'truncate'
                        }`}
                    >
                        {row.getValue('description')}
                    </div>
                </TooltipOnTruncate>
            )
        },
        {
            header: 'Grouping Path',
            accessorKey: 'path',
            cell: ({row}) => <GroupingPathCell path={row.getValue('path')}/>
        }
    ];
}
export default GroupingsTableColumns;
