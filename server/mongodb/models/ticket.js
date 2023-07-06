import mongoose from "mongoose"

/**
 * Ticketing policy:
 * DayPass: 24-hour pass starting at purchased time and ending after 24 hours
 * MonthPass: 30-day pass starting at purchased time and ending after 30 days
 * YearPass: 365-day pass starting at purchased time and ending after 365 days
 * 
 * SingleUsePass: 
 *  - 2-hour pass starting at first use time and ending after 2 hours
 *  - Unused tickets are valid up to 1 year after purchase
 *  - Upon use, expiration date is reset to be 2 hours after use time
 */


const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    datePurchased: {
        type: Date,
        required: true,
        default: Date.now()
    },
    expirationDate: {
        type: Date,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    isSingleUsePass: {
        type: Boolean,
        required: true,
        default: false
    },
    isDayPass: {
        type: Boolean,
        required: true,
        default: false
    },
    isMonthPass: {
        type: Boolean,
        required: true,
        default: false
    },
    isYearPass: {
        type: Boolean,
        required: true,
        default: false
    }
})

export default mongoose.models?.Ticket || mongoose.model("Ticket", ticketSchema)