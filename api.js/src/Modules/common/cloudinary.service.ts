import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import configuration from 'src/config/configuration';

@Injectable()
export class CloudinaryService {
  constructor() {
    console.log("CLOUDINAYR >>>" , configuration().cloudinary.apiKey)
    cloudinary.config({
      cloud_name: configuration().cloudinary.cloudName,
      api_key: configuration().cloudinary.apiKey,
      api_secret: configuration().cloudinary.apiSecret,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'skillswap-avatars',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }
} 