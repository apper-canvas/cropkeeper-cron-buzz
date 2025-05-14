import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import TaskFormModal from '../components/TaskFormModal';

function TasksPage() {
  // Icons
  const ListTodoIcon = getIcon('ListTodo');
  const FilterIcon = getIcon('Filter');
  const CheckIcon = getIcon('Check');
  const ClockIcon = getIcon('Clock');
  const TrashIcon = getIcon('Trash');
  const EditIcon = getIcon('Edit');
  const PlusIcon = getIcon('Plus');

  // Sample data for tasks and farms
  const [farms, setFarms] = useState([
    { id: 1, name: "Green Valley Farm", location: "North County", size: "24 acres" },
    { id: 2, name: "Riverside Fields", location: "Eastern Plains", size: "16 acres" },
  ]);

  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Water tomato field", 
      description: "Ensure the drip irrigation system is working properly", 
      farmId: 1, 
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      priority: "high",
      completed: false
    },
    { 
      id: 2, 
      title: "Harvest corn", 
      description: "Corn in the south field is ready for harvest", 
      farmId: 1, 
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Day after tomorrow
      priority: "medium",
      completed: false
    },
    { 
      id: 3, 
      title: "Repair fence", 
      description: "Eastern fence needs repair after the storm", 
      farmId: 2, 
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      priority: "low",
      completed: true
    },
  ]);

  // Filter states
  const [selectedFarmId, setSelectedFarmId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Apply filters
  useEffect(() => {
    let result = [...tasks];
    
    // Apply farm filter
    if (selectedFarmId !== 'all') {
      result = result.filter(task => task.farmId === parseInt(selectedFarmId));
    }
    
    // Apply status filter
    if (statusFilter === 'completed') {
      result = result.filter(task => task.completed);
    } else if (statusFilter === 'pending') {
      result = result.filter(task => !task.completed);
    }
    
    // Sort by due date (closer dates first)
    result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    setFilteredTasks(result);
  }, [tasks, selectedFarmId, statusFilter]);

  // Create new task
  const handleAddTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
    };
    setTasks([...tasks, taskWithId]);
    toast.success("Task added successfully!");
  };

  // Update existing task
  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast.success("Task updated successfully!");
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully!");
    }
  };

  // Toggle task completion status
  const handleToggleCompletion = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        return updatedTask;
      }
      return task;
    }));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.info(task.completed ? "Task marked as pending" : "Task marked as completed");
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
                <option key={farm.id} value={farm.id}>{farm.name}</option>
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

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-surface-500 dark:text-surface-400 font-medium">No tasks found. Create a new task to get started!</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const farm = farms.find(f => f.id === task.farmId);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`card border-l-4 ${task.completed ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-l-primary'}`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-start">
                      <button 
                        onClick={() => handleToggleCompletion(task.id)}
                        className={`rounded-full mr-3 min-w-8 h-8 flex items-center justify-center border-2 shadow-sm ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-surface-300 dark:border-surface-600'
                        }`}
                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {task.completed && <CheckIcon className="h-4 w-4" />}
                      </button>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${task.completed ? 'line-through text-surface-500 dark:text-surface-400' : ''}`}>
                          {task.title}
                        </h3>
                        <p className="text-surface-600 dark:text-surface-400 mb-2">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {farm && <span className="bg-primary/10 text-primary dark:bg-primary/20 px-2 py-1 rounded-md font-medium">{farm.name}</span>}
                          <span className="flex items-center text-surface-600 dark:text-surface-300 font-medium">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                           </span>
                          <span className={`px-2 py-1 rounded ${getPriorityClass(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4 sm:mt-0 ml-11 sm:ml-0">
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="btn py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white"
                      aria-label="Edit task"
                    >
                      <EditIcon className="h-4 w-4 mr-1" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white"
                      aria-label="Delete task"
                      title="Delete task"
                    >
                      <TrashIcon className="h-4 w-4" />
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
        className="fixed right-6 bottom-20 rounded-full bg-primary hover:bg-primary-dark text-white p-4 shadow-xl flex items-center justify-center"
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