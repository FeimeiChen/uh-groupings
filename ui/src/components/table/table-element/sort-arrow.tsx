import { ChevronUp, ChevronDown } from 'lucide-react';

const SortArrow = ({ direction }: { direction: string | boolean }) => (
    <div>
        {direction === 'asc' ? (
            <ChevronUp size={15} strokeWidth={3} data-testid="chevron-up-icon" />
        ) : direction === 'desc' ? (
            <ChevronDown size={15} strokeWidth={3} data-testid="chevron-down-icon" />
        ) : null}
    </div>
);

export default SortArrow;
