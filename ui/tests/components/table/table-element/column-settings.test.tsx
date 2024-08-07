import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnSettings from '@/components/table/table-element/column-settings';
import {Table} from '@tanstack/table-core';
import {GroupingPath} from '@/models/groupings-api-results';

// Mock for column visibility
const mockColumnVisibility = {
    description: true,
    path: false,
};

// Mock implementation for columns
// Mock implementation for columns
const mockColumns = [
    {
        id: 'description',
        getCanHide: () => true,
        getIsVisible: () => mockColumnVisibility['description'],
        columnDef: { header: 'description' },
        toggleVisibility: jest.fn((isVisible: boolean) => {
            mockColumnVisibility['description'] = isVisible;
        }),
    },
    {
        id: 'path',
        getCanHide: () => true,
        getIsVisible: () => mockColumnVisibility['path'],
        columnDef: { header: 'path' },
        toggleVisibility: jest.fn((isVisible: boolean) => {
            mockColumnVisibility['path'] = isVisible;
        }),
    },
];

// Mock getAllColumns method to return mockColumns
const mockGetAllColumns = jest.fn().mockReturnValue(mockColumns);

// Mock Table
const mockTable = {
    getAllColumns: mockGetAllColumns,
} as unknown as Table<GroupingPath>;

describe('ColumnSettings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mock state
        mockColumnVisibility.description = true;
        mockColumnVisibility.path = false;
    });


    it('toggles column visibility', async () => {
        render(<ColumnSettings table={mockTable}/>);
        const user = userEvent.setup();

        // Open the dropdown menu
        const button = screen.getByTestId('column-settings-button');
        await waitFor(async () => {
            await user.click(button);
        });

        // Toggle the visibility of 'description'
        const descriptionSwitch = screen.getByTestId('description Switch');

        // Initially, it should be checked (true)
        expect(descriptionSwitch).toBeChecked();
        expect(mockColumnVisibility['description']).toBeTruthy(); // Visibility should be false

        // Simulate the toggle switch to unchecked (false)
        await waitFor(async () => {
            await user.click(descriptionSwitch);
            expect(mockColumnVisibility['description']).toBeFalsy(); // Visibility should be false
        });

        // Ensure dropdown menu has closed
        await waitFor(() => {
            expect(screen.queryByTestId('description Switch')).not.toBeInTheDocument();
        });

        await waitFor(async () => {
            await user.click(button);
        });
        const reopenedGroupingPathSwitch = await screen.findByTestId('description Switch');
        //Simulate the toggle switch back to checked (true)
        await waitFor(async () => {
            await user.click( reopenedGroupingPathSwitch);
            expect(reopenedGroupingPathSwitch).toHaveAttribute('aria-checked', 'true');
        });

        expect(mockColumnVisibility['description']).toBeTruthy(); // Visibility should be true


    });
});
