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
import { fetchScheduleData } from './utils/googleSheets';
import { getKoreanHoliday } from './utils/holidays';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('weekly'); // 'daily' | 'weekly'
  const [events, setEvents] = useState([]);
  const [academies, setAcademies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from Google Sheets (or Mock)
    fetchScheduleData().then(data => {
      setEvents(data);
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
      
      // Check if this day of week is selected
      if (academyData.days.includes(dayOfWeek)) {
        // Exclude holidays
        if (!getKoreanHoliday(currentDateObj)) {
          const startParts = academyData.start.split(':');
          const endParts = academyData.end.split(':');
          newEvents.push({
            id: Math.random() + Date.now(),
            academyId: academyId,
            date: format(currentDateObj, 'yyyy-MM-dd'),
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
      setAcademies(academies.map(a => a.id === academyId ? {
        ...a,
        title: academyData.title,
        startDate: academyData.startDate,
        endDate: academyData.endDate,
        days: academyData.days,
        start: academyData.start,
        end: academyData.end,
        color: academyData.color
      } : a));
      setEvents([...events.filter(e => e.academyId !== academyId), ...newEvents]);
      setEditingAcademy(null);
    } else {
      setAcademies([...academies, { 
        id: academyId, 
        title: academyData.title, 
        startDate: academyData.startDate, 
        endDate: academyData.endDate,
        days: academyData.days,
        start: academyData.start,
        end: academyData.end,
        color: academyData.color
      }]);
      setEvents([...events, ...newEvents]);
    }
  };

  const handleDeleteAcademy = (academyId) => {
    setAcademies(academies.filter(a => a.id !== academyId));
    setEvents(events.filter(e => e.academyId !== academyId));
  };

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
            <Timeline events={events} currentDate={currentDate} />
          ) : (
            <WeeklyTimeline events={events} currentDate={currentDate} />
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
