import fs from 'fs';
import { v2 } from 'cloudinary';
import { config } from '@/utils/config';
v2.config({
    cloud_name: config.cloudName,
    api_key: config.cloudApiKey,
    api_secret: config.cloudApiSecret,
    secure: true,
});
export default v2;
export const removeTmpFiles = (path: string) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};
