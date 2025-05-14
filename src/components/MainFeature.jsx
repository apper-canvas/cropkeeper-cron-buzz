import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Icons
  const SeedlingIcon = getIcon('Seedling');
  const CalendarIcon = getIcon('Calendar');
  const MapPinIcon = getIcon('MapPin');
  const InfoIcon = getIcon('Info');
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  const MoveIcon = getIcon('Move');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const FilterIcon = getIcon('Filter');

  // State for crops
  const [crops, setCrops] = useState(() => {
    const savedCrops = localStorage.getItem('crops');
    return savedCrops ? JSON.parse(savedCrops) : [
      { id: 1, name: "Corn", variety: "Sweet Corn", location: "Field A", plantingDate: "2023-04-15", harvestDate: "2023-08-20", status: "growing" },
      { id: 2, name: "Tomatoes", variety: "Roma", location: "Greenhouse 1", plantingDate: "2023-05-01", harvestDate: "2023-07-15", status: "harvested" },
      { id: 3, name: "Wheat", variety: "Hard Red", location: "North Field", plantingDate: "2023-03-10", harvestDate: "2023-07-30", status: "growing" }
    ];
  });

  // State for crop form
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const initialFormState = {
    name: '',
    variety: '',
    location: '',
    plantingDate: '',
    harvestDate: '',
    status: 'planted'
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Effect to save crops to localStorage
  useEffect(() => {
    localStorage.setItem('crops', JSON.stringify(crops));
  }, [crops]);

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Crop name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.plantingDate) errors.plantingDate = "Planting date is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingCropId) {
      // Update existing crop
      setCrops(crops.map(crop => 
        crop.id === editingCropId ? { ...formData, id: editingCropId } : crop
      ));
      toast.success("Crop updated successfully!");
    } else {
      // Add new crop
      const newCrop = {
        ...formData,
        id: Date.now()
      };
      setCrops([...crops, newCrop]);
      toast.success("New crop added successfully!");
    }
    
    // Reset form and state
    setFormData(initialFormState);
    setIsAddingCrop(false);
    setEditingCropId(null);
  };

  // Handler for edit crop
  const handleEditCrop = (crop) => {
    setFormData(crop);
    setEditingCropId(crop.id);
    setIsAddingCrop(true);
  };

  // Handler for delete crop
  const handleDeleteCrop = (id) => {
    setCrops(crops.filter(crop => crop.id !== id));
    toast.success("Crop deleted successfully!");
  };

  // Cancel form
  const handleCancelForm = () => {
    setFormData(initialFormState);
    setIsAddingCrop(false);
    setEditingCropId(null);
    setFormErrors({});
  };

  // Filter crops
  const filteredCrops = filter === 'all' 
    ? crops 
    : crops.filter(crop => crop.status === filter);

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusStyles = {
      planted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      growing: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      harvested: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    };
    
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || ""}`;
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <SeedlingIcon className="mr-2 h-6 w-6 text-primary" />
          Crop Tracker
        </h2>
        
        <div className="flex mt-4 sm:mt-0 space-x-3">
          <div className="relative">
            <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="input py-1.5 pl-9 pr-4 text-sm appearance-none cursor-pointer"
              style={{ minWidth: '140px' }}
            >
              <option value="all">All Crops</option>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="harvested">Harvested</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <FilterIcon className="h-4 w-4 text-surface-500" />
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingCrop(true)}
            className="btn btn-primary flex items-center"
            disabled={isAddingCrop}
          >
            <PlusIcon className="mr-1.5 h-4 w-4" />
            <span>Add Crop</span>
          </motion.button>
        </div>
      </div>

      {/* Add/Edit Crop Form */}
      <AnimatePresence>
        {isAddingCrop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {editingCropId ? 'Edit Crop' : 'Add New Crop'}
                </h3>
                <button onClick={handleCancelForm} className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="label">Crop Name</label>
                    <div className="relative">
                      <SeedlingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`input pl-10 ${formErrors.name ? 'border-red-500 dark:border-red-700' : ''}`}
                        placeholder="e.g., Corn"
                      />
                    </div>
                    {formErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="variety" className="label">Variety (Optional)</label>
                    <input
                      type="text"
                      id="variety"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., Sweet Corn"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="label">Field Location</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`input pl-10 ${formErrors.location ? 'border-red-500 dark:border-red-700' : ''}`}
                      placeholder="e.g., North Field"
                    />
                  </div>
                  {formErrors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.location}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="plantingDate" className="label">Planting Date</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                      <input
                        type="date"
                        id="plantingDate"
                        name="plantingDate"
                        value={formData.plantingDate}
                        onChange={handleInputChange}
                        className={`input pl-10 ${formErrors.plantingDate ? 'border-red-500 dark:border-red-700' : ''}`}
                      />
                    </div>
                    {formErrors.plantingDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.plantingDate}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="harvestDate" className="label">Expected Harvest Date (Optional)</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                      <input
                        type="date"
                        id="harvestDate"
                        name="harvestDate"
                        value={formData.harvestDate}
                        onChange={handleInputChange}
                        className="input pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="label">Crop Status</label>
                  <div className="relative">
                    <InfoIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input pl-10 appearance-none cursor-pointer"
                    >
                      <option value="planted">Planted</option>
                      <option value="growing">Growing</option>
                      <option value="harvested">Harvested</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <MoveIcon className="h-4 w-4 text-surface-500" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancelForm}
                    className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn btn-primary"
                  >
                    <CheckIcon className="mr-1.5 h-4 w-4" />
                    {editingCropId ? 'Update Crop' : 'Save Crop'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crops List */}
      <div className="space-y-4">
        {filteredCrops.length === 0 ? (
          <div className="text-center py-12 bg-surface-100/50 dark:bg-surface-800/50 rounded-xl border border-dashed border-surface-300 dark:border-surface-700">
            <SeedlingIcon className="mx-auto h-12 w-12 text-surface-400 dark:text-surface-600 mb-3" />
            <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-1">No crops found</h3>
            <p className="text-surface-500 dark:text-surface-400">
              {filter === 'all' 
                ? "Start by adding your first crop"
                : `No ${filter} crops currently tracked`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-100 dark:bg-surface-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Crop
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">
                    Planted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">
                    Harvest
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                {filteredCrops.map(crop => (
                  <motion.tr 
                    key={crop.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{crop.name}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">{crop.location}</div>
                      {crop.variety && (
                        <div className="text-xs text-surface-500 dark:text-surface-400">{crop.variety}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300 hidden md:table-cell">
                      {crop.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300 hidden lg:table-cell">
                      {crop.plantingDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300 hidden lg:table-cell">
                      {crop.harvestDate || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(crop.status)}>
                        {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEditCrop(crop)} 
                          className="text-primary hover:text-primary-dark"
                          aria-label="Edit crop"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCrop(crop.id)} 
                          className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                          aria-label="Delete crop"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default MainFeature;