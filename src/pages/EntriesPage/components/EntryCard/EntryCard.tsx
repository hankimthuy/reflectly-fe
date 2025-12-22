import React, { useState } from 'react';
import type { Entry } from '../../../../models/entry';
import { LuChevronUp } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { LuHeart } from "react-icons/lu";
import './EntryCard.scss';
import EmotionTags from '../../../../components/EmotionTags/EmotionTags';

interface EntryCardProps {
  entry: Entry;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry }: { entry: Entry }) => {
  const [expanded, setExpand] = useState(false);
  const { dayDisplay } = entry;
  return (
    <div className="entry-card">
      {/* --- Main Card Section --- */}
      <div className="entry-main-card-wrapper">
        <div className="card-header-flex">

          <div className="date-group">
            <div className="date-box">
              <span className="month">{dayDisplay?.month}</span>
              <span className="date">{dayDisplay?.date}</span>
            </div>

            <div className="title-info">
              <h3 className="day-name">{dayDisplay?.dayName}</h3>
              <h2 className="entry-title">{entry.title}</h2>
            </div>
          </div>

          <button className="btn-details" onClick={() => setExpand(!expanded)}>
            <span>Details</span>
            {
              expanded ? (
                <LuChevronUp size={16} className="icon arrow-up" />
              ) : (<LuEye size={16} className="icon eye" />)
            }
          </button>

        </div>

        <EmotionTags emotions={entry.emotions} />
      </div>

      {/* --- Expanded Section: Reflection --- */}
      {expanded && (
        <div className="card-reflection">
          <div className="reflection-label">
            <LuHeart size={14} />
            <span>
              Reflection
            </span>
          </div>

          {entry.reflection ? (
            <div className="reflection-text-box">
              <p>
                {entry.reflection}
              </p>
            </div>
          ) : (
            <p className="empty-state">You haven't written a reflection for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EntryCard;
