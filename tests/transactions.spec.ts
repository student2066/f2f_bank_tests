/*
тесты транзакций (/transactions)
1 отображение страницы (Critical)
2 показ баланса пользователя (High)
3 кнопку пополнения баланса (High)
4 история переводов (Low)
5 сообщение когда нет транзакций (Low)
внутри TransactionsPage.ts, LoginPage.ts, RegisterPage.ts
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TransactionsPage } from './pages/TransactionsPage';

// тип данных пользователя тк ts требует
interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

test.describe('Транзакции', () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;
  let transactionsPage: TransactionsPage;
  let userData: UserData;

  // регистрируем и логиним пользователя перед каждым тестом
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    transactionsPage = new TransactionsPage(page);

    // генерируем уникальные данные
    const timestamp = Date.now();
    userData = {
      name: 'Transaction',
      surname: 'Test',
      email: `transaction${timestamp}@example.com`,
      password: 'TestPassword123!'
    };

    // регистрируемся
    await registerPage.goto();
    await registerPage.register(userData.name, userData.surname, userData.email, userData.password);
    await page.waitForTimeout(2000);

    // входим в систему
    await loginPage.goto();
    await loginPage.login(userData.email, userData.password);
    await page.waitForTimeout(2000);
    
    // переходим на страницу переводов
    await transactionsPage.goto();
    await page.waitForTimeout(1000);
  });

  // приоритет: critical
  test('должен отобразить страницу транзакций', async ({ page }) => {
    // проверяем что попали на нужную страницу
    await expect(page).toHaveURL('/transactions');
  });

  // приоритет: high
  test('должен показать баланс пользователя', async ({ page }) => {
    // проверяем что отображается баланс
    await expect(transactionsPage.balanceDisplay).toBeVisible();
  });

  // приоритет: high
  test('должен показать кнопку Add balance', async ({ page }) => {
    // проверяем что есть кнопка пополнения
    await expect(transactionsPage.addBalanceButton).toBeVisible();
  });

  // приоритет: low
  test('должен отобразить историю с переводами', async ({ page }) => {
    // проверяем что есть история
    await expect(transactionsPage.transactionTable).toBeVisible();
  });

  // приоритет: low
  test('должен показать сообщение когда нет транзакций', async ({ page }) => {
    // проверяем что есть сообщение "No transactions yet"
    await expect(transactionsPage.noTransactionsMessage).toBeVisible();
  });
});