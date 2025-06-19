// src/interfaces/ApiParameters.ts - Proper interfaces for API parameters

// ===== NEWS API INTERFACES =====

export interface HeadlinesQueryParams {
    date?: string;
    startDate?: string;
    endDate?: string;
  }
  
  export interface SearchArticlesParams {
    query: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
  }
  
  export interface SaveArticleRequest {
    articleId: string;
    title: string;
    url: string;
    source: string;
  }
  
  export interface ArticleFeedbackRequest {
    feedback: 'LIKE' | 'DISLIKE';
  }
  
  // ===== NOTIFICATION API INTERFACES =====
  
  export interface NotificationConfigRequest {
    user_id: number;
    business: boolean;
    entertainment: boolean;
    sports: boolean;
    technology: boolean;
    keywords?: string;
  }
  
  export interface NotificationConfigUpdate {
    business: boolean;
    entertainment: boolean;
    sports: boolean;
    technology: boolean;
    keywords?: string;
  }
  
  // ===== ADMIN API INTERFACES =====
  
  export interface UpdateApiKeyRequest {
    apiKey: string;
  }
  
  export interface AddCategoryRequest {
    name: string;
  }
  
  export interface UpdateUserRoleRequest {
    role: 'ADMIN' | 'USER';
  }
  
  export interface ServerMetrics {
    id: number;
    name: string;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    last_accessed: string;
    response_time?: number;
    uptime_percentage?: number;
  }
  
  export interface UserMetrics {
    total_users: number;
    active_users: number;
    inactive_users: number;
    admin_users: number;
    regular_users: number;
    users_registered_today: number;
    users_registered_this_week: number;
    users_registered_this_month: number;
  }
  
  export interface NewsMetrics {
    total_articles: number;
    articles_today: number;
    articles_this_week: number;
    articles_this_month: number;
    most_popular_category: string;
    total_saved_articles: number;
    total_likes: number;
    total_dislikes: number;
  }
  
  // ===== COMMON API INTERFACES =====
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
  }
  
  export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
  }
  
  export interface SortParams {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }