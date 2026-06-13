import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CALENDAR_WEEKDAYS,
  formatBookingDate,
  toDateValue,
} from '../../../utils/dateUtils';

export default function CustomDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = value ? new Date(`${value}T00:00:00`) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const pickerRef = useRef(null);
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const gridStart = new Date(year, month, 1 - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const previousMonthDisabled =
    visibleMonth.getFullYear() === today.getFullYear() &&
    visibleMonth.getMonth() === today.getMonth();

  const selectDate = (date) => {
    onChange(toDateValue(date));
    setIsOpen(false);
  };

  return (
    <div className="custom-date-picker" ref={pickerRef}>
      <button
        type="button"
        className={`custom-date-trigger ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span>{formatBookingDate(value)}</span>
        <CalendarDays size={18} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="custom-calendar" role="dialog" aria-label="Choose preferred date">
          <div className="custom-calendar-head">
            <button
              type="button"
              onClick={() =>
                setVisibleMonth(
                  (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1)
                )
              }
              disabled={previousMonthDisabled}
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <strong>
              {visibleMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </strong>
            <button
              type="button"
              onClick={() =>
                setVisibleMonth(
                  (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1)
                )
              }
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="custom-calendar-weekdays" aria-hidden="true">
            {CALENDAR_WEEKDAYS.map((weekday) => <span key={weekday}>{weekday}</span>)}
          </div>

          <div className="custom-calendar-grid">
            {calendarDays.map((date) => {
              const dateValue = toDateValue(date);
              const isOutsideMonth = date.getMonth() !== visibleMonth.getMonth();
              const isPast = date < today;
              const isSelected = dateValue === value;
              const isToday = dateValue === toDateValue(today);

              return (
                <button
                  type="button"
                  key={dateValue}
                  className={[
                    isOutsideMonth ? 'outside-month' : '',
                    isSelected ? 'selected' : '',
                    isToday ? 'today' : '',
                  ].filter(Boolean).join(' ')}
                  disabled={isPast}
                  onClick={() => selectDate(date)}
                  aria-pressed={isSelected}
                  aria-label={date.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="custom-calendar-footer">
            <button type="button" onClick={() => selectDate(today)}>Today</button>
            {value && <button type="button" onClick={() => onChange('')}>Clear</button>}
          </div>
        </div>
      )}
    </div>
  );
}
