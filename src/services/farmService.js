import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook to fetch all farms
 */
export function useGetFarms() {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFarms() {
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
            { Field: { Name: "Name" } },
            { Field: { Name: "location" } },
            { Field: { Name: "size" } },
            { Field: { Name: "CreatedOn" } }
          ],
          orderBy: [
            { field: "CreatedOn", direction: "desc" }
          ]
        };

        const response = await apperClient.fetchRecords("farm", params);

        if (response && response.data) {
          setFarms(response.data);
        } else {
          setFarms([]);
        }
      } catch (err) {
        console.error("Error fetching farms:", err);
        setError(err);
        toast.error("Failed to load farms");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFarms();
  }, []);

  return { farms, isLoading, error, setFarms };
}

/**
 * Hook to get a specific farm by ID
 */
export function useGetFarm(farmId) {
  const [farm, setFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFarm() {
      if (!farmId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const response = await apperClient.getRecordById("farm", farmId);

        if (response && response.data) {
          setFarm(response.data);
        } else {
          setFarm(null);
          setError(new Error("Farm not found"));
        }
      } catch (err) {
        console.error(`Error fetching farm with ID ${farmId}:`, err);
        setError(err);
        toast.error("Failed to load farm details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFarm();
  }, [farmId]);

  return { farm, isLoading, error };
}

/**
 * Create a new farm
 */
export async function createFarm(farmData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord("farm", { records: [farmData] });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create farm");
  } catch (error) {
    console.error("Error creating farm:", error);
    throw error;
  }
}

/**
 * Update an existing farm
 */
export async function updateFarm(farmData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.updateRecord("farm", { records: [farmData] });
    
    return response;
  } catch (error) {
    console.error("Error updating farm:", error);
    throw error;
  }
}