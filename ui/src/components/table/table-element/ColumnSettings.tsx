'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { GroupingPath } from '@/models/groupings-api-results';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {Table} from '@tanstack/table-core';

interface ToggleProps {
    table: Table<GroupingPath>;
}
const ColumnSettings = ({ table } : ToggleProps) => {
    const [description, setDescription] = useState(true);
    const [groupingPath, setGroupingPath] = useState(true);

    const toggleDescription = () => {
        setDescription((prevState) => {
            const newState = !prevState;
            table.getColumn('DESCRIPTION')?.toggleVisibility(newState);
            return newState;
        });
    };

    const toggleGroupingPath = () => {
        setGroupingPath((prevState) => {
            const newState = !prevState;
            table.getColumn('GROUPING PATH')?.toggleVisibility(newState);
            return newState;
        });
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border border-gray-300 hover:bg-transparent">
                        <FontAwesomeIcon icon={faSliders} className="w-5 h-5 text-text-color"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup>
                        <DropdownMenuRadioItem value="description" className="px-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="description" checked={description}
                                        onCheckedChange={toggleDescription}
                                        className="data-[state=checked]:bg-uh-teal"/>
                                <Label htmlFor="description">Description</Label>
                            </div>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="grouping path" className="px-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="grouping-path" checked={groupingPath}
                                        onCheckedChange={toggleGroupingPath}
                                        className="data-[state=checked]:bg-uh-teal"/>
                                <Label htmlFor="grouping-path">Grouping Path</Label>
                            </div>
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ColumnSettings;
