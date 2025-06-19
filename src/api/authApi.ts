import axios from 'axios';
import { BASE_URL } from '../config/config';
import { LoginRequest, SignupRequest } from '../interfaces/Auth';

export class AuthApi {
  async signup(data: SignupRequest) {
    return axios.post(`${BASE_URL}/auth/signup`, data);
  }

  async login(data: LoginRequest) {
    return axios.post(`${BASE_URL}/auth/login`, data);
  }
}