import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const createUploadMiddleware = (options) => {
//     const {
//         uploadType,
//         allowedTypes,
//         maxSize,
//         filePrefix
//     } = options;

//     const uploadDir = path.join(__dirname, `../uploads/${uploadType}`);

//     if(!fs.existsSync(uploadDir)){
//         fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const storage = multer.diskStorage({
//         destination: (_req, _file, cb) => {
//             cb(null, uploadDir);
//         },
//         filename: (_req, file, cb) => {
//             const uniqueSuffix = Math.round(Math.random() * 1E9);
//             const extensions = path.extname(file.originalname);
//             const filename = `${filePrefix}-${uniqueSuffix}${extensions}`;
//             cb(null, filename);
//         }
//     });

//     const fileFilter = (req, file, cb) => {
//         if(allowedTypes.includes(file.mimetype)){
//             cb(null, true);
//         } else {
//             const allowedTypesStr = allowedTypes.join(", ");
//             cb(new Error(`Only ${allowedTypesStr} files are allowed.`), false);
//         }
//     }

//     return multer({
//         storage,
//         fileFilter,
//         limits: {
//             fileSize: maxSize
//         }
//     });
// }

// export const createErrorHandler = (maxSize, fileType) => {
//     return (err, _req, res, next) => {
//         if(err instanceof multer.MulterError) {
//             if(err.code === "LIMIT_FILE_SIZE") {
//                 return res.status(400).json({
//                     success: false,
//                     message: `File size too large. Maximum size is ${maxSize}MB`
//                 });
//             }
//             return res.status(400).json({
//                 success: false,
//                 message: `${fileType} upload error`
//             });
//         }
//         if(err) {
//             return res.status(400).json({
//                 success: false,
//                 message: err.message
//             });
//         }
//         next();
//     }
// }

// export const uploadProfileAvatar = createUploadMiddleware({
//     uploadType: 'profile',
//     allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
//     maxSize: 5 * 1024 * 1024,
//     filePrefix: 'profile'
// });

// export const uploadProjectBanner = createUploadMiddleware({
//     uploadType: 'project',
//     allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
//     maxSize: 5 * 1024 * 1024,
//     filePrefix: 'banner'
// });

// export const uploadResume = createUploadMiddleware({
//     uploadType: 'resume',
//     allowedTypes: ['application/pdf'],
//     maxSize: 6 * 1024 * 1024,
//     filePrefix: 'resume'
// });

// export const handleProfileError = createErrorHandler(5, 'profile');
// export const handleProjectError = createErrorHandler(5, 'project');
// export const handleResumeError = createErrorHandler(6, 'resume');

const ALLOWED_MIMETYPE = {
    resume: [
        'application/pdf',
    ], 
    profile: [
        'image/jpeg',
        'image/jpg',
        'image/png',
    ],
    project: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ]
};

const ALLOWED_FORMATS = {
    resume: ['pdf'],
    profile: ['jpeg', 'jpg', 'png'],
    project: ['jpeg', 'jpg', 'png', 'webp'],
}

const ALLOWED_SIZES = {
    resume: 5 * 1024 * 1024, // 5 MB
    profile: 5 * 1024 * 1024, // 5MB
    project: 2  * 1024 * 1024, // 2 MB 
}

const memoryStorage = multer.memoryStorage();

export const createFileFilter = (category) => {
    return (req, file, callback) => {
        console.log("req file", req.file);
        const allowedMimetype = ALLOWED_MIMETYPE[category];
        const allowedExtension = ALLOWED_FORMATS[category];
        if(!allowedMimetype || !allowedExtension) {
            return callback(new Error('Invalid upload category'));
        }

        if(!allowedMimetype.includes(file.mimetype)) {
            return callback(new Error(`Invalid file type. Allowed types ${allowedMimetype.join(', ')}`));
        }

        const parts = (file.originalname || '').split('.');
        const fileExtension = parts.length > 1 ? parts.pop().toLowerCase() : "";
        if(!fileExtension || !allowedExtension.includes(fileExtension)) {
            return callback(new Error(`Invalid file extension. Allowed extensions ${allowedExtension.join(', ')}`));
        }
        callback(null, true);
    }
};

const uploadProfile = multer({
    storage: memoryStorage,
    fileFilter: createFileFilter('profile'),
    limits: {
        fileSize: ALLOWED_SIZES['profile'],
        files: 1
    }
});

const uploadProject = multer({
    storage: memoryStorage,
    fileFilter: createFileFilter('project'),
    limits: {
        fileSize: ALLOWED_SIZES['project'],
        files: 1
    }
});

const uploadResume= multer({
    storage: memoryStorage,
    fileFilter: createFileFilter('resume'),
    limits: {
        fileSize: ALLOWED_SIZES['resume'],
        files: 1
    }
});

// Accept common field names for profile uploads (handles Postman/frontends using different names)
export const uploadProfileImage = uploadProfile.fields([
    { name: 'file', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]);
export const uploadProjectBanner = uploadProject.single('banner');
// Accept either `file` or `resume` for resume uploads
export const uploadResumeFile = uploadResume.fields([
    { name: 'file', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);
console.log(uploadResumeFile);

export const handleMulterError = (
    err,
    req,
    res,
    next
) => {
    if(err instanceof multer.MulterError) {
        switch(err.code) {
            case "LIMIT_FILE_SIZE":
                console.log("limit file size reached");
                return res.status(400).json({
                    message: err.message || "File too large",
                    success: false
                });
                case "LIMIT_FIELD_COUNT":
                    console.log("limit field count handle multer error");
                    return res.status(400).json({
                        message: err.message || "Too many files",
                        success: false
                    });
                    case "LIMIT_UNEXPECTED_FILE":
                console.log("errror; ", err.field);
                // console.log("file", req);
                console.log("unexpected file field in hanlde multer error. ");
                return res.status(400).json({
                    message: err.message || "Unexpected file field",
                    success: false
                });
            default: 
                return res.status(400).json({ message: err.message || 'Failed to upload file', success: false });
        };
    } else if(err) {
        console.log("Error in handle multer error", err);
        return res.status(400).json({
            message: "Unexpected error occurred",
            success: false
        });
    } else {
        next();
    }
}