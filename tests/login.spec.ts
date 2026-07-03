/*
тесты страницы входа (/login)
1 успешный вход с верными данными (Critical)
2 ошибка при неверном пароле (High)
3 ошибка для несуществующем емейл (High)
4 пустая формы (High)
5 формат емейл (Medium)
6 ссылку на регистрацию (Low)
внутри используется LoginPage.ts и RegisterPage.ts
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// тип данных пользователя тк ts требует
interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

test.describe('Вход в систему', () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;

  // объекты страниц + beforeEach
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
  });

  // приоритет: critical
  test('должен успешно войти с валидными данными', async ({ page }) => {
    // сначала регистрируем нового пользователя
    const timestamp = Date.now();
    const userData: UserData = {
      name: 'Login',
      surname: 'Test',
      email: `logintest${timestamp}@example.com`, // уникальный емейл
      password: 'TestPassword123!'
    };

    // регистрируемся
    await registerPage.goto();
    await registerPage.register(userData.name, userData.surname, userData.email, userData.password);
    await page.waitForTimeout(2000);

    // переходим на страницу входа
    await loginPage.goto();

    // входим
    await loginPage.login(userData.email, userData.password);
    await page.waitForTimeout(2000);

    // проверяем что перешли на главную /
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    // проверяем что видим форму ввода
    await expect(page.getByPlaceholder('+7 999 123-45-67')).toBeVisible();
  });

  // приоритет: high
  test('должен показать ошибку при неверном пароле', async ({ page }) => {
    const email = 'wrongpass@example.com';
    const password = 'WrongPassword123!';

    // сначала регистрируемся
    await registerPage.goto();
    await registerPage.register('Wrong', 'Pass', email, 'CorrectPassword123!');
    await page.waitForTimeout(2000);

    // пытаемся войти с неправильным паролем
    await loginPage.goto();
    await loginPage.login(email, password);
    await page.waitForTimeout(1000);

    // проверяем что остались на странице
    await expect(page).toHaveURL('/login');
    
    // проверяем что появилась ошибка
    await expect(loginPage.errorMessage).toBeVisible();
  });

  // приоритет: high
  test('должен показать ошибку для незарегистрированного email', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('notregistered@example.com', 'SomePassword123!');
    await page.waitForTimeout(1000);

    // проверяем что остались на странице логина
    await expect(page).toHaveURL('/login');
    
    // проверяем ошибку
    await expect(loginPage.errorMessage).toBeVisible();
  });

  // приоритет: high
  test('должен показать ошибку при пустой форме', async ({ page }) => {
    await loginPage.goto();
    
    // пытаемся войти без заполнения полей
    await loginPage.login('', '');
    await page.waitForTimeout(1000);

    // проверяем что остались на странице
    await expect(page).toHaveURL('/login');
  });

  // приоритет: medium
  test('должен показать ошибку при невалидном email', async ({ page }) => {
    await loginPage.goto();
    
    // вводим невалидный емейл
    await loginPage.login('not-an-email', 'SomePassword123!');
    await page.waitForTimeout(1000);

    // проверяем что остались на странице логина
    await expect(page).toHaveURL('/login');
  });

  // приоритет: low
  test('должен показать ссылку на регистрацию', async ({ page }) => {
    await loginPage.goto();
    
    // проверяем что есть текст
    await expect(page.getByText("If you don't have an account, please, welcome to")).toBeVisible();
    await expect(page.getByText('Register page')).toBeVisible();
  });
});