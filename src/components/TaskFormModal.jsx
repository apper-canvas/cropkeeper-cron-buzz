import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const TaskFormModal = ({ isOpen, onClose, onSubmit, task, farms }) => {
  // Icons
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const ListTodoIcon = getIcon('ListTodo');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    farmId: farms.length > 0 ? farms[0].id : '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    completed: false
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing mode - populate form with task data
        setFormData({
          title: task.title,
          description: task.description,
          farmId: task.farmId,
          dueDate: task.dueDate,
          priority: task.priority,
          completed: task.completed
        });
      } else {
        // Adding mode - reset form
        setFormData({
          title: '',
          description: '',
          farmId: farms.length > 0 ? farms[0].id : '',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'medium',
          completed: false
        });
      }
      setErrors({});
    }
  }, [isOpen, task, farms]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    // Farm validation
    if (!formData.farmId) {
      newErrors.farmId = 'Please select a farm';
    }

    // Due date validation
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Convert farmId to number
        const processedData = {
          ...formData,
          farmId: parseInt(formData.farmId)
        };
        
        onSubmit(processedData);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ form: 'An error occurred while saving the task' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Prevent interaction with background when modal is open
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="text-xl font-bold flex items-center text-surface-800 dark:text-surface-100">
                <ListTodoIcon className="mr-2 h-5 w-5 text-primary" />
                {task ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                aria-label="Close modal"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-5 p-6 pt-2 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-hide">
              <div>
                <label htmlFor="title" className="label">Task Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input ${errors.title ? 'border-red-500 dark:border-red-700' : ''}`}
                  placeholder="Enter task title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input min-h-[6rem]"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="farmId" className="label">Farm*</label>
                  <select 
                    id="farmId"
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleChange}
                    className={`input ${errors.farmId ? 'border-red-500 dark:border-red-700' : ''}`}
                  >
                    {farms.map(farm => (
                      <option key={farm.Id} value={farm.Id}>{farm.Name}</option>
                    ))}
                  </select>
                  {errors.farmId && <p className="text-red-500 text-sm mt-1">{errors.farmId}</p>}
                </div>

                <div>
                  <label htmlFor="dueDate" className="label">Due Date*</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.dueDate ? 'border-red-500 dark:border-red-700' : ''}`}
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
                    {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className="label">Priority</label>
                  <select 
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <input
                    type="checkbox"
                    id="completed"
                    name="completed"
                    checked={formData.completed}
                    onChange={handleChange}
                    className="h-5 w-5 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="completed" className="ml-2 text-surface-700 dark:text-surface-300">
                    Mark as completed
                  </label>
                </div>
              </div>

              {errors.form && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-2 rounded">
                  {errors.form}
                </div>
              )}
              </div>

              {/* Modal Footer - Always visible */}
              <div className="flex justify-end gap-3 p-6 pt-4 mt-auto border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary px-5 py-2.5"
                  >
                  {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;