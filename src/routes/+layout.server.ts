import { PrismaClient } from '@prisma/client';

const objectMapper = new PrismaClient();

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		loudestTopics: await objectMapper.topic.findMany({ take: 10 })
	};
}
