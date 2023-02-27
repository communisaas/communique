import { PrismaClient } from '@prisma/client';

const objectMapper = new PrismaClient();

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		emailList: await objectMapper.email.findMany({ take: 10 })
	};
}
