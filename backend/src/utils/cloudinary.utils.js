import cloudinary, { CLOUDINARY_SETTINGS } from "../config/cloudinary.config.js";

export const UploadToCloudinary = async (
    fileBuffer,
    originalFileName,
    options,
) => {
    const {
        filename, 
        maxFileSize,
        resourceType,
        folder,
        allowedFormats
    } = options;

    if(maxFileSize && fileBuffer.length > maxFileSize) {
        throw new Error("File size too large");
    };

    const fileExtension = getFileExtension(originalFileName || filename);
    if(allowedFormats && allowedFormats.length > 0) {
        if(!allowedFormats.includes(fileExtension)){
            throw new Error(`Valid file is required. Valid: ${allowedFormats.join(',')}`);
        }
    }

    const mimeType = getMimeType(filename);
    const base64String = fileBuffer.toString('base64');
    const dataURI = `data:${mimeType};base64,${base64String}`;

    const publicId = generatePublicId(originalFileName || filename);

    try {
        const result = await cloudinary.uploader.upload(dataURI, {
            folder,
            public_id: publicId,
            resource_type: resourceType,
            overwrite: false
        });

        return {
            public_id: result.public_id,
            file_url: result.secure_url,
            file_name: originalFileName,
            file_size: result.bytes,
            format: result.format,
            resourceType: result.resource_type,
        };
    } catch (err) {
        console.error("Error uploading to cloudinary", err);
        throw new Error("Error uploading to cloudinary");
    }
};

export const uploadProfile = (file_buffer, file_name) => {
    return UploadToCloudinary(file_buffer, file_name, {
        file_name,
        folder: CLOUDINARY_SETTINGS.folders.profile,
        allowedFormats: CLOUDINARY_SETTINGS.allowedFormat.profile,
        maxFileSize: CLOUDINARY_SETTINGS.maxFileSize.profile,
        resourceType: CLOUDINARY_SETTINGS.resourceType.images,
    });
};

export const uploadResumeFile = (file_buffer, file_name) => {
    return UploadToCloudinary(file_buffer, file_name, {
        file_name,
        folder: CLOUDINARY_SETTINGS.folders.resume,
        allowedFormats: CLOUDINARY_SETTINGS.allowedFormat.resume,
        maxFileSize: CLOUDINARY_SETTINGS.maxFileSize.resume,
        resourceType: CLOUDINARY_SETTINGS.resourceType.resumes,
    });
};

export const uploadProjectBanner = (file_buffer, file_name) => {
    console.log("Inside upload project banner");
    return UploadToCloudinary(file_buffer, file_name, {
        file_name,
        folder: CLOUDINARY_SETTINGS.folders.projectBanner,
        allowedFormats: CLOUDINARY_SETTINGS.allowedFormat.projectBanner,
        maxFileSize: CLOUDINARY_SETTINGS.maxFileSize.projectBanner,
        resourceType: CLOUDINARY_SETTINGS.resourceType.images,
    });
};

export const deleteFromCloudinay = async (
    file_public_id, 
    resource_type
) => {
    if(!file_public_id) {
        console.warn("Public id is required to delete file");
        return false;
    }

    try {
        let result = await cloudinary.uploader.destroy(file_public_id, {
            resource_type, 
            invalidate: true // invaldiate caches
        });

        if(result.result === 'ok') return true;

        if(resource_type === 'raw' && result.result === 'not found') {
            result = await cloudinary.uploader.destroy(file_public_id, {
                resource_type: 'image',
                invalidate: true
            });
            if(result.result === 'ok') return true;
        }

        if(result.result === 'not found') {
            console.warn("File not found");
            return true;
        } 
        console.warn("Failed to delete from cloudinary");
        return false;
    } catch (err) {
        console.warn("Error deleting file", err);
        return false;
    }    
}

export const deleteProfile = (file_public_id) => {
    return deleteFromCloudinay(file_public_id, 'image');
}

export const deleteProjectBanner = (file_public_id) => {
    return deleteFromCloudinay(file_public_id, 'image');
}

export const deleteResumeFile = (file_public_id) => {
    return deleteFromCloudinay(file_public_id, 'raw');
}

export const getFileExtension = (filename) => {
    const extensions = (filename || "").split('.');
    return extensions.length > 1 ? extensions.pop().toLowerCase() : '';
};

export const generatePublicId = (fileName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExtension
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);

    return `${sanitizedName}-${timestamp}-${randomString}`;
};

const getMimeType = (fileName) => {
    const exe = getFileExtension(fileName);
    const mimeTypes = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
    };
    return mimeTypes[exe] || 'application/octet-stram';
}