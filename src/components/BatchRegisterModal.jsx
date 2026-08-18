import React, { useState, useEffect } from 'react';
import { X, Plus, CalendarPlus, Save } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import './BatchRegisterModal.css';

const PREDEFINED_COLORS = [
  'var(--accent-primary)', // Indigo
  'var(--accent-secondary)', // Purple
  'var(--accent-success)', // Emerald
  '#f43f5e', // Rose
  '#0ea5e9', // Sky
  '#f59e0b', // Amber
];

const BatchRegisterModal = ({ isOpen, onClose, onRegister, editData }) => {
  const [academyName, setAcademyName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);

  useEffect(() => {
    if (editData) {
      setAcademyName(editData.title);
      setSelectedDays(editData.days || []);
      setStartDate(editData.startDate);
      setEndDate(editData.endDate);
      setStartTime(editData.start || '14:00');
      setEndTime(editData.end || '16:00');
      setSelectedColor(editData.color || PREDEFINED_COLORS[0]);
    } else {
      setAcademyName('');
      setSelectedDays([]);
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
      setStartTime('14:00');
      setEndTime('16:00');
      setSelectedColor(PREDEFINED_COLORS[0]);
    }
  }, [editData, isOpen]);

  const daysOfWeek = [
    { id: 1, label: 'Mon' },
    { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' },
    { id: 4, label: 'Thu' },
    { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' },
    { id: 0, label: 'Sun' },
  ];

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!academyName || selectedDays.length === 0 || !startDate || !endDate) return;
    
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date must be before end date.");
      return;
    }

    onRegister({
      title: academyName,
      days: selectedDays,
      startDate,
      endDate,
      start: startTime,
      end: endTime,
      color: selectedColor
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <div className="modal-title">
            <CalendarPlus size={20} className="text-gradient" />
            <h2>{editData ? 'Edit Academy' : 'Batch Register Academy'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Academy Name</label>
            <input 
              type="text" 
              value={academyName} 
              onChange={(e) => setAcademyName(e.target.value)}
              placeholder="e.g. 피아노, 소마..."
              required
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {PREDEFINED_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="time-group">
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Days of the Week</label>
            <div className="days-selector">
              {daysOfWeek.slice(0, 5).map(day => ( 
                <button
                  key={day.id}
                  type="button"
                  className={`day-btn ${selectedDays.includes(day.id) ? 'selected' : ''}`}
                  onClick={() => toggleDay(day.id)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="time-group">
            <div className="form-group">
              <label>Start Time</label>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" style={{ background: selectedColor }}>
            {editData ? <><Save size={18} /> Save Changes</> : <><Plus size={18} /> Add Schedules</>}
          </button>
          
          <p className="modal-note">* Holidays will be automatically skipped.</p>
        </form>
      </div>
    </div>
  );
};

export default BatchRegisterModal;
