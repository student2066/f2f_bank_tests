/* тесты на регистрацию /registration
1 проверяет регистрацию с валидными данными (Critical)
2 ошибки при пустой форме (High)
3 емейл без второй части после @ (Medium)
внутри используется RegisterPage.ts
 */

import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';

// тип данных пользователя тк ts требует
interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

test.describe('Регистрация нового пользователя', () => {
  let registerPage: RegisterPage;

  // объект страницы + beforeEach
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
  });

  // приоритет: critical
  test('должен успешно зарегистрироваться с валидными данными', async ({ page }) => {
    const timestamp = Date.now();
    const userData: UserData = {
      name: 'Test',
      surname: 'User',
      email: `testuser${timestamp}@example.com`, // емейл для тестов уникальный
      password: 'TestPassword123!'
    };

    // переходим на страницу регистрации
    await registerPage.goto();

    // проверяем что мы на ней
    await expect(page).toHaveURL('/register');

    // берем метод из page
    await registerPage.register(
      userData.name,
      userData.surname,
      userData.email,
      userData.password
    );

    // проверяем измененный юрл
    await page.waitForTimeout(2000);

    // проверяем что регистрация прошла
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/register');
  });

  // приоритет: high
  test('должен показать ошибку при пустой форме', async ({ page }) => {
    await registerPage.goto();

    // пытаемся зарегистрироваться с пустыми полями
    await registerPage.register('', '', '', '');

    // ждём появления ошибок
    await page.waitForTimeout(1000);

    // проверяем что все еще на странице регистрации
    await expect(page).toHaveURL('/register');
  });

  // приоритет: medium
  // Проверка формата email - важный, но не критичный сценарий
  test('должен показать ошибку при невалидном email', async ({ page }) => {
    await registerPage.goto();

    // водим только первую часть емейла
    await registerPage.register('Ivan', 'Petrov', 'invalid-email', 'password123');

    await page.waitForTimeout(1000);

    // должны остаться на странице регистрации
    await expect(page).toHaveURL('/register');
  });
});