import axios from "axios";
import { BASE_URL } from "../config/config";
import { SessionService } from "../services/sessionService";

const getHeaders = () => ({
  Authorization: `Bearer ${SessionService.getToken()}`,
});

export class AdminApi {
  async getServers() {
    return axios.get(`${BASE_URL}/admin/servers`, { headers: getHeaders() });
  }

  async getServerById(id: number) {
    return axios.get(`${BASE_URL}/admin/servers/${id}`, { headers: getHeaders() });
  }

  async updateApiKey(id: number, apiKey: string) {
    return axios.put(`${BASE_URL}/admin/servers/${id}/apikey`, { apiKey }, { headers: getHeaders() });
  }

  async addCategory(name: string) {
    return axios.post(`${BASE_URL}/admin/categories`, { name }, { headers: getHeaders() });
  }

  async deleteUser(id: number) {
    return axios.delete(`${BASE_URL}/admin/users/${id}`, { headers: getHeaders() });
  }

  async deactivateUser(id: number) {
    return axios.put(`${BASE_URL}/admin/users/${id}/deactivate`, {}, { headers: getHeaders() });
  }

  async reactivateUser(id: number) {
    return axios.put(`${BASE_URL}/admin/users/${id}/reactivate`, {}, { headers: getHeaders() });
  }

  async updateUserRole(id: number, role: "ADMIN" | "USER") {
    return axios.put(`${BASE_URL}/admin/users/${id}/role`, { role }, { headers: getHeaders() });
  }

  async getUserMetrics() {
    return axios.get(`${BASE_URL}/admin/metrics/users`, { headers: getHeaders() });
  }

  async getNewsMetrics() {
    return axios.get(`${BASE_URL}/admin/metrics/news`, { headers: getHeaders() });
  }

  async getReportedArticles() {
    return axios.get(`${BASE_URL}/admin/reports`, { headers: getHeaders() });
  }
  
  async hideArticle(articleId: number) {
    return axios.put(`${BASE_URL}/admin/articles/${articleId}/hide`, {}, { headers: getHeaders() });
  }
  
  async dismissReport(reportId: number) {
    return axios.put(`${BASE_URL}/admin/reports/${reportId}/dismiss`, {}, { headers: getHeaders() });
  }
}
