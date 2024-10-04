import React, { useEffect, useState, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TooltipOnTruncate = ({ children, value }: { children: React.ReactNode; value: string }) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const checkTruncation = () => {
            if (containerRef.current) {
                const isOverflowing = containerRef.current.scrollWidth !== containerRef.current.clientWidth;
                console.log('Is Overflowing:', containerRef.current.scrollWidth > containerRef.current.clientWidth);
                setIsTruncated(isOverflowing);
            }
        };

        checkTruncation();

        window.addEventListener('resize', checkTruncation);

        return () => {
            window.removeEventListener('resize', checkTruncation);
        };
    }, []);

    return (
        <div ref={containerRef} className="flex w-full whitespace-nowrap">
            {isTruncated ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="">{children}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p data-testid="tooltip">{value}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                children
            )}
        </div>
    );
};

export default TooltipOnTruncate;
