import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/** Deletes a Cloudinary asset by public_id. Called when a product is removed. */
export async function deleteCloudinaryAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
}

/** Builds an optimized, responsive delivery URL: auto format + auto quality. */
export function optimizedUrl(publicId: string, width?: number) {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    width,
    crop: width ? "limit" : undefined,
    secure: true,
  });
}
