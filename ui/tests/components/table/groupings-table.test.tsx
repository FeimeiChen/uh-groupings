import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import GroupingsTable from '@/components/table/groupings-table';
import user from '@/access/user';
import userEvent from '@testing-library/user-event';

const generateSampleData = Array.from({ length: 200 }, (_, i) => ({
    path: `tmp:example:example-${i}`,
    name: `example-${i}`,
    description: `Test Description ${i}`
}));

const clickAndWaitForSorting = async (headerText: string, expectedOrder: string[], isAscending = true) => {
    fireEvent.click(screen.getByText(headerText));
    await waitFor(() => {
        const chevronIcon = screen.getByTestId(isAscending ? 'chevron-up-icon' : 'chevron-down-icon');
        expect(chevronIcon).toBeInTheDocument();
    });
    const rows = screen.getAllByRole('row');
    expectedOrder.forEach((item, index) => {
        expect(rows[index + 1]).toHaveTextContent(item);
    });
};

describe('GroupingsTable', () => {
    test('renders table correctly', async () => {
        render(<GroupingsTable groupingPaths={generateSampleData} />);

        // Check for "Manage Groupings", filter, and column settings
        expect(screen.getByText('Manage Groupings')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Filter Groupings...')).toBeInTheDocument();
        expect(screen.getByTestId('column-settings-button')).toBeInTheDocument();

        // Check for table column headers
        expect(screen.getByText('Grouping Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.queryByText('Grouping Path')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(generateSampleData.length);

        const first20Groupings = generateSampleData.slice(0, 20); // table has 20 rows
        first20Groupings.forEach((group) => {
            expect(screen.getAllByTestId('square-pen-icon')[0]).toBeInTheDocument();
            expect(screen.getByText(group.name)).toBeInTheDocument();
            expect(screen.getByText(group.description)).toBeInTheDocument();
            expect(screen.queryByDisplayValue(group.path)).not.toBeInTheDocument();
        });

        // Check for pagination
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText(1)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('filters data correctly using global filter', () => {
        render(<GroupingsTable groupingPaths={generateSampleData} />);

        const filterInput = screen.getByPlaceholderText('Filter Groupings...');
        fireEvent.change(filterInput, { target: { value: '1' } });

        expect(screen.getByText('example-1')).toBeInTheDocument();
        expect(screen.queryByText('example-0')).not.toBeInTheDocument();

        fireEvent.change(filterInput, { target: { value: '0' } });
        expect(screen.getByText('example-0')).toBeInTheDocument();
        expect(screen.queryByText('example-1')).not.toBeInTheDocument();
    });

    it('sorts data when header is clicked', async () => {
        render(<GroupingsTable groupingPaths={generateSampleData} />);
        const user = userEvent.setup();

        await waitFor(async () => {
            await user.click(screen.getByTestId('column-settings-button'));
        });
        const groupingPathSwitch = await screen.findByTestId('Grouping Path Switch');
        expect(groupingPathSwitch).toBeVisible();
        expect(groupingPathSwitch).toHaveAttribute('aria-checked', 'false');

        // Click the switch to toggle it
        await waitFor(async () => {
            await user.click(groupingPathSwitch);
        });

        // Sort by grouping name
        await clickAndWaitForSorting('Grouping Name', ['example-0', 'example-1'], true);

        // Descending order
        await clickAndWaitForSorting(
            'Grouping Name',
            [`example-${generateSampleData.length - 1}`, `example-${generateSampleData.length - 2}`],
            false
        );

        // Sort by description
        await clickAndWaitForSorting('Description', ['Test Description 0', 'Test Description 1'], true);

        // Descending order
        await clickAndWaitForSorting(
            'Description',
            [`Test Description ${generateSampleData.length - 1}`, `Test Description ${generateSampleData.length - 2}`],
            false
        );

        // Sort by grouping path
        await clickAndWaitForSorting('Grouping Path', ['example-0', 'example-1'], true);

        // Descending order
        await clickAndWaitForSorting(
            'Grouping Path',
            [`example-${generateSampleData.length - 1}`, `example-${generateSampleData.length - 2}`],
            false
        );
    }, 10000);

    it('column settings', async () => {
        render(<GroupingsTable groupingPaths={generateSampleData} />);
        const button = screen.getByTestId('column-settings-button');
        const user = userEvent.setup();

        const toggleColumnVisibility = async (columnTestId: string, isVisible: boolean) => {
            await waitFor(async () => {
                await user.click(button);
            });
            fireEvent.click(screen.getByTestId(columnTestId));
            if (isVisible) {
                // Check getByText('Description') or getByText('Grouping Path') to be in document
                expect(screen.getByText(columnTestId.replace(' Switch', ''))).toBeInTheDocument();
            } else {
                expect(screen.queryByText(columnTestId.replace(' Switch', ''))).not.toBeInTheDocument();
            }
        };
        // Toggle description column
        await toggleColumnVisibility('Description Switch', false);
        await toggleColumnVisibility('Description Switch', true);

        // Toggle grouping path column
        await toggleColumnVisibility('Grouping Path Switch', false);
        await toggleColumnVisibility('Grouping Path Switch', true);
    });

    it('Pagination buttons work correctly', async () => {
        const pageSize = 20;
        render(<GroupingsTable groupingPaths={generateSampleData} />);

        const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1); // +1 for header row
            expect(screen.getByText(`example-${expectedRowStart}`)).toBeInTheDocument();
            expect(screen.getByText(`example-${expectedRowEnd}`)).toBeInTheDocument();
        };
        await checkPageContent('First', 0, pageSize - 1);
        await checkPageContent('Next', pageSize, pageSize * 2 - 1);
        await checkPageContent('Last', generateSampleData.length - pageSize, generateSampleData.length - 1);
        await checkPageContent(
            'Previous',
            generateSampleData.length - pageSize * 2,
            generateSampleData.length - pageSize - 1
        );
    });
});
