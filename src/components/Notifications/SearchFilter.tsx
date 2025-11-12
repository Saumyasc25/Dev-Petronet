import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X, Calendar } from 'lucide-react';
interface FilterOptions {
  created_by: string;
  requestorNo: string;
  startDate: string;
  endDate: string;
  status: string;
}
interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  uniqueRequestorNames: string[];
  uniqueRequestorNos: string[];
  searchPlaceholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  uniqueRequestorNames,
  uniqueRequestorNos,
  searchPlaceholder = "Search here..."
}) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [dateRangeExpanded, setDateRangeExpanded] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);
  useEffect(() => {
    if (showFilters) {
      setTempFilters(filters);
    }
  }, [showFilters, filters]);

  const handleTempFilterChange = (key: keyof FilterOptions, value: string) => {
    setTempFilters({
      ...tempFilters,
      [key]: value
    });
  };

  const clearFilters = () => {
    const emptyFilters = {
      created_by: '',
      requestorNo: '',
      startDate: '',
      endDate: '',
      status: ''
    };
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setShowFilters(false);
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setShowFilters(false);
  };

  const closeModal = () => {
    setShowFilters(false);
    setDateRangeExpanded(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div className="w-full bg-white border-t border-b border-gray-200 p-1.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-80 sm:w-80 ml-5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:h-9 pl-10 pr-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 h-5 sm:h-9 mr-8 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden xs:inline">Filters</span>
          </button>

        </div>
      </div>
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white w-full sm:max-w-lg sm:rounded-lg shadow-xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl animate-slideUp sm:animate-none">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-5 bg-white">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-700">Filter Options</h2>
              <button
                onClick={closeModal}
                className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requestor Name
                  </label>
                  <div className="relative">
                    <select
                      value={tempFilters.created_by}
                      onChange={(e) => handleTempFilterChange('created_by', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none cursor-pointer text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="">Select Requestor Name</option>
                      {uniqueRequestorNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requestor No.
                  </label>
                  <div className="relative">
                    <select
                      value={tempFilters.requestorNo}
                      onChange={(e) => handleTempFilterChange('requestorNo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none cursor-pointer text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="">Select Requestor No.</option>
                      {uniqueRequestorNos.map((no) => (
                        <option key={no} value={no}>{no}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setDateRangeExpanded(!dateRangeExpanded)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-between hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="font-medium">Date Range</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${dateRangeExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {dateRangeExpanded && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={tempFilters.startDate}
                            onChange={(e) => handleTempFilterChange('startDate', e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer date-input"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={tempFilters.endDate}
                            onChange={(e) => handleTempFilterChange('endDate', e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer date-input"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={tempFilters.status}
                      onChange={(e) => handleTempFilterChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none cursor-pointer text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="waiting">Waiting</option>
                      <option value="approved">Approved</option>
                      <option value="changes">Changes</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 sm:p-5 bg-white">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={clearFilters}
                  className="order-2 sm:order-1 text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base transition-colors py-2 sm:py-0"
                >
                  Clear All
                </button>
                <div className="order-1 sm:order-2 flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Close
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
};

export default SearchFilter;