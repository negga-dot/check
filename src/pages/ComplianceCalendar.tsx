import React, { useState } from 'react';
import { Calendar, Plus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import type { CalendarEvent } from '../contexts/AppContext';

const ComplianceCalendar: React.FC = () => {
  const { state, dispatch } = useApp();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'deadline' as CalendarEvent['type'],
    description: '',
    priority: 'medium' as CalendarEvent['priority'],
  });

  const eventTypes = {
    gst: { label: 'GST Filing', color: 'bg-red-500', textColor: 'text-red-700' },
    renewal: { label: 'Renewal', color: 'bg-blue-500', textColor: 'text-blue-700' },
    deadline: { label: 'Deadline', color: 'bg-orange-500', textColor: 'text-orange-700' },
    filing: { label: 'Filing', color: 'bg-purple-500', textColor: 'text-purple-700' },
  };

  const priorityConfig = {
    high: { color: 'bg-red-100 border-red-300 text-red-700', icon: AlertTriangle },
    medium: { color: 'bg-yellow-100 border-yellow-300 text-yellow-700', icon: Clock },
    low: { color: 'bg-green-100 border-green-300 text-green-700', icon: CheckCircle },
  };

  // Sample events if none exist
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'GST Return Filing',
      date: '2025-01-20',
      type: 'gst',
      priority: 'high',
      description: 'Monthly GST return filing deadline',
      completed: false,
    },
    {
      id: '2',
      title: 'Fire NOC Renewal',
      date: '2025-01-25',
      type: 'renewal',
      priority: 'medium',
      description: 'Annual fire safety certificate renewal',
      completed: false,
    },
    {
      id: '3',
      title: 'PF Filing',
      date: '2025-01-15',
      type: 'filing',
      priority: 'medium',
      description: 'Monthly PF contribution filing',
      completed: true,
    },
    {
      id: '4',
      title: 'Trade License Renewal',
      date: '2025-02-10',
      type: 'renewal',
      priority: 'high',
      description: 'Annual trade license renewal with MCD',
      completed: false,
    }
  ];

  const events = state.events.length > 0 ? state.events : sampleEvents;

  const getCurrentMonthEvents = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  };

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };

  const getCurrentWeekEvents = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek && !event.completed;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type,
      priority: newEvent.priority,
      description: newEvent.description,
      completed: false,
    };

    dispatch({ type: 'ADD_EVENT', payload: event });
    setNewEvent({
      title: '',
      date: '',
      type: 'deadline',
      description: '',
      priority: 'medium',
    });
    setShowAddModal(false);
  };

  const toggleEventCompletion = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      dispatch({
        type: 'UPDATE_EVENT',
        payload: {
          id: eventId,
          updates: { completed: !event.completed }
        }
      });
    }
  };

  const renderCalendarGrid = () => {
    const currentMonthEvents = getCurrentMonthEvents();
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayEvents = currentMonthEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === currentDate.toDateString();
      });

      const isCurrentMonth = currentDate.getMonth() === selectedDate.getMonth();
      const isToday = currentDate.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={i}
          className={`min-h-[100px] border border-gray-200 dark:border-gray-700 p-2 ${
            isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
          } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
          } ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
            {currentDate.getDate()}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded text-white truncate cursor-pointer ${
                  eventTypes[event.type].color
                } ${event.completed ? 'opacity-50 line-through' : ''}`}
                onClick={() => toggleEventCompletion(event.id)}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 dark:bg-gray-800 p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekEvents = getCurrentWeekEvents();
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      
      const dayEvents = weekEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === currentDay.toDateString();
      });
      
      const isToday = currentDay.toDateString() === new Date().toDateString();
      
      days.push(
        <div key={i} className="border border-gray-200 dark:border-gray-700 min-h-[200px]">
          <div className={`p-3 border-b border-gray-200 dark:border-gray-700 ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {currentDay.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold ${
              isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
            }`}>
              {currentDay.getDate()}
            </div>
          </div>
          <div className="p-2 space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-2 rounded text-white cursor-pointer ${
                  eventTypes[event.type].color
                } ${event.completed ? 'opacity-50 line-through' : ''}`}
                onClick={() => toggleEventCompletion(event.id)}
                title={event.description}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {days}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('calendar.title')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('calendar.subtitle')}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === 'month' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {t('calendar.month')}
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === 'week' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {t('calendar.week')}
              </button>
            </div>
            <Button icon={Plus} onClick={() => setShowAddModal(true)}>
              {t('calendar.add')}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {viewMode === 'month' 
                    ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : `Week of ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  }
                </h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      viewMode === 'month' ? newDate.setMonth(newDate.getMonth() - 1) : newDate.setDate(newDate.getDate() - 7);
                      setSelectedDate(newDate);
                    }}
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      viewMode === 'month' ? newDate.setMonth(newDate.getMonth() + 1) : newDate.setDate(newDate.getDate() + 7);
                      setSelectedDate(newDate);
                    }}
                  >
                    →
                  </Button>
                </div>
              </div>
              {viewMode === 'month' ? renderCalendarGrid() : renderWeekView()}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('calendar.today')}</h3>
              <div className="space-y-3">
                {getTodayEvents().length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks for today</p>
                ) : (
                  getTodayEvents().map(event => {
                    const PriorityIcon = priorityConfig[event.priority].icon;
                    return (
                      <div
                        key={event.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          priorityConfig[event.priority].color
                        } ${event.completed ? 'opacity-50' : ''}`}
                        onClick={() => toggleEventCompletion(event.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-sm text-gray-900 dark:text-white ${event.completed ? 'line-through' : ''}`}>
                              {event.title}
                            </h4>
                            <p className="text-xs mt-1 opacity-75 text-gray-600 dark:text-gray-300">{event.description}</p>
                          </div>
                          <PriorityIcon className="h-4 w-4 flex-shrink-0" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('calendar.upcoming')}</h3>
              <div className="space-y-3">
                {getUpcomingEvents().length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming events</p>
                ) : (
                  getUpcomingEvents().map(event => (
                    <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${eventTypes[event.type].color}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Legend */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Types</h3>
              <div className="space-y-2">
                {Object.entries(eventTypes).map(([type, config]) => (
                  <div key={type} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{config.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., GST Return Filing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      className="input-field"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })}
                    >
                      <option value="deadline">Deadline</option>
                      <option value="gst">GST Filing</option>
                      <option value="renewal">Renewal</option>
                      <option value="filing">Filing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      className="input-field"
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as CalendarEvent['priority'] })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddEvent} className="flex-1">
                  Add Event
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceCalendar;