import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { LooseValue } from 'react-calendar/dist/cjs/shared/types';

interface CompactCalendarProps {
  value?: string;
  onChange: (value: string) => void;
  onClose?: () => void;
}

function CompactCalendar({ value, onChange, onClose }: CompactCalendarProps) {
  const handleChange = (nextValue: LooseValue) => {
    if (nextValue) {
      const date = new Date(nextValue.toString());
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      onChange(formattedDate);
      onClose?.();
    }
  };

  const calendarValue = value ? new Date(value) : null;

  return (
    <div className="compact-calendar">
      <style dangerouslySetInnerHTML={{
        __html: `
          .compact-calendar .react-calendar {
            width: 280px !important;
            max-width: 100% !important;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-family: inherit;
            line-height: 1.125em;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          .compact-calendar .react-calendar--doubleView {
            width: 560px !important;
          }
          
          .compact-calendar .react-calendar__navigation {
            display: flex;
            height: 44px;
            margin-bottom: 1em;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            border-radius: 8px 8px 0 0;
          }
          
          .compact-calendar .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            border: none;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            padding: 8px;
          }
          
          .compact-calendar .react-calendar__navigation button:hover {
            background-color: #e5e7eb;
            border-radius: 4px;
          }
          
          .compact-calendar .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 11px;
            color: #6b7280;
            padding: 8px 0;
          }
          
          .compact-calendar .react-calendar__month-view__weekdays__weekday {
            padding: 0.5em;
          }
          
          .compact-calendar .react-calendar__month-view__days__day {
            font-size: 13px;
            padding: 8px;
            background: none;
            border: none;
            color: #374151;
            border-radius: 4px;
            margin: 1px;
          }
          
          .compact-calendar .react-calendar__month-view__days__day:hover {
            background-color: #f3f4f6;
          }
          
          .compact-calendar .react-calendar__month-view__days__day--active {
            background: #3b82f6 !important;
            color: white !important;
          }
          
          .compact-calendar .react-calendar__month-view__days__day--neighboringMonth {
            color: #9ca3af;
          }
          
          .compact-calendar .react-calendar__tile {
            max-width: 100%;
            text-align: center;
            padding: 0.5em 0.25em;
            background: none;
            border: none;
          }
          
          .compact-calendar .react-calendar__tile:enabled:hover,
          .compact-calendar .react-calendar__tile:enabled:focus {
            background-color: #f3f4f6;
          }
          
          .compact-calendar .react-calendar__tile--now {
            background: #fef3c7;
            color: #92400e;
          }
          
          .compact-calendar .react-calendar__tile--active {
            background: #3b82f6;
            color: white;
          }
        `
      }} />
      
      <Calendar
        onChange={handleChange}
        value={calendarValue}
        locale="en-US"
        showNeighboringMonth={false}
      />
    </div>
  );
}

export default CompactCalendar;
