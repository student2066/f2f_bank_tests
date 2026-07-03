import { Page, Locator } from '@playwright/test'; // импортируем страницу браузера и локатор

export class RegisterPage { // описываем все элементы страницы и методы работы
  page: Page;
  
  // поля ввода формы
  nameInput: Locator;
  surnameInput: Locator;
  emailInput: Locator;
  passwordInput: Locator;

  registerButton: Locator;

  // находим все элементы на странице
  constructor(page: Page) {
    this.page = page;
    
    // ищем поля ввода через холдеры
    this.nameInput = page.getByPlaceholder('Type your name');
    this.surnameInput = page.getByPlaceholder('Type your surname');
    this.emailInput = page.getByPlaceholder('Type your email');
    this.passwordInput = page.getByPlaceholder('Type your message...');
    
    this.registerButton = page.getByRole('button', { name: 'Register' });
  }

  // переход на страницу регистрации
  async goto() {
    await this.page.goto('/register');
  }

  // метод заполненяет поля формы + принимает их
  async fillForm(name: string, surname: string, email: string, password: string) {
    await this.nameInput.fill(name);
    await this.surnameInput.fill(surname);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  // регистрирует после заполнения всего
  async register(name: string, surname: string, email: string, password: string) {
    await this.fillForm(name, surname, email, password);
    await this.clickRegister();
  }
}