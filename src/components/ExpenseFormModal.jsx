import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

function ExpenseFormModal({ isOpen, onClose, onSave, expense = null, farms }) {
  // Icons
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const DollarSignIcon = getIcon('DollarSign');
  const TagIcon = getIcon('Tag');
  const FileTextIcon = getIcon('FileText');
  const MapPinIcon = getIcon('MapPin');

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    category: '',
    description: '',
    farmId: farms.length > 0 ? farms[0].id : '',
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Set form data when editing an expense
  useEffect(() => {
    if (expense) {
      setFormData({
        id: expense.id,
        date: expense.date,
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        farmId: expense.farmId,
      });
    } else {
      // Reset form for new expense
      setFormData({
        id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        category: '',
        description: '',
        farmId: farms.length > 0 ? farms[0].id : '',
      });
    }
    
    // Reset errors when opening modal
    setErrors({});
  }, [expense, isOpen, farms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.farmId) {
      newErrors.farmId = 'Farm is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const expenseData = {
        ...formData,
        id: formData.id || Date.now().toString(),
        amount: parseFloat(formData.amount),
      };
      
      onSave(expenseData);
      onClose();
    }
  };

  // Available expense categories
  const categories = [
    'Seeds', 'Fertilizer', 'Pesticides', 'Equipment', 'Fuel', 
    'Labor', 'Maintenance', 'Utilities', 'Insurance', 'Other'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-soft max-w-lg w-full mx-auto"
          >
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
                {expense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button 
                onClick={onClose}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="label flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" /> Date
                  </label>
                  <input 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`input ${errors.date ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                
                <div>
                  <label className="label flex items-center">
                    <DollarSignIcon className="h-4 w-4 mr-1" /> Amount
                  </label>
                  <input 
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    className={`input ${errors.amount ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>
                
                <div>
                  <label className="label flex items-center">
                    <TagIcon className="h-4 w-4 mr-1" /> Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`input ${errors.category ? 'border-red-500 dark:border-red-500' : ''}`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                
                <div>
                  <label className="label flex items-center">
                    <FileTextIcon className="h-4 w-4 mr-1" /> Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    rows="3"
                    className={`input ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
                
                <div>
                  <label className="label flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" /> Farm
                  </label>
                  <select
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleChange}
                    className={`input ${errors.farmId ? 'border-red-500 dark:border-red-500' : ''}`}
                  >
                    <option value="">Select a farm</option>
                    {farms.map(farm => (
                      <option key={farm.id} value={farm.id}>{farm.name}</option>
                    ))}
                  </select>
                  {errors.farmId && <p className="text-red-500 text-xs mt-1">{errors.farmId}</p>}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn border border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {expense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ExpenseFormModal;