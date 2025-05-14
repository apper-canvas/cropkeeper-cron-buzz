import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

function CropsPage() {
  const HomeIcon = getIcon('Home');
  const SeedlingIcon = getIcon('Seedling');
  const SproutIcon = getIcon('Sprout');
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
  const SearchIcon = getIcon('Search');
  
  // State for crops
  const [crops, setCrops] = useState(() => {
    const savedCrops = localStorage.getItem('crops');
    return savedCrops ? JSON.parse(savedCrops) : [
      { id: 1, name: "Corn", variety: "Sweet Corn", farmId: 1, farmName: "Green Valley Farm", location: "Field A", plantingDate: "2023-04-15", harvestDate: "2023-08-20", status: "growing" },
      { id: 2, name: "Tomatoes", variety: "Roma", farmId: 1, farmName: "Green Valley Farm", location: "Greenhouse 1", plantingDate: "2023-05-01", harvestDate: "2023-07-15", status: "harvested" },
      { id: 3, name: "Wheat", variety: "Hard Red", farmId: 2, farmName: "Riverside Fields", location: "North Field", plantingDate: "2023-03-10", harvestDate: "2023-07-30", status: "growing" },
      { id: 4, name: "Soybeans", variety: "Round-up Ready", farmId: 2, farmName: "Riverside Fields", location: "East Field", plantingDate: "2023-05-20", harvestDate: "2023-09-15", status: "planted" }
    ];
  });
  
  // Get farms
  const [farms, setFarms] = useState(() => {
    const savedFarms = localStorage.getItem('farms');
    return savedFarms ? JSON.parse(savedFarms) : [
      { id: 1, name: "Green Valley Farm", location: "North County", size: "24 acres" },
      { id: 2, name: "Riverside Fields", location: "Eastern Plains", size: "16 acres" },
    ];
  });
  
  // Filters
  const [selectedFarm, setSelectedFarm] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  
  const initialFormState = {
    name: '',
    variety: '',
    farmId: '',
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
    
    // Update farmName if farmId changes
    if (name === 'farmId' && value) {
      const selectedFarm = farms.find(farm => farm.id === parseInt(value));
      if (selectedFarm) {
        setFormData(prev => ({ ...prev, farmName: selectedFarm.name }));
      }
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Crop name is required";
    if (!formData.farmId) errors.farmId = "Farm is required";
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
    if (window.confirm("Are you sure you want to delete this crop?")) {
      setCrops(crops.filter(crop => crop.id !== id));
      toast.success("Crop deleted successfully!");
    }
  };
  
  // Cancel form
  const handleCancelForm = () => {
    setFormData(initialFormState);
    setIsAddingCrop(false);
    setEditingCropId(null);
    setFormErrors({});
  };
  
  // Filter crops
  const filteredCrops = crops.filter(crop => {
    // Filter by farm
    if (selectedFarm !== 'all' && crop.farmId !== parseInt(selectedFarm)) return false;
    
    // Filter by status
    if (statusFilter !== 'all' && crop.status !== statusFilter) return false;
    
    // Filter by search query
    if (searchQuery && !crop.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !crop.variety.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link to="/" className="text-white/80 hover:text-white mr-3">
              <HomeIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <SproutIcon className="mr-2 h-7 w-7" />
              Crops Management
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {/* Farm Filter */}
              <div className="relative">
                <select 
                  value={selectedFarm}
                  onChange={e => setSelectedFarm(e.target.value)}
                  className="input py-1.5 pl-9 pr-4 text-sm appearance-none cursor-pointer"
                  style={{ minWidth: '160px' }}
                >
                  <option value="all">All Farms</option>
                  {farms.map(farm => (
                    <option key={farm.id} value={farm.id}>{farm.name}</option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SeedlingIcon className="h-4 w-4 text-surface-500" />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="input py-1.5 pl-9 pr-4 text-sm appearance-none cursor-pointer"
                  style={{ minWidth: '140px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="harvested">Harvested</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FilterIcon className="h-4 w-4 text-surface-500" />
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input py-1.5 pl-9 pr-4 text-sm"
                  style={{ minWidth: '200px' }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-surface-500" />
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingCrop(true)}
              className="btn btn-primary flex items-center whitespace-nowrap"
              disabled={isAddingCrop}
            >
              <PlusIcon className="mr-1.5 h-4 w-4" />
              <span>Add New Crop</span>
            </motion.button>
          </div>
          
          {/* Crops Table */}
          <div className="bg-white dark:bg-surface-800 shadow-card rounded-xl overflow-hidden">
            <div className="p-4">
              {filteredCrops.length === 0 ? (
                <div className="text-center py-12">
                  <SeedlingIcon className="mx-auto h-12 w-12 text-surface-400 dark:text-surface-600 mb-3" />
                  <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-1">No crops found</h3>
                  <p className="text-surface-500 dark:text-surface-400">
                    {searchQuery ? "Try adjusting your search or filters" : 
                     (selectedFarm !== 'all' || statusFilter !== 'all') ? 
                     "Try changing your filter settings" : 
                     "Start by adding your first crop"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCrops.map(crop => (
                    <motion.div
                      key={crop.id}
                      whileHover={{ y: -3 }}
                      className="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden shadow-sm hover:shadow-card transition-all duration-200"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-surface-900 dark:text-surface-100">{crop.name}</h3>
                            {crop.variety && <p className="text-sm text-surface-500 dark:text-surface-400">{crop.variety}</p>}
                          </div>
                          <span className={getStatusBadge(crop.status)}>
                            {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-2 mt-3">
                          <div className="flex items-center text-sm">
                            <SeedlingIcon className="h-4 w-4 text-primary mr-2" />
                            <span className="text-surface-700 dark:text-surface-300">{crop.farmName}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <MapPinIcon className="h-4 w-4 text-secondary mr-2" />
                            <span className="text-surface-700 dark:text-surface-300">{crop.location}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 text-accent mr-2" />
                            <span className="text-surface-700 dark:text-surface-300">
                              Planted: {crop.plantingDate}
                              {crop.harvestDate && ` • Harvest: ${crop.harvestDate}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex border-t border-surface-200 dark:border-surface-700 divide-x divide-surface-200 dark:divide-surface-700">
                        <button
                          onClick={() => handleEditCrop(crop)}
                          className="flex-1 flex items-center justify-center py-2.5 text-sm font-medium text-primary hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                          <EditIcon className="h-4 w-4 mr-1.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCrop(crop.id)}
                          className="flex-1 flex items-center justify-center py-2.5 text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4 mr-1.5" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {filteredCrops.length > 0 && (
              <div className="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 text-sm text-surface-600 dark:text-surface-400">
                Showing {filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''}
                {selectedFarm !== 'all' && ` for ${farms.find(f => f.id === parseInt(selectedFarm))?.name || 'selected farm'}`}
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Crop Modal */}
      <AnimatePresence>
        {isAddingCrop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">
                    {editingCropId ? 'Edit Crop' : 'Add New Crop'}
                  </h3>
                  <button onClick={handleCancelForm} className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <label htmlFor="farmId" className="label">Farm</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                      <select
                        id="farmId"
                        name="farmId"
                        value={formData.farmId}
                        onChange={handleInputChange}
                        className={`input pl-10 appearance-none cursor-pointer ${formErrors.farmId ? 'border-red-500 dark:border-red-700' : ''}`}
                      >
                        <option value="">Select a farm</option>
                        {farms.map(farm => (
                          <option key={farm.id} value={farm.id}>{farm.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <MoveIcon className="h-4 w-4 text-surface-500" />
                      </div>
                    </div>
                    {formErrors.farmId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.farmId}</p>}
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
                </form>
              </div>
              
              {/* Sticky Footer with Action Buttons */}
              <div className="mt-auto border-t border-surface-200 dark:border-surface-700 p-4 bg-surface-50 dark:bg-surface-800 sticky bottom-0">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                  >
                    <CheckIcon className="mr-1.5 h-4 w-4" />
                      {editingCropId ? 'Update Crop' : 'Save Crop'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CropsPage;