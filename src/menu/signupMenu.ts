import inquirer from 'inquirer';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export async function signupMenu(): Promise<void> {
  const { name, email, password } = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Enter your name:' },
    { type: 'input', name: 'email', message: 'Enter your email:' },
    { type: 'password', name: 'password', message: 'Enter your password:', mask: '*' },
  ]);

  await authService.signup({ name, email, password });
}