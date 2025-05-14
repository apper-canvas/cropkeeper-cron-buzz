import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import TaskFormModal from '../components/TaskFormModal';
import { useGetFarms } from '../services/farmService';
import { useGetTasks, createTask, updateTask, deleteTask } from '../services/taskService';

function TasksPage() {
  const navigate = useNavigate();
  
  // Icons
  const ListTodoIcon = getIcon('ListTodo');
  const FilterIcon = getIcon('Filter');
  const CheckIcon = getIcon('Check');
  const ClockIcon = getIcon('Clock');
  const TrashIcon = getIcon('Trash');
  const EditIcon = getIcon('Edit');
  const PlusIcon = getIcon('Plus');
  const LoaderIcon = getIcon('Loader');
  const ChevronLeftIcon = getIcon('ChevronLeft');

  // Filter states
  const [selectedFarmId, setSelectedFarmId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Get farms and tasks from services
  const { farms } = useGetFarms();
  
  const filters = {
    farmId: selectedFarmId === 'all' ? null : selectedFarmId,
    status: statusFilter
  };
  
  const { tasks, isLoading, error, setTasks } = useGetTasks(filters);

  // Set filtered tasks based on API data
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);
  
  // Go back to dashboard
  const handleGoBack = () => {
    navigate('/');
  };

  // Create new task
  const handleAddTask = async (newTask) => {
    try {
      const result = await createTask(newTask);
      toast.success("Task added successfully!");
      
      // Update local tasks list
      setTasks(prev => [...prev, {
        id: result.Id,
        title: result.title,
        description: result.description,
        farmId: result.farmId,
        dueDate: result.dueDate,
        priority: result.priority,
        completed: result.completed
      }]);
    } catch (error) {
      toast.error("Failed to add task: " + error.message);
    }
  };

  // Update existing task
  const handleUpdateTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task: " + error.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete task: " + error.message);
      }
    }
  };

  // Toggle task completion status
  const handleToggleCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      try {
        const updatedTask = { ...task, completed: !task.completed };
        await updateTask(updatedTask);
        
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        toast.info(task.completed ? "Task marked as pending" : "Task marked as completed");
      } catch (error) {
        toast.error("Failed to update task: " + error.message);
      }
    }
  };

  // Open modal for adding a new task
  const handleOpenAddModal = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing task
  const handleOpenEditModal = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  // Handle form submission from the modal
  const handleTaskFormSubmit = (taskData) => {
    if (currentTask) {
      handleUpdateTask({ ...currentTask, ...taskData });
    } else {
      handleAddTask(taskData);
    }
    handleCloseModal();
  };

  // Get priority class for styling
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center mb-4 md:mb-0">
          <ListTodoIcon className="mr-2 h-6 w-6 text-primary" />
          Tasks Management
        </h1>
        
        <motion.button
            onClick={handleGoBack}
            className="flex items-center bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg mb-4 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to Dashboard"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Dashboard
        </motion.button>

        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center">
            <label htmlFor="farm-filter" className="mr-2 text-sm font-medium whitespace-nowrap">Farm:</label>
            <select 
              id="farm-filter"
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="input py-2 px-3 text-sm"
            >
              <option value="all">All Farms</option>
              {farms.map(farm => (
                <option key={farm.Id} value={farm.Id}>{farm.Name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`btn py-1 px-3 ${statusFilter === 'all' ? 'btn-primary' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}
            >All Tasks</button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`btn py-1 px-3 ${statusFilter === 'pending' ? 'btn-primary' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}
            >To Do</button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`btn py-1 px-3 ${statusFilter === 'completed' ? 'btn-primary' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}
            >Done</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="card text-center py-16 border border-surface-200 dark:border-surface-700 flex flex-col items-center justify-center">
            <LoaderIcon className="animate-spin h-8 w-8 text-primary mb-4" />
            <p className="text-surface-500 dark:text-surface-400 text-lg font-medium">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="card text-center py-16 border border-surface-200 dark:border-surface-700">
            <p className="text-red-500 text-lg font-medium mb-2">Error loading tasks</p>
            <p className="text-surface-500 dark:text-surface-400">Please try refreshing the page</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card text-center py-16 border border-surface-200 dark:border-surface-700">
            <p className="text-surface-500 dark:text-surface-400 text-lg font-medium">No tasks found. Create a new task to get started!</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const farm = farms.find(f => f.Id.toString() === task.farmId.toString());
            return (
              <motion.div 
          
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`card border-l-4 hover:shadow-lg transition-all duration-300 ${
                  task.completed 
                    ? 'border-l-green-500 bg-green-50/30 dark:bg-green-900/10' 
                    : 'border-l-primary'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => handleToggleCompletion(task.id)}
                        className={`rounded-full min-w-8 h-8 flex items-center justify-center border-2 shadow-sm transition-colors ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-surface-300 dark:border-surface-600 hover:border-primary dark:hover:border-primary-light'
                        }`}
                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {task.completed && <CheckIcon className="h-4 w-4" />}
                      </button>
                      <div className="flex-1 pt-0.5">
                        <h3 className={`text-lg font-semibold mb-2.5 ${task.completed ? 'line-through text-surface-500 dark:text-surface-400' : ''}`}>
                          {task.title}
                        </h3>
                        <p className="text-surface-600 dark:text-surface-400 mb-4 leading-relaxed">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {task.farmName && (
                            <span className="bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1.5 rounded-md font-medium">
                              {task.farmName}
                            </span>
                          )}
                          <span className="flex items-center text-surface-600 dark:text-surface-400 font-medium whitespace-nowrap bg-surface-100 dark:bg-surface-700/50 px-3 py-1.5 rounded-md">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                           </span>
                          <span className={`px-3 py-1.5 rounded-md font-medium ${getPriorityClass(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-3 sm:mt-0 ml-11 sm:ml-0">
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="btn py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      aria-label="Edit task"
                    >
                      <EditIcon className="h-4 w-4 mr-1" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn py-2 px-3 bg-red-500 hover:bg-red-600 text-white transition-colors"
                      aria-label="Delete task"
                      title="Delete task"
                    >
                      <TrashIcon className="h-4 w-4 mx-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenAddModal}
        className="fixed right-6 bottom-20 rounded-full bg-primary hover:bg-primary-dark text-white p-4 shadow-xl flex items-center justify-center transition-colors"
        aria-label="Add new task"
      >
        <PlusIcon className="h-6 w-6" />
      </motion.button>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskFormSubmit}
        task={currentTask}
        farms={farms}
      />
    </div>
  );
}

export default TasksPage;