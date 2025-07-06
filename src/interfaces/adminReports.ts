export interface ReportedArticle {
  report_id: number;
  article_id: number;
  user_id: number;
  reason: string;
  created_at: string;
  title: string;
  url: string;
  is_hidden: boolean;
  report_count: number;
}

export interface BannedKeyword {
  id: number;
  keyword: string;
  enabled: boolean;
}

export interface Category {
  id: number;
  name: string;
  hidden: boolean;
}
