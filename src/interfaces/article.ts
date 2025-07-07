export interface Article {
  id: number;
  title: string;
  description?: string;
  url: string;
  published_at: string;
  source: string;
  category?: string;
  image_url?: string;
  like_count?: number;
  dislike_count?: number;
}
