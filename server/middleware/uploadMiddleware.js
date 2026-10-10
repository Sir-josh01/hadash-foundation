import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Custom storage engine for multer using Cloudinary stream
class CloudinaryCustomStorage {
    _handleFile(req, file, cb) {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'hadash_outreaches',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
            },
            (error, result) => {
                if (error) return cb(error);
                cb(null, {
                    path: result.secure_url,
                    filename: result.public_id,
                    size: result.bytes
                });
            }
        );

        file.stream.pipe(uploadStream);
    }

    _removeFile(req, file, cb) {
        cb(null);
    }
}

const storage = new CloudinaryCustomStorage();
const upload = multer({ storage });

export default upload;