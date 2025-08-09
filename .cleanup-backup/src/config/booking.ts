// Cal.com Booking Configuration
// Update these values with your actual Cal.com details

export const BOOKING_CONFIG = {
  // Your Cal.com username (the part after cal.com/)
  calcomUsername: "your-username", // Replace with your actual username
  
  // Event types you've created in Cal.com
  eventTypes: {
    consultation: "consultation", // Free consultation call
    demo: "demo", // Product demo (if you create one)
    support: "support", // Support call (if you create one)
  },
  
  // Default event type for booking buttons
  defaultEventType: "consultation",
  
  // Contact email for the "Send Email" button
  contactEmail: "contact@sharpflow.com", // Replace with your actual email
} as const

// Helper function to generate Cal.com URL
export function getCalcomUrl(eventType: string = BOOKING_CONFIG.defaultEventType): string {
  return `https://cal.com/${BOOKING_CONFIG.calcomUsername}/${eventType}`
}

// Helper function to open Cal.com booking
export function openBooking(eventType: string = BOOKING_CONFIG.defaultEventType): void {
  const url = getCalcomUrl(eventType)
  window.open(url, '_blank')
}