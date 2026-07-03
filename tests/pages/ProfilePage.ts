import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  page: Page;
  nameDisplay: Locator;
  surnameDisplay: Locator;
  emailDisplay: Locator;
  balanceDisplay: Locator;

  // находим все элементы на странице
  constructor(page: Page) {
    this.page = page;
    this.nameDisplay = page.getByText(/^Name:/);
    this.surnameDisplay = page.getByText(/^Surname:/);
    this.emailDisplay = page.getByText(/^Email:/);
    this.balanceDisplay = page.locator('text=/Balance:/');
  }

  // переход на страницу профиля
  async goto() {
    await this.page.goto('/profile');
  }

  // получаем текст с именем
  async getName() {
    const text = await this.nameDisplay.textContent();
    return text || '';
  }

  // получаем текст с фамилией
  async getSurname() {
    const text = await this.surnameDisplay.textContent();
    return text || '';
  }

  // получаем текст с емейла
  async getEmail() {
    const text = await this.emailDisplay.textContent();
    return text || '';
  }
}