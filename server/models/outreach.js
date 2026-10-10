import mongoose from 'mongoose';

const outreachSchema = new mongoose.Schema({
    title: { type: String, required: true },
    schoolName: { type: String, required: true },
    location: { type: String, default: 'Abuja, Nigeria' },
    category: { type: String, enum: ['school', 'skills', 'relief'], default: 'school' },
    summary: { type: String, required: true },
    story: { type: String, required: true },
    studentsImpacted: { type: Number, default: 0 },
    images: [{ type: String }],
    eventDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Outreach', outreachSchema);