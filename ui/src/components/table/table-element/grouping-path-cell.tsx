import { ClipboardIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect, useRef } from 'react';

const GroupingPathCell = ({ path }: { path: string }) => {
    const [tooltipContent, setTooltipContent] = useState('copy');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [showInputTooltip, setShowInputTooltip] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = async () => {
        await navigator.clipboard.writeText(path);
        setTooltipContent('copied!');
        setTooltipVisible(true);

        setTimeout(() => {
            setTooltipVisible(false);
            setTimeout(() => {
                setTooltipContent('copy'); // Reset content after the tooltip is hidden
            }, 1000);
        }, 2000);
    };

    useEffect(() => {
        const checkOverflow = () => {
            if (inputRef.current) {
                const { scrollWidth, clientWidth } = inputRef.current;
                setShowInputTooltip(scrollWidth > clientWidth);
            }
        };

        checkOverflow(); // Initial check
        window.addEventListener('resize', checkOverflow); // Check on window resize

        return () => {
            window.removeEventListener('resize', checkOverflow); // Cleanup listener
        };
    }, [path]);

    return (
        <div className="flex items-center w-full outline outline-1 rounded h-6 m-1">
            {showInputTooltip ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Input
                                id="dataInput"
                                value={path}
                                readOnly
                                className="flex-1 h-6 text-input-text-grey text-[0.875rem]
                                border-none rounded-none w-[161px] truncate"
                                ref={inputRef}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>{path}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <Input
                    id="dataInput"
                    value={path}
                    readOnly
                    className="flex-1 h-6 text-input-text-grey text-[0.875rem]
                        border-none rounded-none w-[161px] truncate"
                    ref={inputRef}
                />
            )}
            <TooltipProvider>
                <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleClick}
                            className="relative flex-shrink-0 flex items-center
                             justify-center hover:bg-green-blue h-6 p-2 transition ease-in-out duration-150"
                            data-testid="clipboard-button"
                        >
                            <ClipboardIcon className="h-4 w-4 text-gray-600" data-testid="clipboard-icon" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p data-testid="tooltip">{tooltipContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default GroupingPathCell;
