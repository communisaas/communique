import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Discord from '@auth/core/providers/discord';
import Facebook from '@auth/core/providers/facebook';
import Instagram from '@auth/core/providers/instagram';
import Linkedin from '@auth/core/providers/linkedin';
import Reddit from '@auth/core/providers/reddit';
import Twitter from '@auth/core/providers/twitter';
import Apple from '@auth/core/providers/apple';
import Google from '@auth/core/providers/google';
import Twitch from '@auth/core/providers/twitch';

import type { Provider } from '@auth/core/providers';
import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	AUTH_SECRET
} from '$env/static/private';
import { find, objectMapper, upsert } from './database';

export const providers: Provider[] = [
	Facebook({
		clientId: process.env.FACEBOOK_CLIENT_ID || FACEBOOK_CLIENT_ID,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET || FACEBOOK_CLIENT_SECRET
	}) as Provider,
	Instagram({}) as Provider,
	Twitter({}) as Provider,
	Google({}) as Provider,
	Apple({}) as Provider,
	Linkedin({}) as Provider,
	Reddit({}) as Provider,
	Discord({
		clientId: process.env.DISCORD_CLIENT_ID || DISCORD_CLIENT_ID,
		clientSecret: process.env.DISCORD_CLIENT_SECRET || DISCORD_CLIENT_SECRET
	}),
	Twitch({}) as Provider
];

export const baseProviderLogoURL = new URL('https://authjs.dev/img/providers');

const config: SvelteKitAuthConfig = {
	providers: providers,
	pages: {
		signIn: '/sign/in'
		// signOut: '/auth/signout',
		// error: '/auth/error', // Error code passed in query string as ?error=
		// verifyRequest: '/auth/verify-request', // (used for check email message)
		// newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	callbacks: {
		async signIn({ account, profile }) {
			if (!profile?.email) throw new Error('No email found');
			const exists = await find('user', { where: { email: profile?.email } });
			if (exists.length === 1) {
				// check user privilege here
				switch (exists[0].privilege.toJSON()) {
					case '-1':
						// user deleted their account, so restore it
						await objectMapper.user.update({
							where: { email: profile?.email },
							data: { privilege: 0 }
						});
						break;
					default:
						break;
				}
			}

			let userCheckInResult;
			try {
				userCheckInResult = await upsert('user', {
					where: { email: profile?.email },
					update: { auth_provider: account?.provider, last_login: new Date() },
					create: {
						email: profile?.email,
						auth_provider: account?.provider
					}
				});
				console.log(userCheckInResult);
			} catch (error) {
				console.error(error);
				throw new Error('Database error');
			}
			return userCheckInResult;
		},
		async jwt(args) {
			return args.token;
		}
	},
	debug: false,
	secret: process.env.AUTH_SECRET || AUTH_SECRET,
	trustHost: true,
	session: {
		strategy: 'jwt'
	}
};

export default SvelteKitAuth(config);
