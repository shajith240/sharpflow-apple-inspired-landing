"use client"

import * as React from "react"

interface BookingDialogProps {
    children: React.ReactNode
    calLink?: string // Your cal.com link (e.g., "your-username/consultation")
}

export function BookingDialog({
    children,
    calLink = "your-username/consultation" // Replace with your actual Cal.com link
}: BookingDialogProps) {
    const handleBookingClick = () => {
        // Redirect directly to Cal.com in a new tab
        const calcomUrl = `https://cal.com/${calLink}`
        window.open(calcomUrl, '_blank')
    }

    return (
        <div onClick={handleBookingClick} className="cursor-pointer">
            {children}
        </div>
    )
}