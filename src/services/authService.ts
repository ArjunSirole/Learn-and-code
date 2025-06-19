// authService.ts
import { AuthApi } from '../api/authApi';
import { LoginRequest, SignupRequest } from '../interfaces/Auth';
import { SessionService } from './sessionService';

export class AuthService {
  private authApi = new AuthApi();

  async signup(data: SignupRequest): Promise<boolean> {
    try {
      const response = await this.authApi.signup(data);
      console.log(response.data.message);
      return true;
    } catch (error: any) {
      console.error('Signup failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async login(data: LoginRequest): Promise<boolean> {
    try {
      const response = await this.authApi.login(data);
      const { token, message } = response.data;
      console.log(message);
      SessionService.saveToken(token);
      return true;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return false;
    }
  }
}