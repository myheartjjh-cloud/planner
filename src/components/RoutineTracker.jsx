import React, { useState } from 'react';
import { Activity, Droplets, BookOpen, Dumbbell } from 'lucide-react';
import './RoutineTracker.css';

const RoutineTracker = () => {
  const [routines, setRoutines] = useState([
    { id: 1, name: 'Drink Water', icon: <Droplets size={18} />, target: 8, current: 5, color: 'var(--accent-primary)' },
    { id: 2, name: 'Reading', icon: <BookOpen size={18} />, target: 30, current: 30, color: 'var(--accent-secondary)' },
    { id: 3, name: 'Exercise', icon: <Dumbbell size={18} />, target: 60, current: 0, color: 'var(--accent-success)' },
  ]);

  const incrementRoutine = (id) => {
    setRoutines(routines.map(routine => 
      routine.id === id && routine.current < routine.target 
        ? { ...routine, current: routine.current + 1 } 
        : routine
    ));
  };

  return (
    <div className="routine-container glass-panel">
      <div className="routine-header">
        <Activity size={20} className="text-gradient" />
        <h2>Daily Habits</h2>
      </div>

      <div className="routine-list">
        {routines.map(routine => {
          const progress = (routine.current / routine.target) * 100;
          const isCompleted = routine.current >= routine.target;

          return (
            <div key={routine.id} className="routine-item" onClick={() => incrementRoutine(routine.id)}>
              <div className="routine-info">
                <div className="routine-icon" style={{ color: routine.color }}>
                  {routine.icon}
                </div>
                <div className="routine-details">
                  <span className="routine-name">{routine.name}</span>
                  <span className="routine-progress-text">{routine.current} / {routine.target}</span>
                </div>
              </div>
              <div className="routine-bar-bg">
                <div 
                  className={`routine-bar-fill ${isCompleted ? 'completed' : ''}`} 
                  style={{ width: `${progress}%`, background: routine.color }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoutineTracker;
