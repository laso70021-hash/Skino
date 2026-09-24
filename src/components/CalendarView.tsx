import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Download,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';

export const CalendarView: React.FC = () => {
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

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (evt: CalendarEvent) => {
    const startStr = `${evt.date.replace(/-/g, '')}T${evt.time.replace(':', '')}00`;
    const endHour = (parseInt(evt.time.split(':')[0]) + 1).toString().padStart(2, '0');
    const endStr = `${evt.date.replace(/-/g, '')}T${endHour}${evt.time.split(':')[1]}00`;
    const details = encodeURIComponent(evt.notes || 'Skina Skincare & Wellness checkpoint');
    const title = encodeURIComponent(`Skina: ${evt.title}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}`;
  };

  // Generate .ics download
  const downloadICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Skina//Skincare OS//EN\n";
    calendarEvents.forEach((evt) => {
      const dtStart = `${evt.date.replace(/-/g, '')}T${evt.time.replace(':', '')}00`;
      icsContent += `BEGIN:VEVENT\nSUMMARY:Skina: ${evt.title}\nDTSTART:${dtStart}\nDESCRIPTION:${evt.notes || ''}\nSTATUS:${evt.completed ? 'COMPLETED' : 'CONFIRMED'}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'skina-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Daily Agenda</span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display">
            My Skincare &amp; Wellness Calendar
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Sync your morning/evening routines and hydration reminders with Google Calendar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadICS}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5"
            title="Download iCal (.ics) file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .ICS</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </button>
        </div>
      </div>

      {/* Date Bar & Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date Selector */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <h3 className="font-bold text-stone-900 text-xs flex items-center gap-2 uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4 text-teal-600" /> Choose Date
          </h3>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900"
          />

          <div className="pt-2 text-xs text-stone-500 space-y-1">
            <p><strong>Total Schedule:</strong> {calendarEvents.length} events logged</p>
            <p><strong>Completed:</strong> {calendarEvents.filter((e) => e.completed).length}</p>
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm">
              Schedule for {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <span className="text-xs text-stone-500">{eventsForSelectedDate.length} items</span>
          </div>

          {eventsForSelectedDate.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400 space-y-2">
              <p>No events scheduled for this date.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-teal-600 font-bold hover:underline"
              >
                + Schedule a routine or skin scan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {eventsForSelectedDate.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                    evt.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-stone-500'
                      : 'bg-stone-50 border-stone-200 text-stone-800'
                  }`}
                >
                  <div
                    onClick={() => toggleCalendarEvent(evt.id)}
                    className="flex items-start gap-3 cursor-pointer flex-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                        evt.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {evt.completed && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${evt.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                          {evt.title}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {evt.time}
                        </span>
                      </div>
                      {evt.notes && (
                        <p className="text-[11px] text-stone-500 mt-1">{evt.notes}</p>
                      )}
                    </div>
                  </div>

                  <a
                    href={getGoogleCalendarUrl(evt)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-teal-700 hover:bg-stone-200/50 transition shrink-0"
                    title="Add to Google Calendar"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 my-6 space-y-4">
            <h2 className="font-bold text-stone-900 text-base">Schedule Skincare or Wellness Event</h2>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Skin Scan or Hydration Check"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900 bg-white"
                  >
                    <option value="skin_scan">📸 Skin Scan</option>
                    <option value="morning_routine">☀️ Morning Routine</option>
                    <option value="evening_routine">🌙 Evening Routine</option>
                    <option value="hydration">💧 Hydration Check</option>
                    <option value="meal">🥗 Balanced Meal</option>
                    <option value="progress_review">📈 Progress Review</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Check for blemish reduction along jawline"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold"
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
