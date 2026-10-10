import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import connectDB from './config/database.js';
import protect from './middleware/authMiddleware.js';
import upload from './middleware/uploadMiddleware.js';

import Outreach from './models/outreach.js';
import Volunteer from './models/volunteer.js';
import Admin from './models/admin.js';

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('../client'));

// Auth Route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin && (await admin.matchPassword(password))) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public Outreach API
app.get('/api/outreaches', async (req, res) => {
    try {
        const outreaches = await Outreach.find().sort({ eventDate: -1 });
        res.json(outreaches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Outreach Creation API (Protected + Photo Upload)
app.post('/api/outreaches', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { title, schoolName, location, category, summary, story, studentsImpacted, eventDate } = req.body;
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const newOutreach = new Outreach({
            title,
            schoolName,
            location,
            category,
            summary,
            story,
            studentsImpacted,
            eventDate,
            images: imageUrls
        });

        await newOutreach.save();
        res.status(201).json({ success: true, message: 'School visit report published!', data: newOutreach });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete Outreach Post
app.delete('/api/outreaches/:id', protect, async (req, res) => {
    try {
        await Outreach.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Outreach post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public Volunteer Registration API
app.post('/api/volunteers', async (req, res) => {
    try {
        const { fullName, phone, skillArea } = req.body;
        const volunteer = new Volunteer({ fullName, phone, skillArea });
        await volunteer.save();
        res.status(201).json({ success: true, message: 'Volunteer application submitted successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin Get Volunteers API
app.get('/api/volunteers', protect, async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ createdAt: -1 });
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Hadash Foundation backend running with ES Modules on port ${PORT}`));


