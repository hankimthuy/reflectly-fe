import React, { useMemo, useState, useEffect } from 'react';
import type { Entry } from '../../../../models/entry';
import { LuChevronUp } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { LuHeart } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";
import { LuX } from "react-icons/lu";
import './EntryCard.scss';
import EmotionTags from '../../../../components/EmotionTags/EmotionTags';
import { Emotion } from '../../../../models/emotion';
import { useUpdateEntryMutation, useDeleteEntryMutation } from '../../../../queries/entriesQueryHook';
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog';
import { useSnackbar } from '../../../../providers/SnackbarProvider';

interface EntryCardProps {
  entry: Entry;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry }: { entry: Entry }) => {
  const [expanded, setExpand] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(entry.title);
  const [editedReflection, setEditedReflection] = useState(entry.reflection || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { showSnackbar } = useSnackbar();
  const updateEntryMutation = useUpdateEntryMutation();
  const deleteEntryMutation = useDeleteEntryMutation();

  const { dayDisplay, emotions } = useMemo(() => {
    const dateObj = new Date(entry.createdAt);
    return {
      dayDisplay: {
        month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        date: dateObj.getDate().toString().padStart(2, '0'),
        dayName: dateObj.toLocaleString('en-US', { weekday: 'long' })
      },
      emotions: entry.emotions.filter((e): e is Emotion => 
        Object.values(Emotion).includes(e as Emotion)
      ) as Emotion[]
    };
  }, [entry.createdAt, entry.emotions]);

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editedTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    updateEntryMutation.mutate(
      {
        id: entry.id,
        title: editedTitle.trim(),
        reflection: editedReflection.trim(),
        emotions: emotions
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          showSnackbar('Your reflection has been updated successfully!', 'success', 5000, 'Well done!');
        },
        onError: (error) => {
          console.error('Failed to update entry:', error);
          showSnackbar('Failed to save entry. Please try again.', 'error', 5000, 'Error');
        }
      }
    );
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedTitle(entry.title);
    setEditedReflection(entry.reflection || '');
    setIsEditing(false);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteEntryMutation.mutate(entry.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        showSnackbar('Entry has been already deleted', 'success', 5000, 'Deleted');

      },
      onError: (error) => {
        console.error('Failed to delete entry:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showSnackbar(`Failed to delete entry: ${errorMessage}`, 'error', 5000, 'Error');
        setDeleteDialogOpen(false);
      }
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    setEditedTitle(entry.title);
    setEditedReflection(entry.reflection || '');
  }, [entry.title, entry.reflection]);
  
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
              {isEditing ? (
                <input
                  type="text"
                  className="entry-title-input"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h2 className="entry-title">{entry.title}</h2>
              )}
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

        <EmotionTags emotions={emotions} />
      </div>

      {/* --- Expanded Section: Reflection --- */}
      {expanded && (
        <div className="card-reflection">
          <div className="reflection-label">
            <div className="reflection-label-left">
              <LuHeart size={14} />
              <span>
                Reflection
              </span>
            </div>
            {isEditing ? (
              <div className="reflection-actions">
                <button 
                  type="button"
                  className="btn-action btn-save" 
                  onClick={handleSave}
                  disabled={updateEntryMutation.isPending}
                >
                  <LuCheck size={16} />
                  <span>Save</span>
                </button>
                <button 
                  type="button"
                  className="btn-action btn-cancel" 
                  onClick={handleCancel}
                  disabled={updateEntryMutation.isPending}
                >
                  <LuX size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <div className="reflection-actions">
                <button 
                  type="button"
                  className="btn-action btn-edit" 
                  onClick={() => setIsEditing(true)}
                >
                  <LuPencil size={16} />
                  <span>Edit</span>
                </button>
                <button 
                  type="button"
                  className="btn-action btn-delete" 
                  onClick={handleDeleteClick}
                  disabled={deleteEntryMutation.isPending}
                >
                  <LuTrash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="reflection-text-box">
              <textarea
                className="reflection-textarea"
                value={editedReflection}
                onChange={(e) => setEditedReflection(e.target.value)}
                placeholder="Write your reflection here..."
                rows={6}
              />
            </div>
          ) : (
            entry.reflection ? (
              <div className="reflection-text-box">
                <p>
                  {entry.reflection}
                </p>
              </div>
            ) : (
              <p className="empty-state">You haven't written a reflection for this day.</p>
            )
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Entry"
        message="Are you sure you want to delete this entry?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteEntryMutation.isPending}
      />
    </div>
  );
};

export default EntryCard;

