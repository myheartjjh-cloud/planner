import React from 'react';
import { School, Trash2, Edit2 } from 'lucide-react';
import './AcademyList.css';

const AcademyList = ({ academies, onDelete, onEdit }) => {
  if (!academies || academies.length === 0) return null;

  return (
    <div className="academy-container glass-panel animate-fade-in">
      <div className="academy-header">
        <School size={20} className="text-gradient" />
        <h2>Registered Academies</h2>
      </div>

      <ul className="academy-list">
        {academies.map(academy => (
          <li key={academy.id} className="academy-item">
            <div className="academy-info">
              <span className="academy-title">{academy.title}</span>
              <span className="academy-meta">
                {academy.startDate} ~ {academy.endDate}
              </span>
            </div>
            <div className="academy-actions">
              <button 
                className="edit-academy-btn" 
                onClick={() => onEdit(academy)}
                title="Edit Academy"
              >
                <Edit2 size={16} />
              </button>
              <button 
                className="delete-academy-btn" 
                onClick={() => onDelete(academy.id)}
                title="Delete Academy and Events"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcademyList;
