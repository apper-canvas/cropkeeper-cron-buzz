import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const AddFarmModal = ({ isOpen, onClose, onAddFarm }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    cropTypes: '',
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const initialFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        name: '',
        location: '',
        size: '',
        cropTypes: '',
      });
      setErrors({});
      
      // Focus the first input when modal opens
      setTimeout(() => {
        if (initialFocusRef.current) {
          initialFocusRef.current.focus();
        }
      }, 100);
      
      // Add escape key listener
      const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Farm name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.size.trim()) {
      newErrors.size = 'Farm size is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create new farm with random ID and initial crops/tasks count
      const newFarm = {
        id: Date.now(),
        name: formData.name,
        location: formData.location,
        size: formData.size,
        crops: 0,
        tasks: 0,
        cropTypes: formData.cropTypes.split(',').map(crop => crop.trim()).filter(Boolean)
      };
      
      onAddFarm(newFarm);
      toast.success(`Farm "${formData.name}" has been added successfully!`);
      onClose();
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold mb-4">Add New Farm</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="name">Farm Name</label>
                <input ref={initialFocusRef} id="name" name="name" type="text" className={`input ${errors.name ? 'border-red-500 dark:border-red-700' : ''}`} value={formData.name} onChange={handleChange} placeholder="Green Valley Farm" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="label" htmlFor="location">Location</label>
                <input id="location" name="location" type="text" className={`input ${errors.location ? 'border-red-500 dark:border-red-700' : ''}`} value={formData.location} onChange={handleChange} placeholder="North County" />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              
              <div>
                <label className="label" htmlFor="size">Farm Size</label>
                <input id="size" name="size" type="text" className={`input ${errors.size ? 'border-red-500 dark:border-red-700' : ''}`} value={formData.size} onChange={handleChange} placeholder="24 acres" />
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
              </div>
              
              <div>
                <label className="label" htmlFor="cropTypes">Crop Types (comma separated)</label>
                <input id="cropTypes" name="cropTypes" type="text" className="input" value={formData.cropTypes} onChange={handleChange} placeholder="Corn, Wheat, Soybeans" />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Farm
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddFarmModal;