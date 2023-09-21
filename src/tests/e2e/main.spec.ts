import { test } from '@playwright/test'

test('main page', async ({ page }) => {
  await page.goto('http://localhost:3000/main')
  await page
    .locator('div')
    .filter({
      hasText:
        'Toy Projectsbdg.chatSolar SystemPostsALLGo기타네트워크리눅스백앤드보안운영체제/컴퓨터구조자바스크립트컨테이너쿠버네티'
    })
    .nth(1)
    .click()
  await page.getByRole('button', { name: 'ALL' }).click()
  await page.getByRole('button', { name: 'Go' }).click()
  await page.getByRole('button', { name: '기타' }).click()
  await page.getByRole('button', { name: '네트워크' }).click()
  await page.getByRole('button', { name: '리눅스' }).click()
  await page.locator('.ToyProject_imageBox__NwLY3').first().click()
  await page
    .locator('div')
    .filter({ hasText: /^Solar System$/ })
    .nth(2)
    .click()
  await page.getByRole('link', { name: 'right' }).first().click()
  await page.getByRole('link', { name: 'loginIcon' }).click()
  await page.getByRole('link', { name: 'bdg.blog' }).click()
  await page.getByText('2', { exact: true }).click()
  await page.getByText('3', { exact: true }).click()
  await page.getByText('4').click()
  await page.getByText('5').click()
  await page.getByRole('img', { name: 'rightArrow', exact: true }).click()
})
