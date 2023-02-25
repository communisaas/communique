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

base.describe('post', () => {
	type EmailFixture = {
		topic: string[];
		recipient: string[];
		subject: string;
		body: string;
		postStatus: Response;
	};
	const test = base.extend<EmailFixture>({
		topic: async ({}, use) => {
			await use(['topic 1', 'topic 2']);
		},
		recipient: async ({}, use) => {
			await use(['email@first.com', 'email@next.com']);
		},
		subject: async ({}, use) => {
			await use("let's talk about: this");
		},
		body: async ({}, use) => {
			// TODO body placeholders
			await use(`
				<h1>Hello,</h1>
				<p>thank you for reading!</p>
				<span>Best regards,<i>{name}</i></span>

			`);
		},
		postStatus: async ({ page }, use) => {
			await page.route('**/compose/publish', (route) =>
				route.fulfill({
					status: 200,
					body: 'accept'
				})
			);
		}
	});

	for (const placeholderText of ['Recipient', 'Topic']) {
		test(`Missing ${placeholderText.toLowerCase()}s caught`, async ({
			topic,
			recipient,
			body,
			postStatus,
			page
		}) => {});
	}

	test(`Missing subject caught`, async ({ topic, recipient, body, postStatus, page }) => {});

	test(`Missing body caught`, async ({ topic, recipient, body, postStatus, page }) => {});

	test(`Post success confirmation appears after response`, async ({
		topic,
		recipient,
		body,
		postStatus,
		page
	}) => {});
});
