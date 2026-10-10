import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    skillArea: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Contacted', 'Active'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Volunteer', volunteerSchema);