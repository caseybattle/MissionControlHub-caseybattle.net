'use client';

import React from 'react';
import { Status } from './types';

const StatusBadge = ({ status }: { status: Status | string }) => {
    // Normalize status
    let normalized = (status || 'IDLE').toUpperCase();
    if (normalized === 'ACTIVE') normalized = 'OK';
    if (normalized === 'RUNNING') normalized = 'OK';

    // Config for colors/styles
    const config: Record<string, { bg: string; border: string; text: string; shadow: string; dot: string }> = {
        'OK': {
            bg: 'bg-[rgba(0,86,179,0.1)]',
            border: 'border-[rgba(0,86,179,0.3)]',
            text: 'text-[var(--blue)]',
            shadow: 'shadow-[0_0_10px_rgba(0,86,179,0.2)]',
            dot: 'bg-[var(--blue)] shadow-[0_0_8px_var(--blue)]'
        },
        'LATE': {
            bg: 'bg-[rgba(234,179,8,0.1)]',
            border: 'border-[rgba(234,179,8,0.3)]',
            text: 'text-[var(--late)]',
            shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.2)]',
            dot: 'bg-[var(--late)] shadow-[0_0_8px_var(--late)]'
        },
        'ERROR': {
            bg: 'bg-[rgba(239,68,68,0.1)]',
            border: 'border-[rgba(239,68,68,0.3)]',
            text: 'text-[var(--err)]',
            shadow: 'shadow-[0_0_10px_rgba(239,68,68,0.2)]',
            dot: 'bg-[var(--err)] shadow-[0_0_8px_var(--err)]'
        },
        'IDLE': {
            bg: 'bg-[rgba(255,255,255,0.05)]',
            border: 'border-[rgba(255,255,255,0.1)]',
            text: 'text-[var(--text-secondary)]',
            shadow: 'none',
            dot: 'bg-[var(--text-secondary)] opacity-50'
        }
    };

    const style = config[normalized] || config['IDLE'];

    return (
        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${style.bg} ${style.border} ${style.shadow} transition-all duration-300`}>
            <span className="relative flex h-2 w-2">
                {normalized === 'OK' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`}></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot} ${normalized === 'LATE' || normalized === 'ERROR' ? 'animate-pulse' : ''}`}></span>
            </span>
            <span className={`text-[11px] font-bold tracking-wider ${style.text}`}>
                {normalized}
            </span>
        </span>
    );
};

export default StatusBadge;
