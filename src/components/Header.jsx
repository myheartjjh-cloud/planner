import React, { useState, useEffect } from 'react';
import { Calendar, CalendarDays, PlusCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { getKoreanHoliday } from '../utils/holidays';
import './Header.css';

const decimalToTime = (decimal) => {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const Header = ({ view, setView, currentDate, events, onPrev, onNext, onOpenModal }) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('ko-KR', options);
  
  const holiday = getKoreanHoliday(currentDate);

  const [now, setNow] = useState(new Date());
  const notifiedEventsRef = React.useRef(new Set());

  // Request Notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);

      // Check alarms for todaysEvents
      const currentHourDecimal = currentTime.getHours() + currentTime.getMinutes() / 60;
      const todayStr = format(currentTime, 'yyyy-MM-dd');
      const todays = (events || []).filter(e => {
        if (e.date) return e.date === todayStr;
        return e.day === currentTime.getDay();
      });

      todays.forEach(event => {
        const minutesToStart = Math.round((event.start - currentHourDecimal) * 60);
        const minutesToEnd = Math.round((event.end - currentHourDecimal) * 60);

        const sendNotification = (msg) => {
          if ("Notification" in window && Notification.permission === "granted") {
            if (navigator.serviceWorker) {
              navigator.serviceWorker.ready.then(reg => reg.showNotification("일정 알림", { body: msg }));
            } else {
              new Notification("일정 알림", { body: msg });
            }
          } else {
            alert(msg);
          }
        };

        const startKey = `${event.id}-start-${todayStr}`;
        if (minutesToStart <= 10 && minutesToStart >= 0 && !notifiedEventsRef.current.has(startKey)) {
          notifiedEventsRef.current.add(startKey);
          sendNotification(`[${event.title}] 시작 ${minutesToStart}분 전입니다.`);
        }

        const endKey = `${event.id}-end-${todayStr}`;
        if (minutesToEnd <= 10 && minutesToEnd >= 0 && !notifiedEventsRef.current.has(endKey)) {
          notifiedEventsRef.current.add(endKey);
          sendNotification(`[${event.title}] 종료 ${minutesToEnd}분 전입니다.`);
        }
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [events]);

  const todayStr = format(now, 'yyyy-MM-dd');
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  
  const todaysEvents = (events || []).filter(e => {
    if (e.date) return e.date === todayStr;
    return e.day === now.getDay();
  });

  const currentEvent = todaysEvents.find(e => currentHourDecimal >= e.start && currentHourDecimal < e.end);
  const nextEvents = todaysEvents.filter(e => e.start >= currentHourDecimal).sort((a, b) => a.start - b.start);
  const nextEvent = nextEvents.length > 0 ? nextEvents[0] : null;

  return (
    <header className="header glass-panel">
      <div className="header-info">
        <div className="icon-wrapper">
          <Calendar size={28} className="text-gradient" />
        </div>
        <div>
          <h1 className="title">
            Daily Schedule 
            {holiday && <span className="holiday-badge-header">{holiday}</span>}
          </h1>
          <div className="date-nav-container">
            <button className="nav-btn" onClick={onPrev}>
              <ChevronLeft size={16} />
            </button>
            <p className={`date ${holiday ? 'text-holiday' : ''}`}>{formattedDate}</p>
            <button className="nav-btn" onClick={onNext}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="header-actions">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${view === 'daily' ? 'active' : ''}`}
            onClick={() => setView('daily')}
          >
            <Calendar size={16} /> Daily
          </button>
          <button 
            className={`toggle-btn ${view === 'weekly' ? 'active' : ''}`}
            onClick={() => setView('weekly')}
          >
            <CalendarDays size={16} /> Weekly
          </button>
        </div>

        <button className="add-academy-btn" onClick={onOpenModal}>
          <PlusCircle size={18} /> Register
        </button>

        <div className="current-schedule-container glass-panel">
          {currentEvent ? (
            <div className="current-schedule active">
              <Clock size={14} className="icon-blink" style={{ color: currentEvent.color }} />
              <span className="schedule-text">
                진행중: <strong style={{ color: currentEvent.color }}>{currentEvent.title}</strong> 
                <span className="schedule-time">({decimalToTime(currentEvent.start)} - {decimalToTime(currentEvent.end)})</span>
              </span>
            </div>
          ) : null}

          {nextEvent ? (
            <div className="current-schedule next" style={{ opacity: currentEvent ? 0.7 : 1, fontSize: currentEvent ? '0.8rem' : '0.875rem' }}>
              <Clock size={currentEvent ? 12 : 14} color="var(--text-secondary)" />
              <span className="schedule-text">
                다음: <strong>{nextEvent.title}</strong> 
                <span className="schedule-time">({decimalToTime(nextEvent.start)} - {decimalToTime(nextEvent.end)})</span>
              </span>
            </div>
          ) : (!currentEvent && (
            <div className="current-schedule empty">
              <span className="schedule-text">오늘 남은 일정이 없습니다 🎉</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
