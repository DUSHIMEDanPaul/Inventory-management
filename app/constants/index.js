// Categories for inventory items
export const CATEGORIES = [
  { value: 'electronics', label: 'Electronics', icon: 'PhoneIphone' },
  { value: 'clothing', label: 'Clothing', icon: 'Checkroom' },
  { value: 'food', label: 'Food & Beverages', icon: 'Restaurant' },
  { value: 'books', label: 'Books & Media', icon: 'Book' },
  { value: 'health', label: 'Health & Beauty', icon: 'LocalPharmacy' },
  { value: 'home', label: 'Home & Garden', icon: 'Home' },
  { value: 'sports', label: 'Sports & Outdoors', icon: 'FitnessCenter' },
  { value: 'automotive', label: 'Automotive', icon: 'DirectionsCar' },
  { value: 'office', label: 'Office Supplies', icon: 'Work' },
  { value: 'other', label: 'Other', icon: 'Category' },
];

// Default values
export const DEFAULT_LOW_STOCK_THRESHOLD = 5;
export const DEFAULT_CATEGORY = 'other';

// Export options
export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV File' },
  { value: 'json', label: 'JSON File' },
];

// Search and filter options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'quantity', label: 'Quantity (Low to High)' },
  { value: 'quantity_desc', label: 'Quantity (High to Low)' },
  { value: 'price', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'created', label: 'Recently Added' },
];

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  ADD_ITEM: { key: 'n', ctrlKey: true, description: 'Add new item' },
  SEARCH: { key: 'k', ctrlKey: true, description: 'Search items' },
  EXPORT: { key: 'e', ctrlKey: true, description: 'Export data' },
  TOGGLE_THEME: { key: 't', ctrlKey: true, description: 'Toggle theme' },
};