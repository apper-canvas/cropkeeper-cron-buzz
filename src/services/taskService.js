import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook to fetch all tasks with optional filtering
 */
export function useGetTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const params = {
          Fields: [
            { Field: { Name: "Id" } },
            { Field: { Name: "title" } },
            { Field: { Name: "description" } },
            { Field: { Name: "dueDate" } },
            { Field: { Name: "priority" } },
            { Field: { Name: "completed" } },
            { Field: { Name: "farmId" } }
          ],
          expands: [
            { name: "farmId", alias: "farm" }
          ],
          orderBy: [
            { field: "dueDate", direction: "asc" }
          ]
        };

        // Apply filters if provided
        if (filters) {
          const whereConditions = [];
          
          if (filters.farmId && filters.farmId !== 'all') {
            whereConditions.push({
              fieldName: "farmId",
              operator: "ExactMatch",
              values: [filters.farmId]
            });
          }
          
          if (filters.status === 'completed') {
            whereConditions.push({
              fieldName: "completed",
              operator: "ExactMatch",
              values: [true]
            });
          } else if (filters.status === 'pending') {
            whereConditions.push({
              fieldName: "completed",
              operator: "ExactMatch",
              values: [false]
            });
          }
          
          if (whereConditions.length > 0) {
            params.where = whereConditions;
          }
        }

        const response = await apperClient.fetchRecords("task", params);

        if (response && response.data) {
          // Process the data to have the right format for the UI
          const processedTasks = response.data.map(task => ({
            id: task.Id,
            title: task.title,
            description: task.description,
            farmId: task.farmId,
            farmName: task.farm ? task.farm.Name : 'Unknown Farm',
            dueDate: task.dueDate,
            priority: task.priority,
            completed: task.completed
          }));
          
          setTasks(processedTasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err);
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, [filters]);

  return { tasks, isLoading, error, setTasks };
}

/**
 * Create a new task
 */
export async function createTask(taskData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Format the data for creation
    const formattedData = {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      completed: taskData.completed,
      farmId: parseInt(taskData.farmId)
    };

    const response = await apperClient.createRecord("task", { records: [formattedData] });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create task");
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

/**
 * Update an existing task
 */
export async function updateTask(taskData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Format the data for update
    const formattedData = {
      Id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      completed: taskData.completed,
      farmId: parseInt(taskData.farmId)
    };

    const response = await apperClient.updateRecord("task", { records: [formattedData] });
    
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    return await apperClient.deleteRecord("task", { RecordIds: [taskId] });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}