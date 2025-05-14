import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook to fetch all crops with optional filtering
 */
export function useGetCrops(filters = {}) {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCrops() {
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
            { Field: { Name: "variety" } },
            { Field: { Name: "location" } },
            { Field: { Name: "plantingDate" } },
            { Field: { Name: "harvestDate" } },
            { Field: { Name: "status" } },
            { Field: { Name: "farmId" } }
          ],
          expands: [
            { name: "farmId", alias: "farm" }
          ],
          orderBy: [
            { field: "plantingDate", direction: "desc" }
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
          
          if (filters.status && filters.status !== 'all') {
            whereConditions.push({
              fieldName: "status",
              operator: "ExactMatch",
              values: [filters.status]
            });
          }
          
          if (filters.searchQuery) {
            const searchGroup = {
              operator: "OR",
              subGroups: [
                {
                  conditions: [
                    {
                      fieldName: "Name",
                      operator: "Contains",
                      values: [filters.searchQuery]
                    }
                  ]
                },
                {
                  conditions: [
                    {
                      fieldName: "variety",
                      operator: "Contains",
                      values: [filters.searchQuery]
                    }
                  ]
                }
              ]
            };
            
            params.whereGroups = [searchGroup];
          }
          
          if (whereConditions.length > 0) {
            params.where = whereConditions;
          }
        }

        const response = await apperClient.fetchRecords("crop", params);

        if (response && response.data) {
          // Process the data to add farmName
          const processedCrops = response.data.map(crop => {
            const farmName = crop.farm ? crop.farm.Name : 'Unknown Farm';
            return {
              ...crop,
              farmName
            };
          });
          
          setCrops(processedCrops);
        } else {
          setCrops([]);
        }
      } catch (err) {
        console.error("Error fetching crops:", err);
        setError(err);
        toast.error("Failed to load crops");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCrops();
  }, [filters]);

  return { crops, isLoading, error, setCrops };
}

/**
 * Create a new crop
 */
export async function createCrop(cropData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Make sure farmId is a number
    const formattedData = {
      ...cropData,
      farmId: parseInt(cropData.farmId)
    };

    const response = await apperClient.createRecord("crop", { records: [formattedData] });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create crop");
  } catch (error) {
    console.error("Error creating crop:", error);
    throw error;
  }
}

/**
 * Update an existing crop
 */
export async function updateCrop(cropData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Make sure farmId is a number
    const formattedData = {
      ...cropData,
      farmId: parseInt(cropData.farmId)
    };

    const response = await apperClient.updateRecord("crop", { records: [formattedData] });
    
    return response;
  } catch (error) {
    console.error("Error updating crop:", error);
    throw error;
  }
}