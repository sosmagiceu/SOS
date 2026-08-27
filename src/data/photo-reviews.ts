export interface PhotoReview {
  /** Full URL of the framed review image (upload to the CDN alongside the other photos). */
  src: string;
  /** Describes what the photo shows — it is real content, not decoration. */
  alt: string;
  /** Optional line under the photo, e.g. the customer's name. */
  caption?: string;
}

/**
 * Framed photo / UGC reviews shown at the top of /reviews.
 * The section renders only once this list has entries.
 */
export const PHOTO_REVIEWS: PhotoReview[] = [];
