import { useState, useEffect } from 'react';
import { addDays, subDays, parseISO, format, isBefore, isEqual } from 'date-fns';
import './App.css';
import Header from './components/Header';
import Timeline from './components/Timeline';
import WeeklyTimeline from './components/WeeklyTimeline';
import TodoList from './components/TodoList';
import RoutineTracker from './components/RoutineTracker';
import BatchRegisterModal from './components/BatchRegisterModal';
import AcademyList from './components/AcademyList';
import { fetchScheduleData, syncScheduleData } from './utils/googleSheets';
import { getKoreanHoliday } from './utils/holidays';

const decimalToTimeString = (decimal) => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const buildAcademiesFromEvents = (evs) => {
  const academyMap = new Map();
  evs.forEach(ev => {
    if (!ev.academyId) return;
    if (!academyMap.has(ev.academyId)) {
      academyMap.set(ev.academyId, {
        id: ev.academyId,
        title: ev.title,
        color: ev.color,
        startDate: ev.date || '',
        endDate: ev.date || '',
        days: ev.day !== undefined && ev.day !== "" ? [ev.day] : [],
        start: decimalToTimeString(ev.start),
        end: decimalToTimeString(ev.end)
      });
    } else {
      const acc = academyMap.get(ev.academyId);
      if (ev.date && (!acc.startDate || ev.date < acc.startDate)) acc.startDate = ev.date;
      if (ev.date && (!acc.endDate || ev.date > acc.endDate)) acc.endDate = ev.date;
      if (ev.day !== undefined && ev.day !== "" && !acc.days.includes(ev.day)) acc.days.push(ev.day);
    }
  });
  return Array.from(academyMap.values());
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('weekly'); // 'daily' | 'weekly'
  const [events, setEvents] = useState([]);
  const [academies, setAcademies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScheduleData().then(sheetData => {
      setEvents(sheetData);
      setAcademies(buildAcademiesFromEvents(sheetData));
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const handlePrev = () => {
    setCurrentDate(subDays(currentDate, view === 'weekly' ? 7 : 1));
  };

  const handleNext = () => {
    setCurrentDate(addDays(currentDate, view === 'weekly' ? 7 : 1));
  };

  const handleBatchRegister = (academyData) => {
    const start = parseISO(academyData.startDate);
    const end = parseISO(academyData.endDate);
    
    let currentDateObj = start;
    const newEvents = [];
    const academyId = editingAcademy ? editingAcademy.id : Date.now();

    while (isBefore(currentDateObj, end) || isEqual(currentDateObj, end)) {
      const dayOfWeek = currentDateObj.getDay();
      
      if (academyData.days.includes(dayOfWeek)) {
        if (!getKoreanHoliday(currentDateObj)) {
          const startParts = academyData.start.split(':');
          const endParts = academyData.end.split(':');
          newEvents.push({
            id: Math.random() + Date.now(),
            academyId: academyId,
            date: format(currentDateObj, 'yyyy-MM-dd'),
            day: dayOfWeek,
            start: parseInt(startParts[0]) + parseInt(startParts[1])/60,
            end: parseInt(endParts[0]) + parseInt(endParts[1])/60,
            title: academyData.title,
            color: academyData.color,
            type: 'academy'
          });
        }
      }
      currentDateObj = addDays(currentDateObj, 1);
    }

    if (editingAcademy) {
      const updatedEvents = [...events.filter(e => e.academyId !== academyId), ...newEvents];
      setEvents(updatedEvents);
      setAcademies(buildAcademiesFromEvents(updatedEvents));
      syncScheduleData('edit', { events: newEvents });
      setEditingAcademy(null);
    } else {
      const updatedEvents = [...events, ...newEvents];
      setEvents(updatedEvents);
      setAcademies(buildAcademiesFromEvents(updatedEvents));
      syncScheduleData('add', { events: newEvents });
    }
  };

  const handleDeleteAcademy = (academyId) => {
    const updatedEvents = events.filter(e => e.academyId !== academyId);
    setEvents(updatedEvents);
    setAcademies(buildAcademiesFromEvents(updatedEvents));
    syncScheduleData('delete', { academyId: academyId });
  };

  const allEvents = [...events];

  const handleEditAcademy = (academy) => {
    setEditingAcademy(academy);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container animate-fade-in">
      <Header 
        view={view} 
        setView={setView} 
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenModal={() => {
          setEditingAcademy(null);
          setIsModalOpen(true);
        }}
      />
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading Schedule Data from Google Sheets...</div>
      ) : (
        <div className={`main-content ${view === 'weekly' ? 'weekly-layout' : ''}`}>
          {view === 'daily' ? (
            <Timeline events={allEvents} currentDate={currentDate} />
          ) : (
            <WeeklyTimeline events={allEvents} currentDate={currentDate} />
          )}
          
          <div className="sidebar">
            {view === 'daily' && (
              <>
                <TodoList />
                <RoutineTracker />
              </>
            )}
            <AcademyList 
              academies={academies} 
              onDelete={handleDeleteAcademy} 
              onEdit={handleEditAcademy}
            />
          </div>
        </div>
      )}

      <BatchRegisterModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAcademy(null);
        }}
        onRegister={handleBatchRegister}
        editData={editingAcademy}
      />
    </div>
  );
}

export default App;
