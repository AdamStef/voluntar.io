import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import classNames from 'classnames';

interface Event {
  id: number;
  title: string;
  date: string;
}

const CalendarComponent: React.FC = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/organization'); // chyba ten endpoint
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const onChange: CalendarProps['onChange'] = (value) => {
    if (Array.isArray(value)) {
      setDate(value[0]);
    } else {
      setDate(value);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    return classNames({
      'bg-green-500 text-white': dateString === today,
      'bg-blue-500 text-white': events.some(
        (event) => event.date === dateString,
      ),
    });
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={tileClassName}
      />
      <p className="text-center mt-4">
        <span className="font-bold">Selected Date:</span> {date?.toDateString()}
      </p>
    </div>
  );
};

export default CalendarComponent;
