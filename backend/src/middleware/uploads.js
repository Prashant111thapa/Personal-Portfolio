import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createUploadMiddleware = (options) => {
    const {
        uploadType,
        allowedTypes,
        maxSize,
        filePrefix
    } = options;

    const uploadDir = path.join(__dirname, `../uploads/${uploadType}`);

    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const uniqueSuffix = Math.round(Math.random() * 1E9);
            const extensions = path.extname(file.originalname);
            const filename = `${filePrefix}-${uniqueSuffix}${extensions}`;
            cb(null, filename);
        }
    });

    const fileFilter = (req, file, cb) => {
        if(allowedTypes.includes(file.mimetype)){
            cb(null, true);
        } else {
            const allowedTypesStr = allowedTypes.join(", ");
            cb(new Error(`Only ${allowedTypesStr} files are allowed.`), false);
        }
    }

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize
        }
    });
}

export const createErrorHandler = (maxSize, fileType) => {
    return (err, _req, res, next) => {
        if(err instanceof multer.MulterError) {
            if(err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: `File size too large. Maximum size is ${maxSize}MB`
                });
            }
            return res.status(400).json({
                success: false,
                message: `${fileType} upload error`
            });
        }
        if(err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    }
}

export const uploadProfileAvatar = createUploadMiddleware({
    uploadType: 'profile',
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024,
    filePrefix: 'profile'
});

export const uploadProjectBanner = createUploadMiddleware({
    uploadType: 'project',
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024,
    filePrefix: 'banner'
});

export const uploadResume = createUploadMiddleware({
    uploadType: 'resume',
    allowedTypes: ['application/pdf'],
    maxSize: 6 * 1024 * 1024,
    filePrefix: 'resume'
});

export const handleProfileError = createErrorHandler(5, 'profile');
export const handleProjectError = createErrorHandler(5, 'project');
export const handleResumeError = createErrorHandler(6, 'resume');