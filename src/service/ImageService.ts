import cloudinary from 'cloudinary';
// eslint-disable-next-line no-unused-vars
import { types } from '@app/common';
import logger from '@app/logger';
import config from '@app/config';
import { ConfigurationError } from '@app/common/error';

export enum ImageType {
  // eslint-disable-next-line no-unused-vars
  AVATAR,
}

export interface ImageTypeFolders extends Record<ImageType, string[]> {
  [ImageType.AVATAR]: ['user/avatar', 'puppy/avatar'];
}

export const ImageTypeOptions: Record<ImageType, cloudinary.UploadApiOptions> = {
  [ImageType.AVATAR]: {
    width: 512,
    height: 512,
    crop: 'fill',
    quality: 'auto',
  },
};

export interface ImageOptions<T extends ImageType> {
  type: T;
  folder: types.UTIL.ValueOf<ImageTypeFolders[T]>;
  uploadOptions?: cloudinary.UploadApiOptions;
}

export default class ImageService {
  private static options: cloudinary.UploadApiOptions;

  private static configured: boolean = false;

  public static configure(): void {
    if (this.configured) return;

    cloudinary.v2.config({
      cloud_name: config.SERVICE.IMAGE.CLOUD,
      api_key: config.SERVICE.IMAGE.KEY,
      api_secret: config.SERVICE.IMAGE.SECRET,
    });

    this.options = {
      resource_type: 'image',
      format: 'png',
      unique_filename: true,
      discard_original_filename: true,
      folder: `happypuppy/upload/`,
    };

    this.configured = true;

    logger.info('Image service configured');
  }

  public static upload<T extends ImageType>(
    image: Express.Multer.File,
    options: ImageOptions<T>
  ): Promise<cloudinary.UploadApiResponse> {
    if (!this.configured) throw new ConfigurationError('Image Service is not configured');

    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(this.transformOptions(options), (err, result) => {
          if (err) {
            logger.error(`Error uploading image due to ${err.message}`);
            reject(err);
          } else {
            logger.info(`Uploaded image ${JSON.stringify(result)}`);
            resolve(result);
          }
        })
        .end(image.buffer);
    });
  }

  private static transformOptions<T extends ImageType>(
    options: ImageOptions<T>
  ): cloudinary.UploadApiOptions {
    // Construct correct folder options object
    const folder: cloudinary.UploadApiOptions = {
      folder: (this.options.folder as string) + (options.folder as string),
    };

    // Delete possibly forced options
    Object.keys({ ...this.options, ...ImageTypeOptions[options.type] }).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      if (options?.uploadOptions && options.uploadOptions[key]) delete options.uploadOptions[key];
    });

    // Add correct folder to upload options
    // eslint-disable-next-line no-param-reassign
    options.uploadOptions =
      options.uploadOptions !== undefined ? Object.assign(options.uploadOptions, folder) : folder;

    return { ...this.options, ...ImageTypeOptions[options.type], ...options.uploadOptions };
  }
}
