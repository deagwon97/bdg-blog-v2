import { test } from '@playwright/test'

const user = JSON.parse(JSON.stringify(require('./.auth/user.json')))

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/main')
  await page.getByRole('link', { name: 'loginIcon' }).click()
  await page.locator('input[type="text"]').click()
  await page.locator('input[type="text"]').fill(user.email)
  await page.locator('input[type="text"]').press('Tab')
  await page.locator('input[type="password"]').fill(user.password)
  await page.locator('input[type="password"]').press('Enter')
  await page.getByRole('button', { name: 'ALL' }).click()
  await page.getByRole('button', { name: '기타' }).click()
})
