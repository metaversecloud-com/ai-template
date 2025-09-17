/**
 * Utility functions for formatting currency and dates
 */

// Format coin amounts with appropriate styling
export const formatCurrency = (amount: number): string => {
  return `${amount} coins`;
};

// Format date and time for display
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format plant information for display
export const formatPlantInfo = (seedId: number, growthLevel: number, seedName?: string): string => {
  return `${seedName || `Seed #${seedId}`} (${growthLevel}/10)`;
};
