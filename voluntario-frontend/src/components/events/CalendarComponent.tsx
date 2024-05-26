import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import classNames from 'classnames';
import axios from 'axios';

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
        const response = await axios.get('/api/organization');
        console.log('Fetched events:', response.data); // debuuuuug
        setEvents(response.data);
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
        const eventDate = new Date(event.date);
        console.log('Checking date:', date, 'Event date:', eventDate); // debug dziki któremu sprawdzamy czy daty się zgadzają
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });

    return classNames({
      'bg-green-500 text-white': isToday,
      'bg-blue-500 text-white': hasEvent,
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
