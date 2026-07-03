/*
 тесты страницы профиля (/profile)
1 отображение страницы профиля (Critical)
2 показ имени пользователя (High)
3 показ email пользователя (High)
4 показ фамилии пользователя (Medium)
5 оказ баланса на странице (Medium)
внутри используется ProfilePage.ts, LoginPage.ts, RegisterPage.ts
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

// тип данных пользователя тк ts требует
interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

test.describe('Профиль пользователя', () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;
  let profilePage: ProfilePage;
  let userData: UserData;

  // регистрируем и логиним пользователя перед каждым тестом
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    profilePage = new ProfilePage(page);

    // генерируем уникальные данные
    const timestamp = Date.now();
    userData = {
      name: 'Profile',
      surname: 'Test',
      email: `profile${timestamp}@example.com`,
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
  test('должен отобразить страницу профиля', async ({ page }) => {
    // переходим на страницу профиля
    await profilePage.goto();
    
    // проверяем что попали на нужную страницу
    await expect(page).toHaveURL('/profile');
  });

  // приоритет: high
  test('должен показать имя пользователя', async ({ page }) => {
    await profilePage.goto();
    
    // получаем текст с именем
    const name = await profilePage.getName();
    
    // проверяем что содержит метку Name:
    expect(name).toContain('Name:');
  });

  // приоритет: high
  test('должен показать email пользователя', async ({ page }) => {
    await profilePage.goto();
    
    // получаем текст с емейла
    const email = await profilePage.getEmail();
    
    // проверяем что содержит метку Email:
    expect(email).toContain('Email:');
  });

  // приоритет: medium
  test('должен показать фамилию пользователя', async ({ page }) => {
    await profilePage.goto();
    
    // получаем текст с фамилией
    const surname = await profilePage.getSurname();
    
    // проверяем что содержит метку Surname:
    expect(surname).toContain('Surname:');
  });

  // приоритет: medium
  test('должен показать баланс на странице профиля', async ({ page }) => {
    await profilePage.goto();
    
    // проверяем что отображается баланс
    await expect(profilePage.balanceDisplay).toBeVisible();
  });
});