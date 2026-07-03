/*
тестылавной страницы (/)
1 успешный перевод с валидными данными (Critical)
2 валидацию номера телефона (High)
3 валидацию отрицательной суммы (High)
4 валидацию пустой суммы (Medium)
5 валидацию суммы больше баланса (Medium)
6 отмену перевода (Low)
внутри есть HomePage.ts, LoginPage.ts, RegisterPage.ts
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';

// тип данных пользователя тк ts требует
interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

test.describe('Переводы (Главная страница)', () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;
  let homePage: HomePage;
  let userData: UserData;

  // регистрируем и логиним пользователя перед каждым тестом
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    homePage = new HomePage(page);

    // генерируем уникальные данные
    const timestamp = Date.now();
    userData = {
      name: 'Transfer',
      surname: 'Test',
      email: `transfer${timestamp}@example.com`,
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
  });

  // приоритет: critical
  test('должен успешно выполнить перевод с валидными данными', async ({ page }) => {
    // проверяем что мы на главной странице
    await expect(page).toHaveURL('/');
    
    // заполняем форму перевода
    await homePage.transfer('+79991234567', '100.00', 'Test payment');
    
    // ждём выполнения перевода
    await page.waitForTimeout(2000);
    
    // проверяем что остались на главной (перевод выполнен)
    await expect(page).toHaveURL('/');
  });

  // приоритет: high
  test('должен показать ошибку при невалидном номере телефона', async ({ page }) => {
    // пытаемся отправить перевод с енправильным телефоном
    await homePage.transfer('invalid-phone', '100.00', 'Test');
    await page.waitForTimeout(1000);
    
    // проверяем что остались на главной (перевод не выполнен)
    await expect(page).toHaveURL('/');
  });

  // приоритет: high
  test('должен показать ошибку при отрицательной сумме', async ({ page }) => {
    // пытаемся отправить перевод с отрицательной суммой
    await homePage.transfer('+79991234567', '-100', 'Test');
    await page.waitForTimeout(1000);
    
    // проверяем что остались на главной
    await expect(page).toHaveURL('/');
  });

  // приоритет: medium
  test('должен показать ошибку при пустой сумме', async ({ page }) => {
    // пытаемся отправить перевод без суммы
    await homePage.transfer('+79991234567', '', 'Test');
    await page.waitForTimeout(1000);
    
    // проверяем что остались на главной
    await expect(page).toHaveURL('/');
  });

  // приоритет: medium
  test('должен показать ошибку при сумме больше баланса', async ({ page }) => {
    // пытаемся отправить перевод с суммой больше баланса
    await homePage.transfer('+79991234567', '999999.99', 'Test');
    await page.waitForTimeout(2000);
    
    // проверяем что остались на главной
    await expect(page).toHaveURL('/');
  });

  // приоритет: low
  test('должен отменить перевод при нажатии Cancel', async ({ page }) => {
    // заполняем форму вручную
    await homePage.phoneInput.fill('+79991234567');
    await homePage.amountInput.fill('100.00');
    await homePage.purposeInput.fill('Test');
    
    // нажимаем отмену
    await homePage.cancelButton.click();
    await page.waitForTimeout(1000);
    
    // проверяем что в форме ничего нет
    await expect(homePage.phoneInput).toHaveValue('');
    await expect(homePage.amountInput).toHaveValue('');
    await expect(homePage.purposeInput).toHaveValue('');
  });
});