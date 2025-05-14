import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import getIcon from '../utils/iconUtils';
import ExpenseFormModal from '../components/ExpenseFormModal';

  const navigate = useNavigate();
function ExpensesPage() {
  // Icons
  const PlusIcon = getIcon('Plus');
  const FilterIcon = getIcon('Filter');
  const SearchIcon = getIcon('Search');
  const BanknoteIcon = getIcon('Banknote');
  const EditIcon = getIcon('Edit');
  const Trash2Icon = getIcon('Trash2');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  const ChevronUpIcon = getIcon('ChevronUp');
  const ChevronDownIcon = getIcon('ChevronDown');
  const PieChartIcon = getIcon('PieChart');
  const RefreshCwIcon = getIcon('RefreshCw');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const CalendarIcon = getIcon('Calendar');

  // State for farms
  const [farms, setFarms] = useState(() => {
    const savedFarms = localStorage.getItem('farms');
    return savedFarms ? JSON.parse(savedFarms) : [];
  });

  // State for expenses
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [
      {
        id: '1',
        date: '2023-05-15',
        amount: 250.00,
        category: 'Seeds',
        description: 'Spring corn seeds',
        farmId: farms.length > 0 ? farms[0].id : ''
      },
      {
        id: '2',
        date: '2023-05-20',
        amount: 175.50,
        category: 'Fertilizer',
        description: 'Organic fertilizer for vegetable plots',
        farmId: farms.length > 0 ? farms[0].id : ''
      },
      {
        id: '3',
        date: '2023-06-05',
        amount: 420.75,
        category: 'Equipment',
        description: 'Irrigation system repairs',
        farmId: farms.length > 0 && farms.length > 1 ? farms[1].id : farms.length > 0 ? farms[0].id : ''
      }
    ];
  });

  // Filter state
  const [filters, setFilters] = useState({
    farm: '',
    startDate: '',
    endDate: '',
    searchTerm: '',
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc',
  });

  // Modal state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      farm: '',
      startDate: '',
      endDate: '',
      searchTerm: '',
    });
  };

  // Sort expenses
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      // Farm filter
      if (filters.farm && expense.farmId !== filters.farm) return false;
      
      // Date range filter
      if (filters.startDate && expense.date < filters.startDate) return false;
      if (filters.endDate && expense.date > filters.endDate) return false;
      
      // Search term filter (case insensitive)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      } else if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      } else {
        return sortConfig.direction === 'asc'
          ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
          : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
      }
    });

  // Calculate statistics for the filtered expenses
  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory = filteredAndSortedExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Sort categories by amount
  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 categories

  // Get farm name by id
  const getFarmName = (farmId) => {
    const farm = farms.find(farm => farm.id.toString() === farmId.toString());
    return farm ? farm.name : 'Unknown Farm';
  };

  // Add new expense
  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
    toast.success('Expense added successfully!');
  };

  // Update expense
  const handleUpdateExpense = (updatedExpense) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    toast.success('Expense updated successfully!');
  };

  // Delete expense
  const handleDeleteExpense = () => {
    if (expenseToDelete) {
      setExpenses(prev => prev.filter(expense => expense.id !== expenseToDelete.id));
      toast.success('Expense deleted successfully!');
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  // Open add/edit expense modal
  const openExpenseModal = (expense = null) => {
    setCurrentExpense(expense);
    setIsExpenseModalOpen(true);
  };

  // Save expense (add or update)
  const saveExpense = (expenseData) => {
    if (expenseData.id && expenses.some(e => e.id === expenseData.id)) {
      handleUpdateExpense(expenseData);
    } else {
      handleAddExpense(expenseData);
    }
  };

  // Confirm delete expense
  const confirmDelete = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold flex items-center mb-2">
            <BanknoteIcon className="h-6 w-6 mr-2 text-secondary" />
            Expense Management
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track and manage all your farm expenses
          </p>
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg mt-4 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to Dashboard"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Dashboard
          </motion.button>
          
        </header>

        {/* Filters Section */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FilterIcon className="h-5 w-5 mr-2 text-primary" />
              Filter Expenses
            </h2>
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-primary dark:text-primary-light hover:underline"
            >
              <RefreshCwIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Farm</label>
              <select
                name="farm"
                value={filters.farm}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Farms</option>
                {farms.map(farm => (
                  <option key={farm.id} value={farm.id}>{farm.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" /> Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>

            <div>
              <label className="label flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" /> End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Search</label>
              <div className="relative">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search expenses..."
                  className="input pl-10"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-secondary" />
              Expense Summary
            </h3>
            <div className="flex flex-col gap-3">
              <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-lg">
                <p className="text-surface-600 dark:text-surface-400 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Top Categories</h4>
                <div className="space-y-2">
                  {sortedCategories.length > 0 ? (
                    sortedCategories.map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm font-medium">${amount.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-surface-500 dark:text-surface-400">No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-xl shadow-card p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <BanknoteIcon className="h-5 w-5 mr-2 text-primary" />
                Expenses
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openExpenseModal()}
                className="btn btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Expense
              </motion.button>
            </div>

            {filteredAndSortedExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('date')}>
                        <div className="flex items-center">
                          Date
                          {sortConfig.key === 'date' ? (
                            sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />
                          ) : <ArrowUpDownIcon className="h-4 w-4 ml-1" />}
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('category')}>
                        <div className="flex items-center">
                          Category
                          {sortConfig.key === 'category' ? (
                            sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />
                          ) : <ArrowUpDownIcon className="h-4 w-4 ml-1" />}
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('amount')}>
                        <div className="flex items-center">
                          Amount
                          {sortConfig.key === 'amount' ? (
                            sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />
                          ) : <ArrowUpDownIcon className="h-4 w-4 ml-1" />}
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Farm</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Description</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                    {filteredAndSortedExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50">
                        <td className="px-3 py-4 whitespace-nowrap">{format(parseISO(expense.date), 'MMM dd, yyyy')}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap font-medium">${expense.amount.toFixed(2)}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{getFarmName(expense.farmId)}</td>
                        <td className="px-3 py-4">{expense.description}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => openExpenseModal(expense)}
                            className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(expense)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-surface-500 dark:text-surface-400">No expenses found matching your filters.</p>
                <button
                  onClick={() => openExpenseModal()}
                  className="mt-4 btn btn-primary"
                >
                  Add Your First Expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={saveExpense}
        expense={currentExpense}
        farms={farms}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-soft max-w-md w-full mx-auto p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-surface-600 dark:text-surface-300">
              Are you sure you want to delete this expense? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn border border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExpense}
                className="btn bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;