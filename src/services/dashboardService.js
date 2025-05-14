import { useState, useEffect } from 'react';

/**
 * Hook to fetch recent items for dashboard overview
 */
export function useGetRecentItems() {
  const [recentCrops, setRecentCrops] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecentItems() {
      try {
        setIsLoading(true);
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        // Recent crops request
        const cropsParams = {
          Fields: [
            { Field: { Name: "Id" } },
            { Field: { Name: "Name" } },
            { Field: { Name: "variety" } },
            { Field: { Name: "status" } },
            { Field: { Name: "plantingDate" } },
            { Field: { Name: "farmId" } }
          ],
          expands: [
            { name: "farmId", alias: "farm" }
          ],
          orderBy: [
            { field: "CreatedOn", direction: "desc" }
          ],
          pagingInfo: {
            limit: 3
          }
        };

        // Recent tasks request
        const tasksParams = {
          Fields: [
            { Field: { Name: "Id" } },
            { Field: { Name: "title" } },
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
          ],
          where: [
            {
              fieldName: "completed",
              operator: "ExactMatch",
              values: [false]
            }
          ],
          pagingInfo: {
            limit: 3
          }
        };

        // Execute requests in parallel
        const [cropsResponse, tasksResponse] = await Promise.all([
          apperClient.fetchRecords("crop", cropsParams),
          apperClient.fetchRecords("task", tasksParams)
        ]);

        if (cropsResponse && cropsResponse.data) {
          setRecentCrops(cropsResponse.data);
        }

        if (tasksResponse && tasksResponse.data) {
          // Format tasks for UI consistency
          const formattedTasks = tasksResponse.data.map(task => ({
            ...task,
            farmName: task.farm ? task.farm.Name : 'Unknown Farm'
          }));
          setRecentTasks(formattedTasks);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentItems();
  }, []);

  return { recentCrops, recentTasks, recentExpenses, isLoading, error };
}