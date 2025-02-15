import { z } from 'zod';
import { pageInfo } from '../schema';

export interface PostBlogReqBody {
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  displayDate: string;
  tagList: number[];
}

export interface PatchBlogReqBody {
  id: number;
  title?: string;
  category?: string;
  thumbnail?: string;
  description?: string;
  content?: string;
  ctaLink?: string;
  ctaText?: string;
  displayDate?: string;
  isDisplayed?: boolean;
  tagList?: number[];
}

export type TagDetail = z.infer<typeof tagDetailInfos>[0];
export type PostTag = z.infer<typeof postTagSchema>;
export type BlogThumbnail = z.infer<typeof blogThumbnailInfo>;
export type BlogRating = z.infer<typeof blogRatingSchema>['ratingInfos'][0];

export const blogThumbnailInfo = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  displayDate: z.string().nullable().optional(),
  isDisplayed: z.boolean().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export const blogDetailInfo = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  isDisplayed: z.boolean().nullable().optional(),
  ctaLink: z.string().nullable().optional(),
  ctaText: z.string().nullable().optional(),
  displayDate: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export const tagSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});
export type TagType = z.infer<typeof tagSchema>;

export const tagDetailInfos = z.array(tagSchema);

export const postTagSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
});

export const blogSchema = z.object({
  blogDetailInfo,
  tagDetailInfos,
});

export type BlogSchema = z.infer<typeof blogSchema>;

export const blogInfoSchema = z.object({
  blogThumbnailInfo,
  tagDetailInfos,
});
export type BlogInfoSchema = z.infer<typeof blogInfoSchema>;

export const blogListSchema = z.object({
  blogInfos: z.array(blogInfoSchema),
  pageInfo,
});

export type BlogList = z.infer<typeof blogListSchema>;

export const blogTagSchema = z.object({
  tagDetailInfos,
});

export const ratingSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  score: z.number().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export const blogRatingSchema = z.object({
  ratingInfos: z.array(ratingSchema),
});

export const blogRatingListSchema = z.object({
  ratingInfos: z.array(
    ratingSchema.extend({ category: z.string().nullable().optional() }),
  ),
  pageInfo,
});
