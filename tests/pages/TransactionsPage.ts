import { Page, Locator } from '@playwright/test';

export class TransactionsPage {
  page: Page;
  balanceDisplay: Locator;
  addBalanceButton: Locator;
  transactionTable: Locator;
  noTransactionsMessage: Locator;

  // находим все элементы
  constructor(page: Page) {
    this.page = page;
    this.balanceDisplay = page.locator('text=/Balance:/');
    this.addBalanceButton = page.getByRole('button', { name: 'Add balance' });
    this.transactionTable = page.locator('.transaction-list, table, [class*="transaction"]').first();
    this.noTransactionsMessage = page.getByText('No transactions yet');
  }

  // переход на страницу с переводами
  async goto() {
    await this.page.goto('/transactions');
  }

  // получаем баланс
  async getBalance() {
    const text = await this.balanceDisplay.textContent();
    return text || '';
  }

  // кликаем кнопку пополнения баланса
  async clickAddBalance() {
    await this.addBalanceButton.click();
  }
}