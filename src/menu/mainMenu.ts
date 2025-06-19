import inquirer from 'inquirer';
import { loginMenu } from './loginMenu';
import { signupMenu } from './signupMenu';
import { SessionService } from '../services/sessionService';
import { adminMenu } from './adminMenu';
import { userMenu } from './userMenu';
// import { userMenu } from './userMenu';

enum MainMenuOption {
  Login = 'Login',
  Signup = 'Sign up',
  Exit = 'Exit',
}

export async function mainMenu(): Promise<void> {
  let exitRequested = false;

  while (!exitRequested) {
    console.clear();
    console.log('\  Welcome to the News Aggregator Application!\n');

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Please choose an option:',
        choices: Object.values(MainMenuOption),
      },
    ]);

    switch (action) {
      case MainMenuOption.Login: {
        const success = await loginMenu();

        if (success) {
          const role = SessionService.getUserRole();
          switch (role) {
            case 'ADMIN':
              await adminMenu();
              break;
            case 'USER':
              await userMenu();
              break;
            default:
              console.log(' Unknown user role. Access denied.');
          }
        }
        break;
      }

      case MainMenuOption.Signup:
        await signupMenu();
        break;

      case MainMenuOption.Exit:
        console.log('\n Goodbye! Thanks for using News Aggregator.\n');
        exitRequested = true;
        break;
    }
  }
}
