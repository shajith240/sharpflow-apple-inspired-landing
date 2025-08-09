# Cal.com Integration Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Your Cal.com Account
1. Go to [cal.com](https://cal.com) and sign up for a free account
2. Choose a username (this will be part of your booking URL)
3. Connect your Google Calendar or preferred calendar

### 2. Create Your Event Type
1. In your Cal.com dashboard, click "Event Types"
2. Click "New Event Type"
3. Set up your consultation:
   - **Name**: "Free Consultation" or "Strategy Call"
   - **Duration**: 30 minutes (recommended)
   - **Description**: "Let's discuss your voice AI project requirements"
   - **Location**: Google Meet, Zoom, or Phone call
   - **Availability**: Set your preferred hours

### 3. Configure Your Booking Link
1. After creating the event type, note your booking URL
2. It will look like: `https://cal.com/your-username/consultation`

### 4. Update Your Website Configuration
1. Open `src/config/cal.ts`
2. Replace the placeholder values:

```typescript
export const CAL_CONFIG = {
  username: "your-actual-username", // Replace with your Cal.com username
  eventType: "consultation", // Replace with your event type slug
  
  // Example: If your link is https://cal.com/sharpflow/consultation
  // username: "sharpflow"
  // eventType: "consultation"
}
```

### 5. Test Your Integration
1. Save the changes and restart your development server
2. Click any "Book Consultation" button on your website
3. It will open your Cal.com booking page in a new tab

## 🎨 Customization Options

### Cal.com Page Customization
You can customize your Cal.com booking page directly in your Cal.com dashboard:
- **Branding**: Add your logo and brand colors
- **Custom Questions**: Add intake forms to qualify leads
- **Availability**: Set specific hours and buffer times
- **Locations**: Configure meeting types (Zoom, Google Meet, Phone, etc.)

## 📧 Email Notifications
Cal.com automatically sends:
- Confirmation emails to both you and the client
- Reminder emails before the meeting
- Calendar invites with meeting links

## 🔗 Your Booking URLs
Once set up, your booking will be available at:
- **Direct link**: `https://cal.com/your-username/consultation`
- **From your website**: All booking buttons redirect to your Cal.com page

## 🆘 Troubleshooting

### Buttons Not Working?
1. Check your `calLink` in the config file (`src/config/cal.ts`)
2. Make sure your Cal.com event type is published and active
3. Test the direct Cal.com URL first

### Wrong URL Opening?
Verify the `username` and `eventType` in your config file match your actual Cal.com setup.

### Need Help?
- Cal.com has excellent documentation at [docs.cal.com](https://docs.cal.com)
- Check their community forum for common issues

## 🎯 Pro Tips
1. **Set Buffer Times**: Add 5-10 minutes between meetings
2. **Use Intake Forms**: Add custom questions to qualify leads
3. **Set Limits**: Limit daily bookings to manage your schedule
4. **Add Team Members**: Upgrade to team features if needed

## 🔄 Next Steps
1. Set up your Cal.com account
2. Update the config file with your details
3. Test the booking flow
4. Customize the event type settings
5. Go live! 🚀

---

**Need assistance?** The booking system is now fully integrated and ready to use once you complete the Cal.com setup!