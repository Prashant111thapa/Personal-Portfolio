import { v2 as cloudinaryOriginal } from 'cloudinary';


const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
};

const cloudinary = cloudinaryOriginal;

cloudinary.config(cloudinaryConfig);

export const CLOUDINARY_SETTINGS = {
    folders: {
        profile: `${process.env.CLOUDINARY_FOLDER}/profile`,
        resume: `${process.env.CLOUDINARY_FOLDER}/resume`,
        projectBanner: `${process.env.CLOUDINARY_FOLDER}/project`,
    },
    allowedFormat: {
        profile: ['jpeg', 'jpg', 'png', 'webp'],
        resume: ['pdf'],
        projectBanner: ['jpeg', 'jpg', 'png', 'webp'],
    }, 
    maxFileSize: {
        profile: 5 * 1024 * 1024, // 5MB
        resume: 5 * 1024 * 1024, // 5 MB
        projectBanner: 2  * 1024 * 1024, // 2 MB
    },
    resourceType: {
        resumes: 'raw',
        images: 'image',
        auto: 'auto'
    }
};

export const testCloudinaryConnection = async () => {
    try {
        const test = await cloudinary.api.ping();
        console.log("Cloudinary is running");
        return test.result === 'ok'
    } catch(err) {
        console.log("Error connecting to cloudinary");
        return false;
    }
};

export default cloudinary;