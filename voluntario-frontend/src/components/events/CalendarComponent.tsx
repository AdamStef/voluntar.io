import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import classNames from 'classnames';
import { getUserEvents } from '@/utils/api/api';
import { EventType } from '@/utils/types/types';

const CalendarComponent: React.FC = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getUserEvents();
        console.log('Fetched events:', eventsData);
        setEvents(eventsData);
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
    const currentDate = new Date();
    const isToday =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();

    const hasEvent =
      Array.isArray(events) &&
      events.some((event) => {
        const eventDate = new Date(event.startDate);
        return (
          date.getDate() === eventDate.getDate() &&
          date.getMonth() === eventDate.getMonth() &&
          date.getFullYear() === eventDate.getFullYear()
        );
      });

    return classNames({
      'bg-green-500 text-white': isToday,
      'bg-blue-500 text-white': hasEvent && !isToday,
    });
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={tileClassName}
      />
      <p className="mt-4 text-center">
        <span className="font-bold">Selected Date:</span> {date?.toDateString()}
      </p>
    </div>
  );
};

export default CalendarComponent;
