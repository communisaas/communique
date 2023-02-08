import { expect, test as base, chromium, type Page, type Locator } from '@playwright/test';

let page: Page;
base.beforeAll(async () => {
	const browser = await chromium.launch();
	page = await browser.newPage();

	await page.goto('/compose');
});

base.describe('tag', () => {
	type TagFixture = {
		input: Locator;
		tagInterface: Locator;
	};
	for (const placeholderText of ['Recipient', 'Topic']) {
		const test = base.extend<TagFixture>({
			input: async ({}, use) => {
				await use(page.getByPlaceholder(placeholderText));
			},
			tagInterface: async ({}, use) => {
				await use(
					page.getByRole('listitem').filter({
						has: page.getByPlaceholder(placeholderText)
					})
				);
			}
		});

		test(`${placeholderText.toLowerCase()} input appears/disappears on click`, async ({
			input,
			tagInterface
		}) => {
			// invisible by default

			await expect(input).toHaveCSS('width', '0px');
			// toggle visibility
			for (const visible of [true, false]) {
				await tagInterface.getByRole('button').click();
				if (visible) {
					await expect(input).not.toHaveCSS('width', '0px');
				} else {
					await expect(input).toHaveCSS('width', '0px');
				}
			}
		});
	}
});
