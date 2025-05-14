import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook to fetch all expenses with optional filtering
 */
export function useGetExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchExpenses() {
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
            { Field: { Name: "date" } },
            { Field: { Name: "amount" } },
            { Field: { Name: "category" } },
            { Field: { Name: "description" } },
            { Field: { Name: "farmId" } }
          ],
          expands: [
            { name: "farmId", alias: "farm" }
          ],
          orderBy: [
            { field: "date", direction: filters.sortConfig?.key === "date" ? filters.sortConfig.direction : "desc" }
          ]
        };

        // Apply filters if provided
        if (filters) {
          const whereConditions = [];
          
          if (filters.farm && filters.farm !== '') {
            whereConditions.push({
              fieldName: "farmId",
              operator: "ExactMatch",
              values: [filters.farm]
            });
          }
          
          if (filters.startDate && filters.startDate !== '') {
            whereConditions.push({
              fieldName: "date",
              operator: "GreaterThanEqual",
              values: [filters.startDate]
            });
          }
          
          if (filters.endDate && filters.endDate !== '') {
            whereConditions.push({
              fieldName: "date",
              operator: "LessThanEqual",
              values: [filters.endDate]
            });
          }
          
          if (filters.searchTerm && filters.searchTerm !== '') {
            const searchGroup = {
              operator: "OR",
              subGroups: [
                {
                  conditions: [
                    {
                      fieldName: "description",
                      operator: "Contains",
                      values: [filters.searchTerm]
                    }
                  ]
                },
                {
                  conditions: [
                    {
                      fieldName: "category",
                      operator: "Contains",
                      values: [filters.searchTerm]
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
          
          // Handle different sort configurations
          if (filters.sortConfig && filters.sortConfig.key !== "date") {
            params.orderBy = [
              { field: filters.sortConfig.key, direction: filters.sortConfig.direction }
            ];
          }
        }

        const response = await apperClient.fetchRecords("expense", params);

        if (response && response.data) {
          // Format data for UI
          const formattedExpenses = response.data.map(expense => ({
            id: expense.Id,
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            farmId: expense.farmId,
            farmName: expense.farm ? expense.farm.Name : 'Unknown Farm'
          }));
          
          setExpenses(formattedExpenses);
        } else {
          setExpenses([]);
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err);
        toast.error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpenses();
  }, [filters]);

  return { expenses, isLoading, error, setExpenses };
}

/**
 * Create a new expense
 */
export async function createExpense(expenseData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Format data properly for the API
    const formattedData = {
      ...expenseData,
      farmId: parseInt(expenseData.farmId),
      amount: parseFloat(expenseData.amount)
    };

    const response = await apperClient.createRecord("expense", { records: [formattedData] });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create expense");
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}

/**
 * Delete an expense
 */
export async function deleteExpense(expenseId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    return await apperClient.deleteRecord("expense", { RecordIds: [expenseId] });
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
}