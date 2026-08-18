import React from 'react';
import { CalendarDays } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { getKoreanHoliday } from '../utils/holidays';
import './WeeklyTimeline.css';

const WeeklyTimeline = ({ events, currentDate }) => {
  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 to 22:00 for weekly view
  
  // Calculate days of the current week (Sunday to Saturday)
  const startDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="weekly-container glass-panel animate-fade-in">
      <div className="weekly-header">
        <CalendarDays size={20} className="text-gradient" />
        <h2>Weekly Schedule</h2>
      </div>

      <div className="weekly-grid-container">
        {/* Days Header */}
        <div className="weekly-days-header">
          <div className="time-column-header"></div>
          {weekDays.map((day, index) => {
            const holiday = getKoreanHoliday(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <div key={index} className={`day-column-header ${isToday ? 'is-today' : ''}`}>
                <div className="day-name">{format(day, 'EEE')}</div>
                <div className={`day-date ${holiday ? 'text-holiday' : ''}`}>
                  {format(day, 'd')}
                </div>
                {holiday && <div className="holiday-badge">{holiday}</div>}
              </div>
            );
          })}
        </div>

        {/* Grid Body */}
        <div className="weekly-grid-body">
          {/* Time lines */}
          <div className="time-column">
            {hours.map(hour => (
              <div key={hour} className="time-label-cell">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* 7 Day Columns */}
          {weekDays.map((day, dayIndex) => {
            // Filter events for this day
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayEvents = events.filter(e => {
              if (e.date) return e.date === dayStr;
              return e.day === day.getDay();
            });
            
            return (
              <div key={dayIndex} className="day-column">
                {hours.map(hour => (
                  <div key={hour} className="grid-cell"></div>
                ))}
                
                {/* Render events */}
                {dayEvents.map(event => {
                  // Calculate position (offset by 8 hours since start is 08:00)
                  const top = (event.start - 8) * 60; 
                  const height = (event.end - event.start) * 60;
                  
                  // Skip if outside view
                  if (event.start < 8 || event.start > 22) return null;

                  return (
                    <div 
                      key={event.id}
                      className="weekly-event"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: `color-mix(in srgb, ${event.color} 20%, transparent)`,
                        borderLeftColor: event.color
                      }}
                    >
                      <div className="weekly-event-title">{event.title}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimeline;
