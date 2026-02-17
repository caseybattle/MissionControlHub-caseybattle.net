'use client';

import { useEffect, useMemo, useState } from 'react';
import { FirestoreCard, subscribeToCards } from '@/lib/firestore';
import { ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react';
import { toDate, formatDateKey } from '../shared/utils';
import { getStatusColor } from '../shared/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarView() {
    const [cards, setCards] = useState<FirestoreCard[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

    useEffect(() => {
        const unsub = subscribeToCards(setCards);
        return unsub;
    }, []);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    // Group cards by dueDate or createdAt as fallback.
    const cardsByDate = useMemo(() => {
        const map = new Map<string, FirestoreCard[]>();

        cards.forEach(card => {
            const due = toDate(card.dueDate as any);
            const created = toDate(card.createdAt as any);
            const target = due || created;
            if (!target) return;

            const key = formatDateKey(target);
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(card);
        });

        return map;
    }, [cards]);

    // Build calendar grid
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const getDateKey = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const selectedItems = selectedDateKey ? (cardsByDate.get(selectedDateKey) || []) : [];

    const selectedDateLabel = useMemo(() => {
        if (!selectedDateKey) return '';
        // Fix for date parsing in different locales/timezones, or just stick to standard
        const [y, m, d] = selectedDateKey.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        return dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }, [selectedDateKey]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <h1 className="text-lg md:text-2xl font-bold text-[var(--text)]">
                    <span className="hidden md:inline">{MONTHS[month]}</span>
                    <span className="md:hidden">{MONTHS_SHORT[month]}</span>
                    {' '}{year}
                </h1>
                <div className="flex items-center gap-1.5 md:gap-2">
                    <button onClick={goToday} className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--panel)] text-[var(--text-secondary)] hover:bg-[var(--panel-2)] transition-colors border border-[var(--stroke)]">
                        Today
                    </button>
                    <button onClick={prevMonth} className="p-1.5 md:p-2 rounded-lg bg-[var(--panel)] text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--text)] transition-colors border border-[var(--stroke)]">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextMonth} className="p-1.5 md:p-2 rounded-lg bg-[var(--panel)] text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--text)] transition-colors border border-[var(--stroke)]">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d, i) => (
                    <div key={d} className="text-center text-[10px] md:text-xs font-bold text-[var(--muted)] uppercase tracking-wider py-1.5 md:py-2">
                        <span className="hidden md:inline">{d}</span>
                        <span className="md:hidden">{DAYS_SHORT[i]}</span>
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 border border-[var(--stroke)] rounded-xl overflow-hidden">
                {cells.map((day, i) => {
                    const dateKey = day ? getDateKey(day) : '';
                    const dayCards = day ? (cardsByDate.get(dateKey) || []) : [];
                    const todayClass = day && isToday(day);
                    const selected = day && selectedDateKey === dateKey;

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => day && setSelectedDateKey(dateKey)}
                            className={`text-left border-b border-r border-[var(--stroke)] p-1 md:p-1.5 min-h-[60px] md:min-h-[90px] relative transition-colors ${day ? 'hover:bg-[var(--panel-2)]' : 'bg-[var(--bg-1)]'} ${selected ? 'bg-[var(--panel-2)] ring-1 ring-[var(--blue)]' : ''}`}
                            disabled={!day}
                        >
                            {day && (
                                <>
                                    <div className={`text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full ${todayClass ? 'bg-[var(--blue)] text-white' : 'text-[var(--text-secondary)]'}`}>
                                        {day}
                                    </div>
                                    <div className="space-y-0.5 overflow-hidden max-h-[35px] md:max-h-[60px]">
                                        {dayCards.slice(0, 2).map(card => (
                                            <div
                                                key={card.id}
                                                className="text-[10px] leading-tight px-1.5 py-0.5 rounded truncate font-medium"
                                                style={{
                                                    backgroundColor: getStatusColor(card.status) + '20',
                                                    color: getStatusColor(card.status),
                                                    borderLeft: `2px solid ${getStatusColor(card.status)}`,
                                                }}
                                                title={card.title}
                                            >
                                                {card.title}
                                            </div>
                                        ))}
                                        {dayCards.length > 2 && (
                                            <div className="text-[9px] text-[var(--muted)] pl-1">+{dayCards.length - 2} more</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Day Drilldown Drawer */}
            {selectedDateKey && (
                <div className="mt-4 border border-[var(--stroke)] rounded-xl bg-[var(--panel)] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--stroke)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-[var(--blue)]" />
                            <div>
                                <div className="text-sm text-[var(--text)] font-semibold">{selectedDateLabel}</div>
                                <div className="text-xs text-[var(--muted)]">{selectedItems.length} item{selectedItems.length === 1 ? '' : 's'}</div>
                            </div>
                        </div>
                        <button className="p-1.5 rounded-md hover:bg-[var(--panel-2)] text-[var(--muted)] hover:text-[var(--text)]" onClick={() => setSelectedDateKey(null)}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                        {selectedItems.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-[var(--muted)]">No cards logged for this day yet.</div>
                        ) : (
                            <div className="divide-y divide-[var(--stroke)]">
                                {selectedItems.map((item) => {
                                    const due = toDate(item.dueDate as any);
                                    const created = toDate(item.createdAt as any);
                                    return (
                                        <div key={item.id} className="px-4 py-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-sm text-[var(--text)] font-medium truncate">{item.title}</div>
                                                <span
                                                    className="text-[10px] px-2 py-0.5 rounded-full border"
                                                    style={{
                                                        color: getStatusColor(item.status),
                                                        borderColor: getStatusColor(item.status) + '66',
                                                        backgroundColor: getStatusColor(item.status) + '14'
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-xs text-[var(--muted)] flex flex-wrap gap-3">
                                                <span>Category: {item.category || 'Uncategorized'}</span>
                                                {due && <span>Due: {due.toLocaleDateString()}</span>}
                                                {created && <span>Created: {created.toLocaleDateString()}</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
