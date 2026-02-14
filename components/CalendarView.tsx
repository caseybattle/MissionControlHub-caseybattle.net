'use client';

import { useEffect, useState } from 'react';
import { FirestoreCard, subscribeToCards } from '@/lib/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarView() {
    const [cards, setCards] = useState<FirestoreCard[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

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

    // Group cards by due date
    const cardsByDate = new Map<string, FirestoreCard[]>();
    cards.forEach(card => {
        if (card.dueDate) {
            try {
                let key: string;
                if (typeof card.dueDate === 'string') {
                    key = card.dueDate;
                } else if (typeof (card.dueDate as any).toDate === 'function') {
                    const d = (card.dueDate as any).toDate();
                    key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                } else {
                    key = String(card.dueDate);
                }
                if (!cardsByDate.has(key)) cardsByDate.set(key, []);
                cardsByDate.get(key)!.push(card);
            } catch { /* skip */ }
        }
    });

    // Also group by createdAt for cards without due dates
    cards.forEach(card => {
        if (!card.dueDate && card.createdAt) {
            try {
                const d = typeof (card.createdAt as any).toDate === 'function'
                    ? (card.createdAt as any).toDate()
                    : new Date(card.createdAt as any);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!cardsByDate.has(key)) cardsByDate.set(key, []);
                cardsByDate.get(key)!.push(card);
            } catch { /* skip invalid dates */ }
        }
    });

    // Build calendar grid
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const getDateKey = (day: number) =>
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const isToday = (day: number) =>
        day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const statusColor = (status: string) => {
        switch (status) {
            case 'complete': return '#10b981';
            case 'in-progress': return '#f97316';
            case 'review': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <h1 className="text-lg md:text-2xl font-bold text-white">
                    <span className="hidden md:inline">{MONTHS[month]}</span>
                    <span className="md:hidden">{MONTHS_SHORT[month]}</span>
                    {' '}{year}
                </h1>
                <div className="flex items-center gap-1.5 md:gap-2">
                    <button onClick={goToday} className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                        Today
                    </button>
                    <button onClick={prevMonth} className="p-1.5 md:p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextMonth} className="p-1.5 md:p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d, i) => (
                    <div key={d} className="text-center text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider py-1.5 md:py-2">
                        <span className="hidden md:inline">{d}</span>
                        <span className="md:hidden">{DAYS_SHORT[i]}</span>
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 border border-zinc-800 rounded-xl overflow-hidden">
                {cells.map((day, i) => {
                    const dateKey = day ? getDateKey(day) : '';
                    const dayCards = day ? (cardsByDate.get(dateKey) || []) : [];
                    const todayClass = day && isToday(day);

                    return (
                        <div
                            key={i}
                            className={`border-b border-r border-zinc-800 p-1 md:p-1.5 min-h-[60px] md:min-h-[90px] relative transition-colors ${day ? 'hover:bg-zinc-900/50' : 'bg-zinc-950/30'
                                }`}
                        >
                            {day && (
                                <>
                                    <div className={`text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full ${todayClass
                                        ? 'bg-vermilion-500 text-white'
                                        : 'text-zinc-400'
                                        }`}>
                                        {day}
                                    </div>
                                    <div className="space-y-0.5 overflow-hidden max-h-[35px] md:max-h-[60px]">
                                        {dayCards.slice(0, 2).map(card => (
                                            <div
                                                key={card.id}
                                                className="text-[10px] leading-tight px-1.5 py-0.5 rounded truncate font-medium"
                                                style={{
                                                    backgroundColor: statusColor(card.status) + '20',
                                                    color: statusColor(card.status),
                                                    borderLeft: `2px solid ${statusColor(card.status)}`,
                                                }}
                                                title={card.title}
                                            >
                                                {card.title}
                                            </div>
                                        ))}
                                        {dayCards.length > 2 && (
                                            <div className="text-[9px] text-zinc-600 pl-1">
                                                +{dayCards.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
