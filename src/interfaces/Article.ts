export interface Article {
  id?: number;
  external_id: string;
  title: string;
  url: string;
  source: string;
  category?: string;
  published_at?: string;
  description?: string;
  categories?: string[];
}
