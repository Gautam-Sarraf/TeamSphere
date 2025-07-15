import React, { useState } from 'react';
import { Plus, X, Check, Clock, AlertCircle, User, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import './TaskSidebar.css';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
}

interface TaskSidebarProps {
  channelId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ channelId, isOpen, onClose }) => {
  const { currentServer, addTask, updateTask, removeTask } = useApp();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignedTo: '',
    dueDate: ''
  });

  const currentChannel = currentServer?.channels.find(c => c._id === channelId);
  const tasks = currentChannel?.tasks || [];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !user) return;

    const task: Omit<Task, 'id'> = {
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignedTo: newTask.assignedTo || undefined,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdBy: user.id,
      createdAt: new Date()
    };

    addTask(channelId, task);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: ''
    });
    setShowAddForm(false);
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    updateTask(channelId, taskId, { status });
  };

  const handleDeleteTask = (taskId: string) => {
    removeTask(channelId, taskId);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <Check size={16} />;
      case 'in-progress': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate;
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  if (!isOpen) return null;

  return (
    <aside className="task-sidebar">
      <div className="task-header">
        <div className="task-title">
          <AlertCircle size={20} />
          <h3>Channel Tasks</h3>
          <span className="task-count">{tasks.length}</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="task-actions">
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {showAddForm && (
        <div className="add-task-form">
          <form onSubmit={handleAddTask}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="form-input"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="form-textarea"
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                  className="form-select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="form-select"
              >
                <option value="">Assign to...</option>
                {currentServer?.members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="task-sections">
        {/* To Do Tasks */}
        <div className="task-section">
          <div className="section-header">
            <div className="section-title">
              <AlertCircle size={16} />
              <span>To Do</span>
              <span className="section-count">{todoTasks.length}</span>
            </div>
          </div>
          <div className="task-list">
            {todoTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-main">
                    <button
                      className="task-status"
                      onClick={() => handleStatusChange(task.id, 'in-progress')}
                      title="Mark as in progress"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="task-info">
                      <div className="task-name">{task.title}</div>
                      {task.description && (
                        <div className="task-description">{task.description}</div>
                      )}
                      <div className="task-meta">
                        <div 
                          className="task-priority"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </div>
                        {task.dueDate && (
                          <div className={`task-due ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                            <Calendar size={12} />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                        {task.assignedTo && (
                          <div className="task-assigned">
                            <User size={12} />
                            {currentServer?.members.find(m => m.id === task.assignedTo)?.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className="task-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className="task-section">
          <div className="section-header">
            <div className="section-title">
              <Clock size={16} />
              <span>In Progress</span>
              <span className="section-count">{inProgressTasks.length}</span>
            </div>
          </div>
          <div className="task-list">
            {inProgressTasks.map(task => (
              <div key={task.id} className="task-item in-progress">
                <div className="task-content">
                  <div className="task-main">
                    <button
                      className="task-status"
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      title="Mark as completed"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="task-info">
                      <div className="task-name">{task.title}</div>
                      {task.description && (
                        <div className="task-description">{task.description}</div>
                      )}
                      <div className="task-meta">
                        <div 
                          className="task-priority"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </div>
                        {task.dueDate && (
                          <div className={`task-due ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                            <Calendar size={12} />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                        {task.assignedTo && (
                          <div className="task-assigned">
                            <User size={12} />
                            {currentServer?.members.find(m => m.id === task.assignedTo)?.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className="task-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="task-section">
          <div className="section-header">
            <div className="section-title">
              <Check size={16} />
              <span>Completed</span>
              <span className="section-count">{completedTasks.length}</span>
            </div>
          </div>
          <div className="task-list">
            {completedTasks.map(task => (
              <div key={task.id} className="task-item completed">
                <div className="task-content">
                  <div className="task-main">
                    <button
                      className="task-status"
                      onClick={() => handleStatusChange(task.id, 'todo')}
                      title="Mark as to do"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="task-info">
                      <div className="task-name">{task.title}</div>
                      {task.description && (
                        <div className="task-description">{task.description}</div>
                      )}
                      <div className="task-meta">
                        <div 
                          className="task-priority"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </div>
                        {task.dueDate && (
                          <div className="task-due">
                            <Calendar size={12} />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                        {task.assignedTo && (
                          <div className="task-assigned">
                            <User size={12} />
                            {currentServer?.members.find(m => m.id === task.assignedTo)?.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className="task-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tasks.length === 0 && !showAddForm && (
        <div className="empty-tasks">
          <AlertCircle size={48} className="empty-icon" />
          <h4>No tasks yet</h4>
          <p>Create your first task to start organizing your channel work</p>
        </div>
      )}
    </aside>
  );
};

export default TaskSidebar;