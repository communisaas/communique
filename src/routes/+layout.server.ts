import { objectMapper } from '$lib/data/database';
import { providers, baseProviderLogoURL } from '$lib/data/auth';
import type { LayoutServerLoad } from './$types';
import { marked } from 'marked';
import termsOfUseMarkdown from '$lib/policies/serviceTerms.md?raw';
import privacyPolicyMarkdown from '$lib/policies/privacyPolicy.md?raw';
import type { Provider } from '@auth/core/providers';

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

// TODO paramaterize dsn between staging / prod
Sentry.init({
	dsn: 'https://d90804840dbbba5c61d35f920a6f5dd9@o4506069115273216.ingest.sentry.io/4506069115404288',
	integrations: [new ProfilingIntegration()],
	// Performance Monitoring
	tracesSampleRate: 1.0,
	// Set sampling rate for profiling - this is relative to tracesSampleRate
	profilesSampleRate: 1.0
});

type DescribedProvider = Provider & {
	id: string;
	style: ProviderStyle;
};

export const load = (async ({ locals }) => {
	// TODO: compound queries, lazy load, caching

	const loudestTopics = await objectMapper.topic.findMany({ take: 10 });
	const loudestTopicEmails = objectMapper.email.findMany({
		where: {
			topic_list: {
				has: loudestTopics[0].name
			}
		},
		take: 10
	});
	// const spotlightEmails = objectMapper.email.findMany({
	// 	take: 10
	// });
	return {
		loudestTopics,
		template: {
			primary: {
				type: 'panel',
				selectable: 'topic',
				header: 'Loudest voices',
				focus: {
					type: 'topic',
					item: loudestTopics[0].name,
					field: 'topic_list',
					source: 'topic',
					iterable: true
				},
				alignment: 'end',
				cardList: await loudestTopicEmails
			}
			// secondary: {
			// 	type: 'panel',
			// 	selectable: 'spotlight',
			// 	header: 'Spotlight on',
			// 	focus: 'custom',
			// 	alignment: 'start',
			// 	cardList: await spotlightEmails
			// }
		},
		session: await locals.getSession(),
		authProviders: {
			baseLogoURL: baseProviderLogoURL.toString() as `https://${string}.svg`,
			providers: (providers as DescribedProvider[]).reduce((accumulator, provider) => {
				accumulator[provider.id] = { name: provider.name, id: provider.id, style: provider.style };
				return accumulator;
			}, {} as Record<string, ProviderAttributes>)
		},
		privacyPolicy: marked(privacyPolicyMarkdown, { mangle: false, headerIds: false }),
		termsOfUse: marked(termsOfUseMarkdown, { mangle: false, headerIds: false }) // clear deprecation warnings for mangle & headerIds
	};
}) satisfies LayoutServerLoad;
