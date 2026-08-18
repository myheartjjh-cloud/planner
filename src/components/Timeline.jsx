import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import './Timeline.css';

const Timeline = ({ events, currentDate }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Filter events for the current day or specific date
  const currentDateStr = format(currentDate, 'yyyy-MM-dd');
  const dayEvents = events.filter(e => {
    if (e.date) return e.date === currentDateStr;
    return e.day === currentDate.getDay();
  });

  return (
    <div className="timeline-container glass-panel animate-fade-in">
      <div className="timeline-header">
        <Clock size={20} className="text-gradient" />
        <h2>Today's Timeline</h2>
      </div>
      
      <div className="timeline-scroll-area">
        <div className="timeline-grid">
          {hours.map(hour => (
            <div key={hour} className="timeline-row">
              <div className="time-label">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="time-slot"></div>
            </div>
          ))}
          
          {/* Events Layer */}
          {dayEvents.map(event => {
            const top = event.start * 60; // 60px per hour
            const height = (event.end - event.start) * 60;
            return (
              <div 
                key={event.id}
                className="timeline-event"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  borderLeftColor: event.color,
                  backgroundColor: `color-mix(in srgb, ${event.color} 15%, transparent)`
                }}
              >
                <div className="event-title">{event.title}</div>
                <div className="event-time">
                  {Math.floor(event.start).toString().padStart(2, '0')}:{((event.start % 1) * 60).toString().padStart(2, '0')} - 
                  {Math.floor(event.end).toString().padStart(2, '0')}:{((event.end % 1) * 60).toString().padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
