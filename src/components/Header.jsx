import React from 'react';
import { Calendar, CalendarDays, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getKoreanHoliday } from '../utils/holidays';
import './Header.css';

const Header = ({ view, setView, currentDate, onPrev, onNext, onOpenModal }) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('ko-KR', options);
  
  const holiday = getKoreanHoliday(currentDate);

  // Mock progress
  const progress = 65;

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

        <div className="progress-container">
          <div className="progress-text">
            <span>Today's Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
