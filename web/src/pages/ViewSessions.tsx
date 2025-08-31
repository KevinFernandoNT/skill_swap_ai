import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Sun, Brain, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Session } from '@/types';
import { useGetSessions } from '@/hooks/useGetSessions';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isToday, getDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  isTeaching: boolean;
  skillCategory: string;
  color: string;
}

const ViewSessions: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [activeCalendars, setActiveCalendars] = useState<Set<string>>(new Set(['all']));

  const { data: sessionsResponse, isLoading } = useGetSessions();
  const sessions = sessionsResponse?.data || [];

  // Convert sessions to calendar events
  const calendarEvents: CalendarEvent[] = sessions.map(session => ({
    id: session._id,
    title: session.title,
    date: new Date(session.date),
    startTime: session.startTime,
    endTime: session.endTime,
    isTeaching: session.isTeaching,
    skillCategory: session.skillCategory,
    color: getEventColor(session.skillCategory)
  }));

  // Get unique categories for calendar filters
  const categories = Array.from(new Set(sessions.map(s => s.skillCategory)));

  // Get calendar days for current month (for mini-calendar)
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Get week days for weekly view
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }), // Monday start
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });

  function getEventColor(category: string): string {
    const colors = {
      'Technology': 'bg-blue-500',
      'Language': 'bg-green-500',
      'Music': 'bg-purple-500',
      'Art': 'bg-pink-500',
      'Sports': 'bg-orange-500',
      'Cooking': 'bg-red-500',
      'Business': 'bg-indigo-500',
      'Science': 'bg-cyan-500',
      'Health': 'bg-emerald-500',
      'Education': 'bg-yellow-500',
      'Other': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  }

  function getEventsForDay(date: Date): CalendarEvent[] {
    return calendarEvents.filter(event => isSameDay(event.date, date));
  }

  function getEventsForWeek(): { [key: string]: CalendarEvent[] } {
    const weekEvents: { [key: string]: CalendarEvent[] } = {};
    weekDays.forEach(day => {
      weekEvents[format(day, 'yyyy-MM-dd')] = getEventsForDay(day);
    });
    return weekEvents;
  }

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const previousWeek = () => setSelectedDate(addDays(selectedDate, -7));
  const nextWeek = () => setSelectedDate(addDays(selectedDate, 7));
  const goToToday = () => {
    setSelectedDate(new Date());
    setCurrentDate(new Date());
  };

  const toggleCalendar = (category: string) => {
    const newActive = new Set(activeCalendars);
    if (newActive.has(category)) {
      newActive.delete(category);
    } else {
      newActive.add(category);
    }
    setActiveCalendars(newActive);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
    

        {/* Mini Calendar */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">
              {format(currentDate, 'MMMM yyyy')}
            </h4>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const dayEvents = getEventsForDay(day);
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    w-8 h-8 rounded-full text-xs font-medium transition-colors
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : isTodayDate 
                        ? 'bg-primary/20 text-primary' 
                        : isCurrentMonth 
                          ? 'text-foreground hover:bg-muted' 
                          : 'text-muted-foreground'
                    }
                    ${dayEvents.length > 0 ? 'ring-2 ring-primary/30' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendars Section */}
        <div className="p-6 flex-1">
          <p className="font-medium text-foreground mb-4">CALENDARS</p>
          <div className="space-y-3">
            {/* All Sessions */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={activeCalendars.has('all')}
                onChange={() => toggleCalendar('all')}
                className="rounded border-border"
              />
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-foreground">All Sessions</span>
            </label>

            {/* Category calendars */}
            {categories.map(category => (
              <label key={category} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeCalendars.has(category)}
                  onChange={() => toggleCalendar(category)}
                  className="rounded border-border"
                />
                <div className={`w-3 h-3 rounded-full ${getEventColor(category)}`}></div>
                <span className="text-sm text-foreground">{category}</span>
              </label>
            ))}
          </div>
        </div>      
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {format(selectedDate, 'MMMM yyyy')} / W{Math.ceil(selectedDate.getDate() / 7)}
              </h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={previousWeek}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextWeek}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
            
          
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">GMT +0</p>
        </div>

        {/* Weekly Calendar */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-8 h-full">
            {/* Time column */}
            <div className="border-r border-border">
              <div className="h-16 border-b border-border"></div>
              {Array.from({ length: 12 }, (_, i) => i + 6).map(hour => (
                <div key={hour} className="h-20 border-b border-border flex items-start justify-end pr-2">
                  <span className="text-xs text-muted-foreground">
                    {hour === 12 ? 'NOON' : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Days columns */}
            {weekDays.map((day, dayIndex) => {
              const isCurrentDay = isToday(day);
              const dayEvents = getEventsForWeek()[format(day, 'yyyy-MM-dd')] || [];
              
              return (
                <div key={dayIndex} className={`border-r border-border ${isCurrentDay ? 'bg-primary/5' : ''}`}>
                  {/* Day header */}
                  <div className={`h-16 border-b border-border p-2 ${isCurrentDay ? 'bg-primary/10' : ''}`}>
                    <div className="text-sm font-medium text-foreground">
                      {format(day, 'EEE').toUpperCase()} {format(day, 'd')}
                    </div>
                  </div>

                  {/* Time slots */}
                  {Array.from({ length: 12 }, (_, i) => i + 6).map(hour => (
                    <div key={hour} className="h-20 border-b border-border relative">
                      {/* Events for this time slot */}
                      {dayEvents
                        .filter(event => {
                          const eventHour = parseInt(event.startTime.split(':')[0]);
                          return eventHour === hour;
                        })
                        .map((event, eventIndex) => (
                          <div
                            key={event.id}
                            className={`absolute left-1 right-1 top-1 bottom-1 ${event.color} text-white text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                            style={{ zIndex: eventIndex + 1 }}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-xs opacity-90">
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSessions;
