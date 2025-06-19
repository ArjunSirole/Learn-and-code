import axios from 'axios';
import { BASE_URL } from '../config/config';
import { SessionService } from '../services/sessionService';

const getHeaders = () => ({
  Authorization: `Bearer ${SessionService.getToken()}`,
});

export class NewsApi {
  async getHeadlines(date?: string, startDate?: string, endDate?: string) {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return axios.get(`${BASE_URL}/news/headlines`, {
      headers: getHeaders(),
      params,
    });
  }

  async getSavedArticles() {
    return axios.get(`${BASE_URL}/news/saved`, { headers: getHeaders() });
  }

  async deleteArticle(articleId: string) {
    return axios.delete(`${BASE_URL}/news/saved/${articleId}`, { headers: getHeaders() });
  }

  async searchArticles(
    query: string,
    category?: string,
    startDate?: string,
    endDate?: string,
    sortBy?: string
  ) {
    const params: Record<string, string> = { query };
    if (category) params.category = category.toLowerCase();
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (sortBy) params.sortBy = sortBy;

    return axios.get(`${BASE_URL}/news/search`, {
      headers: getHeaders(),
      params,
    });
  }

  async saveArticle(article: {
    articleId: string;
    title: string;
    url: string;
    source: string;
  }) {
    return axios.post(`${BASE_URL}/news/save`, article, { headers: getHeaders() });
  }

  async giveFeedback(articleId: string, feedback: 'LIKE' | 'DISLIKE') {
    return axios.post(
      `${BASE_URL}/news/${articleId}/feedback`,
      { feedback },
      { headers: getHeaders() }
    );
  }

  async reportArticle(articleId: number, reason: string) {
    return axios.post(
      `${BASE_URL}/news/articles/${articleId}/report`,
      { reason },
      { headers: getHeaders() }
    );
  }
}