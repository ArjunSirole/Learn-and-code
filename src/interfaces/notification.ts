export interface Notification {
  id: number;
  title: string;
  category: string;
  published_at: string;
  url: string;
  is_read: boolean;
  description?: string;
  source?: string;
}
