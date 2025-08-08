/**
 * Formats a number to 2 decimal places and removes trailing zeros
 * @param {number} value - The number to format
 * @returns {string} - Formatted number string without trailing zeros
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  const formatted = Number(value).toFixed(5);
  // Remove trailing zeros after decimal point
  return formatted.replace(/\.?0+$/, '');
};

/**
 * Formats a number to 2 decimal places and removes trailing zeros, with percentage support
 * @param {number} value - The number to format
 * @param {boolean} isPercentage - Whether to add % symbol
 * @returns {string} - Formatted number string without trailing zeros
 */
export const formatNumberWithPercentage = (value, isPercentage = false) => {
  const formatted = formatNumber(value);
  return isPercentage ? `${formatted}%` : formatted;
}; 