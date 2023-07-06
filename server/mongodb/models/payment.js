import mongoose from "mongoose"


const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    nameOnCard: {
        type: String,
        required: true
    },
    billingAddress: {
        type: String,
        required: true
    },
    cardNumber: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    securityCode: {
        type: Number,
        required: true
    }
})

export default mongoose.models?.Payment || mongoose.model("Payment", paymentSchema)