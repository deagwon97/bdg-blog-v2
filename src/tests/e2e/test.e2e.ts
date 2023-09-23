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
  await page.getByRole('img', { name: 'rightArrow', exact: true }).click()
  await page.getByRole('link', { name: 'bdg.blog' }).click()
  await page.getByText('bdg.chat').click()
  await page.getByRole('link', { name: 'right' }).first().click()
  await page.getByRole('link', { name: 'bdg.blog' }).click()
  await page.getByRole('link', { name: 'tempPostListIcon' }).click()
  await page.getByRole('link', { name: 'bdg.blog', exact: true }).click()
  await page.getByRole('button', { name: 'Go' }).click()
  await page.getByRole('button', { name: '기타' }).click()
  await page.getByRole('button', { name: '네트워크' }).click()
  await page.getByRole('button', { name: '리눅스' }).click()
})
