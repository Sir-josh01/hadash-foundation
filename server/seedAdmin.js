import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/admin.js';
import connectDB from './config/database.js';

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        await Admin.deleteMany(); // Clears any previous test admins
        const admin = new Admin({
            email: 'admin@hadashempowerment.org',
            password: 'adminPassword123'
        });
        await admin.save();
        console.log('Admin user created successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();