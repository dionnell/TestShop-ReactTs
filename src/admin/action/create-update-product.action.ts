import { testShopApi } from "@/api/testShopApi";
import type { Product, ProductImage } from "@/interface/product.interface";

export interface FileUploadResponse {
  secureUrl: string;
  publicId:  string;
}

/**
 * Upload one file to the backend → Cloudinary (testShop/<slug>/)
 * slug is passed as query param so Cloudinary organizes into the right subfolder
 */
const uploadFile = async (file: File, slug: string): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const { data } = await testShopApi<FileUploadResponse>({
      url:    `/files/product?slug=${encodeURIComponent(slug)}`,
      method: 'POST',
      data:   formData,
    });
    return data;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? error?.message ?? 'Upload failed';
    throw new Error(`Image upload failed: ${msg}`);
  }
};

/** Delete one image by its DB id — also removes from Cloudinary */
export const deleteProductImageAction = async (imageId: number): Promise<void> => {
  await testShopApi.delete(`/files/product/image/${imageId}`);
};

/** Save a new display order for a product's images */
export const reorderProductImagesAction = async (
  productId: string,
  orderedIds: number[],
): Promise<void> => {
  await testShopApi.patch(`/files/product/${productId}/reorder`, { orderedIds });
};

export const createUpdateProductAction = async (
  productLike: Partial<Product> & { files?: File[] },
): Promise<Product> => {
  const { id, user, images = [], files = [], ...rest } = productLike;

  const isCreating = id === 'new';

  rest.stock = Number(rest.stock || 0);
  rest.price = Number(rest.price || 0);

  // Use the slug for the Cloudinary folder; fallback to 'general'
  const slug = (rest.slug || 'general').trim().toLowerCase();

  // 1. Upload new local files to Cloudinary via backend (into testShop/<slug>/)
  const newUploads: ProductImage[] = [];
  if (files.length > 0) {
    const results = await Promise.all(files.map(f => uploadFile(f, slug)));
    results.forEach((r, i) => {
      newUploads.push({
        id:       0,
        url:      r.secureUrl,
        publicId: r.publicId,
        order:    images.length + i,
      });
    });
  }

  // 2. Merge existing images + new uploads
  const allImages = [...images, ...newUploads];

  // 3. Send to backend
  const { data } = await testShopApi<Product>({
    url:    isCreating ? '/products' : `/products/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      ...rest,
      images: allImages.map((img, index) => {
        const imagePayload: { url: string; order: number; publicId?: string } = {
          url:   img.url,
          order: index,
        };
        // Only include publicId if it's a real value — omit null/undefined
        if (img.publicId) imagePayload.publicId = img.publicId;
        return imagePayload;
      }),
    },
  });

  // 4. Normalize response
  return {
    ...data,
    images: (data.images as unknown as (ProductImage | string)[]).map((img, index) => {
      if (typeof img === 'string') {
        return { id: index, url: img, publicId: undefined, order: index };
      }
      return img;
    }),
  };
};
