// Cal.com Configuration
// Replace these values with your actual Cal.com settings

export const CAL_CONFIG = {
  // Your Cal.com username (the part after cal.com/)
  username: "shajith", // Your actual Cal.com username
  
  // Your event type slug (the part after your username)
  eventType: "sharpflow-consultation", // Your actual event type slug
  
  // Full Cal.com link
  get fullLink() {
    return `${this.username}/${this.eventType}`
  },
  
  // Event settings
  eventSettings: {
    duration: 30, // minutes
    title: "Free Consultation Call",
    description: "Let's discuss your voice AI project requirements and how SharpFlow can help transform your customer experience.",
  }
}

// Example: If your Cal.com link is https://cal.com/sharpflow/consultation
// Then set:
// username: "sharpflow"
// eventType: "consultation"