'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
}

const StatCard = ({ title, value, subtitle, icon: Icon }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 group transition-all duration-200 border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--blue)]/40 hover:shadow-lg hover:shadow-blue-900/5"
    >
        <div className="flex items-start justify-between mb-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--blue)]/10 ring-1 ring-[var(--blue)]/20`}>
                <Icon className={`w-6 h-6 text-[var(--blue)]`} />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors">
                    <Settings className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                </button>
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">{value}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{subtitle}</p>
        </div>
    </motion.div>
);

export default StatCard;
