import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path in storage (e.g., 'studio/images').
 * @param onProgress Optional callback for upload progress (0-100).
 * @returns Promise resolving to the public download URL.
 */
export const uploadFile = async (
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    if (!file) throw new Error("No file provided");

    // Create a unique filename to avoid overwrites
    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fullPath = `${path}/${uniqueName}`;

    const storageRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (err) {
                    console.error("Failed to get download URL:", err);
                    reject(err);
                }
            }
        );
    });
};
