// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer, CalendarProps } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { getUserEvents } from '@/utils/api/api';
// import { EventType } from '@/utils/types/types';

// const localizer = momentLocalizer(moment);

// // Typ dla wydarzeń używanych w react-big-calendar
// type CalendarEvent = {
//   title: string;
//   start: Date;
//   end: Date;
// };

// const CalendarDistrict: React.FC = () => {
//   const [events, setEvents] = useState<CalendarEvent[]>([]);

//   useEffect(() => {
//     // Funkcja pobierająca wydarzenia użytkownika
//     const fetchEvents = async () => {
//       try {
//         const eventsData = await getUserEvents();
//         console.log('Fetched events:', eventsData);
//         setEvents(
//           eventsData.map((event: EventType) => ({
//             title: event.title,
//             start: new Date(event.startDate),
//             end: new Date(event.endDate),
//           }))
//         );
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // Funkcja obsługująca wybór wydarzenia
//   const handleSelectEvent: CalendarProps<CalendarEvent>['onSelectEvent'] = (event) => {
//     console.log('Selected event:', event);
//   };

//   // Funkcja obsługująca podwójne kliknięcie w wydarzenie
//   const handleDoubleClickEvent: CalendarProps<CalendarEvent>['onDoubleClickEvent'] = (event) => {
//     console.log('Double clicked event:', event);
//   };

//   // Funkcja obsługująca wybór slotu czasowego
//   const handleSelectSlot: CalendarProps<CalendarEvent>['onSelectSlot'] = (slotInfo) => {
//     console.log('Selected slot:', slotInfo);
//   };np

//   return (
//     <div className="calendar-container h-full w-full">
//       <Calendar
//         localizer={localizer}
//         events={events}
//         defaultView="month"
//         selectable
//         onSelectEvent={handleSelectEvent}
//         onDoubleClickEvent={handleDoubleClickEvent}
//         onSelectSlot={handleSelectSlot}
//         style={{ height: 500 }}
//         className="rbc-calendar"
//       />
//     </div>
//   );
// };

// export default CalendarDistrict;
