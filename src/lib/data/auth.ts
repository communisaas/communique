import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Discord from '@auth/core/providers/discord';
import Facebook from '@auth/core/providers/facebook';
import Linkedin from '@auth/core/providers/linkedin';
import Reddit from '@auth/core/providers/reddit';
import Twitter from '@auth/core/providers/twitter';
import Google from '@auth/core/providers/google';
import Slack from '@auth/core/providers/slack';
import Twitch from '@auth/core/providers/twitch';

import type { Provider } from '@auth/core/providers';
import {
	AUTH_SECRET,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	LINKEDIN_CLIENT_ID,
	LINKEDIN_CLIENT_SECRET,
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET,
	TWITTER_CLIENT_ID,
	TWITTER_CLIENT_SECRET
} from '$env/static/private';
import { find, objectMapper, upsert } from './database';

export const providers: Provider[] = [
	Google({
		clientId: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET
	}) as Provider,
	Facebook({
		clientId: process.env.FACEBOOK_CLIENT_ID || FACEBOOK_CLIENT_ID,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET || FACEBOOK_CLIENT_SECRET
	}) as Provider,
	// Linkedin({
	// 	clientId: process.env.LINKEDIN_CLIENT_ID || LINKEDIN_CLIENT_ID,
	// 	clientSecret: process.env.LINKEDIN_CLIENT_SECRET || LINKEDIN_CLIENT_SECRET
	// }) as Provider, // TODO enable when auth.js fixes OIDC changes in LinkedIn https://github.com/nextauthjs/next-auth/issues/8831
	// Twitter({
	// 	clientId: process.env.TWITTER_CLIENT_ID || TWITTER_CLIENT_ID,
	// 	clientSecret: process.env.TWITTER_CLIENT_SECRET || TWITTER_CLIENT_SECRET,
	// 	 // TODO enable when Twitter returns email addresses for oauth2.0
	// }) as Provider,
	Discord({
		clientId: process.env.DISCORD_CLIENT_ID || DISCORD_CLIENT_ID,
		clientSecret: process.env.DISCORD_CLIENT_SECRET || DISCORD_CLIENT_SECRET
	}),
	Twitch({
		clientId: process.env.TWITCH_CLIENT_ID || TWITCH_CLIENT_ID,
		clientSecret: process.env.TWITCH_CLIENT_SECRET || TWITCH_CLIENT_SECRET
	}) as Provider
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
			// TODO use provider token to grant API access
			console.log('account', account);
			console.log('profile', profile);
			let userCheckInResult;
			try {
				userCheckInResult = await upsert('user', {
					where: { email: profile?.email },
					update: {
						auth_provider: account?.provider,
						last_login: new Date(),
						given_name: profile.given_name
							? profile.given_name[0].toUpperCase() + profile.given_name.slice(1).toLowerCase()
							: null,
						family_name: profile.family_name
							? profile.family_name[0].toUpperCase() + profile.family_name.slice(1).toLowerCase()
							: null
					},
					create: {
						email: profile?.email,
						auth_provider: account?.provider,
						given_name: profile.given_name
							? profile.given_name[0].toUpperCase() + profile.given_name.slice(1).toLowerCase()
							: null,
						family_name: profile.family_name
							? profile.family_name[0].toUpperCase() + profile.family_name.slice(1).toLowerCase()
							: null
					}
				});
			} catch (error) {
				console.error(error);
				throw new Error('Database error');
			}
			return userCheckInResult;
		},
		async jwt({ token }) {
			return token;
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
