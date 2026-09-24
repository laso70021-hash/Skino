import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Download,
  Check,
  CalendarCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { CloseButton } from '../components/common/CloseButton';
import { CalendarEvent } from '../types';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { calendarEvents, toggleCalendarEvent, addCalendarEvent } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('skin_scan');
  const [newTime, setNewTime] = useState('09:00');
  const [newNotes, setNewNotes] = useState('');

  const eventsForSelectedDate = calendarEvents.filter((e) => e.date === selectedDate);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addCalendarEvent({
      title: newTitle.trim(),
      type: newType,
      date: selectedDate,
      time: newTime,
      completed: false,
      notes: newNotes.trim()
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const getGoogleCalendarUrl = (evt: CalendarEvent) => {
    const startStr = `${evt.date.replace(/-/g, '')}T${evt.time.replace(':', '')}00`;
    const endHour = (parseInt(evt.time.split(':')[0]) + 1).toString().padStart(2, '0');
    const endStr = `${evt.date.replace(/-/g, '')}T${endHour}${evt.time.split(':')[1]}00`;
    const details = encodeURIComponent(evt.notes || 'Skina Skincare & Wellness checkpoint');
    const title = encodeURIComponent(`Skina: ${evt.title}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}`;
  };

  const downloadICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Skina//Skincare OS//EN\n";
    calendarEvents.forEach((evt) => {
      const dtStart = `${evt.date.replace(/-/g, '')}T${evt.time.replace(':', '')}00`;
      const endHour = (parseInt(evt.time.split(':')[0]) + 1).toString().padStart(2, '0');
      const dtEnd = `${evt.date.replace(/-/g, '')}T${endHour}${evt.time.split(':')[1]}00`;
      icsContent += `BEGIN:VEVENT\nSUMMARY:Skina: ${evt.title}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nDESCRIPTION:${evt.notes || 'Skincare checkpoint'}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `skinai-schedule-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <div className="flex items-center gap-2">
          <button
            onClick={downloadICS}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export iCal (.ics)</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Page Title Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Agenda &amp; Synchronization
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            Skincare Calendar
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track daily morning and evening application consistency, hydration milestones, and future scan appointments.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200 self-start sm:self-auto">
          <CalendarIcon className="w-4 h-4 text-stone-500 ml-1.5" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Events for selected date */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-teal-600" />
            Agenda for {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <span className="text-xs text-stone-400 font-semibold">
            {eventsForSelectedDate.filter((e) => e.completed).length} / {eventsForSelectedDate.length} completed
          </span>
        </div>

        {eventsForSelectedDate.length === 0 ? (
          <div className="py-12 text-center text-stone-400 space-y-2">
            <CalendarIcon className="w-10 h-10 mx-auto text-stone-300" />
            <p className="text-xs">No scheduled activities for this date.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 text-xs font-bold text-teal-600 hover:text-teal-700"
            >
              + Add a routine checkpoint or scan reminder
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {eventsForSelectedDate.map((evt) => (
              <div
                key={evt.id}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  evt.completed
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-stone-50/80 border-stone-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCalendarEvent(evt.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      evt.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 bg-white hover:border-teal-500'
                    }`}
                  >
                    {evt.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700">{evt.time}</span>
                      <span className={`text-xs font-bold ${evt.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {evt.title}
                      </span>
                    </div>
                    {evt.notes && (
                      <p className="text-[11px] text-stone-500 mt-0.5">{evt.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={getGoogleCalendarUrl(evt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-teal-700 hover:bg-teal-50 transition"
                    title="Add to Google Calendar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Small Action Modal: Add Event with prominent CloseButton */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base">Add Schedule Event</h3>
              <CloseButton onClick={() => setIsAddModalOpen(false)} ariaLabel="Close event form" />
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Skincare with Retinoid"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                  >
                    <option value="skincare">Skincare Step</option>
                    <option value="skin_scan">Skin Scan</option>
                    <option value="hydration">Hydration Check</option>
                    <option value="nutrition">Nutrition</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Target Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Wait interval instructions or hydration notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
