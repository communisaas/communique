// import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
// import Discord from '@auth/core/providers/discord';
// import Facebook from '@auth/core/providers/facebook';
// import Instagram from '@auth/core/providers/instagram';
// import Linkedin from '@auth/core/providers/linkedin';
// import Reddit from '@auth/core/providers/reddit';
// import Twitter from '@auth/core/providers/twitter';

// import type { Provider } from '@auth/core/providers';
// import { redirect, type Handle } from '@sveltejs/kit';
// import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, PROVIDER_SECRET } from '$env/static/private';
// import { sequence } from '@sveltejs/kit/hooks';

// async function protect({ event, resolve }) {
// 	if (event.url.pathname.startsWith('/compose')) {
// 		const session = await event.locals.getSession();
// 		if (!session) {
// 			const tokenCall = await event.fetch('/auth/csrf');
// 			const csrfTokenResponse = await new Response(tokenCall.body).json();
// 			const csrfToken = csrfTokenResponse.csrfToken;

// 			const params = new URLSearchParams();
// 			params.append('scope', 'api openid profile email');
// 			const authData = new URLSearchParams();

// 			authData.append('callbackUrl', '/');
// 			authData.append('csrfToken', csrfToken);

// 			const loginRequest = await event.fetch('/auth/signin/?' + params.toString(), {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/x-www-form-urlencoded',
// 					'X-Auth-Return-Redirect': '1'
// 				},
// 				body: authData.toString()
// 			});
// 			const loginResponse = await loginRequest.json();
// 			throw redirect(302, loginResponse.url);
// 		}
// 	}

// 	return resolve(event);
// }

// const config: SvelteKitAuthConfig = {
// 	providers: [
// 		Facebook({}) as Provider,
// 		Instagram({}) as Provider,
// 		Linkedin({}) as Provider,
// 		Twitter({}) as Provider,
// 		Reddit({}) as Provider,
// 		Discord({
// 			clientId: DISCORD_CLIENT_ID,
// 			clientSecret: DISCORD_CLIENT_SECRET
// 		}) as Provider
// 	],

// 	secret: PROVIDER_SECRET,
// 	trustHost: true,
// 	session: {
// 		maxAge: 1800 // 30 mins
// 	}
// };

// export const handle = sequence(SvelteKitAuth(config), protect) satisfies Handle;
