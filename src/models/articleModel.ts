export interface Article {
  external_id: string;
  title: string;
  url: string;
  source: string;
  published_at?: string | Date | null;
  category?: string;
  description?: string;
}

export interface NewsApiArticle {
  title: string;
  url: string;
  source?: { name: string };
  publishedAt?: string;
  category?: string;
  description?: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles?: NewsApiArticle[];
  data?: {
    articles: NewsApiArticle[];
  };
}

export interface TheNewsApiArticle {
  title: string;
  url: string;
  description?: string;
  category?: string;
  published_at?: string;
  source?: string;
}

export interface TheNewsApiResponse {
  data: TheNewsApiArticle[];
}
