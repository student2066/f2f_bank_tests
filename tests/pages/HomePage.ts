import { Page, Locator } from '@playwright/test';

export class HomePage {
  page: Page;
  phoneInput: Locator;
  amountInput: Locator;
  purposeInput: Locator;
  sendButton: Locator;
  cancelButton: Locator;

  // находим элементы
  constructor(page: Page) {
    this.page = page;
    this.phoneInput = page.getByPlaceholder('+7 999 123-45-67');
    this.amountInput = page.getByPlaceholder('0.00');
    this.purposeInput = page.getByPlaceholder('e.g. debt repayment');
    this.sendButton = page.getByRole('button', { name: 'Send' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  // переход на главную страницу
  async goto() {
    await this.page.goto('/');
  }

  // заполняем форму
  async transfer(phone: string, amount: string, purpose: string) {
    await this.phoneInput.fill(phone);
    await this.amountInput.fill(amount);
    await this.purposeInput.fill(purpose);
    await this.sendButton.click();
  }

  // cansel для отмены перевода
  async cancel() {
    await this.cancelButton.click();
  }
}