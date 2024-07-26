import { useState } from 'react';
import { ClipboardIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

const GroupingPathComponent = ({ data, uniqueId }) => {
    const [tooltipContent, setTooltipContent] = useState('copy');
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        const input = document.getElementById(`dataInput-${uniqueId}`) as HTMLInputElement;
        if (input) {
            input.focus();
            input.setSelectionRange(0, input.value.length);
        }
        navigator.clipboard.writeText(data).then(() => {
            setTooltipContent('copied!');
            setShowTooltip(true);
            setTimeout(() => {
                setTooltipContent('copy');
                setShowTooltip(false);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleMouseEnter = () => setShowTooltip(true);
    const handleMouseLeave = () => {
        if (tooltipContent === 'copy') {
            setShowTooltip(false);
        }
    };

    return (
        <div className='flex items-center w-full outline outline-1 rounded h-6 m-1'>
            <Input
                id={`dataInput-${uniqueId}`}
                // readOnly
                value={data}
                className='flex-1 w-full h-6 '
            />
            <div className='relative flex-shrink-0 flex items-center justify-center hover:bg-green-blue h-6'>
                <button
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className='flex items-center justify-center h-full w-full p-2'
                >
                    <ClipboardIcon className="h-5 w-5 text-gray-600" />
                </button>
                {showTooltip && (
                    <div className='absolute bottom-full mb-2 px-1 py-2 bg-gray-800 text-white rounded'>
                        {tooltipContent}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupingPathComponent;
