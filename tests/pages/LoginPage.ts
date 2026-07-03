import { Page, Locator } from '@playwright/test';

export class LoginPage {
  page: Page;
  emailInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  errorMessage: Locator;

  // элементы по плейсхолдер
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Type your email');
    this.passwordInput = page.getByPlaceholder('Type your password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByText('Login failed');
  }

  // переход на страницу логина
  async goto() {
    await this.page.goto('/login');
  }

  // вводим данные и кликаем вход
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}