# Cal.com Integration Setup Guide

Your website is now configured to use Cal.com for consultation bookings! Follow these steps to complete the setup.

## 🚀 Quick Setup

### Step 1: Create Your Cal.com Account
1. Go to [cal.com/signup](https://cal.com/signup)
2. Sign up for a free account
3. Choose your username (this will be your booking URL)

### Step 2: Connect Your Calendar
1. In Cal.com, go to **Settings** → **Connected Calendars**
2. Connect your Google Calendar, Outlook, or other calendar service
3. This ensures real-time availability and prevents double bookings

### Step 3: Create Your Event Type
1. Go to **Event Types** in your Cal.com dashboard
2. Create a new event type with these settings:
   - **Name**: "Free Consultation"
   - **URL**: `consultation` (this creates `/consultation` endpoint)
   - **Duration**: 30 minutes (or your preferred length)
   - **Buffer Time**: 15 minutes before/after
   - **Location**: Google Meet, Zoom, or Phone
   - **Description**: Add details about what the consultation covers

### Step 4: Update Your Website Configuration
1. Open `src/config/booking.ts`
2. Replace `"your-username"` with your actual Cal.com username
3. Replace `"contact@sharpflow.com"` with your actual email

```typescript
export const BOOKING_CONFIG = {
  calcomUsername: "your-actual-username", // ← Update this
  contactEmail: "your-email@domain.com",  // ← Update this
  // ... rest of config
}
```

### Step 5: Test Your Booking System
1. Save your changes and restart your development server
2. Click any "Book Consultation" button on your website
3. It should open your Cal.com booking page in a new tab
4. Test the complete booking flow

## 📋 Your Booking URLs

After setup, your booking URLs will be:
- **Main booking**: `https://cal.com/your-username/consultation`
- **Direct link**: You can share this URL anywhere

## 🎨 Customization Options

### Cal.com Branding (Pro Feature)
- Remove Cal.com branding
- Custom colors and themes
- Custom domain (book.yourdomain.com)

### Event Type Customization
- Add custom questions for bookers
- Set up email notifications
- Configure booking confirmations
- Add payment integration (if needed)

### Advanced Features
- Team scheduling (if you have multiple consultants)
- Round-robin assignment
- Workflow automations
- Integration with CRM systems

## 🔧 Troubleshooting

### Booking Button Not Working?
1. Check that you updated the username in `src/config/booking.ts`
2. Ensure your Cal.com event type URL is `/consultation`
3. Make sure your event type is published (not draft)

### Calendar Not Syncing?
1. Check your calendar connection in Cal.com settings
2. Verify calendar permissions
3. Test by creating a test event in your calendar

### Bookings Not Appearing?
1. Check your Cal.com notification settings
2. Verify your email settings
3. Check spam folder for booking confirmations

## 💡 Pro Tips

1. **Set Buffer Times**: Add 15-minute buffers to avoid back-to-back meetings
2. **Custom Questions**: Ask relevant questions during booking (company size, budget, etc.)
3. **Confirmation Emails**: Customize your booking confirmation emails
4. **Availability**: Set your working hours and time zones correctly
5. **Backup Calendar**: Connect multiple calendars to avoid conflicts

## 🆘 Need Help?

- **Cal.com Documentation**: [docs.cal.com](https://docs.cal.com)
- **Cal.com Support**: Available in your dashboard
- **Community**: [github.com/calcom/cal.com](https://github.com/calcom/cal.com)

## 🎯 Next Steps

Once your booking system is working:
1. Add booking analytics tracking
2. Set up automated follow-up emails
3. Create different event types for different services
4. Consider upgrading to Cal.com Pro for advanced features

---

**Your consultation booking system is now ready! 🎉**

All "Book Consultation" buttons on your website will redirect to your Cal.com booking page, where clients can see your real-time availability and book directly into your calendar.