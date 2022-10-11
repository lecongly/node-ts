import cloudinary, { removeTmpFiles } from '@/utils/cloudinary';

class ImageService {
    public async upload(tempFilePath: string) {
        try {
            const result = await cloudinary.uploader.upload(
                tempFilePath,
                { folder: 'image' },
                (err: any, result: any) => {
                    if (err) throw err;
                    removeTmpFiles(tempFilePath);
                    return result;
                }
            );
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async remove(public_id: string) {
        try {
            const result = await cloudinary.uploader.destroy(
                public_id,
                async (err: any) => {
                    if (err) throw err;
                }
            );
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default ImageService;
