import { PrismaClient } from '@prisma/client';

const objectMapper = new PrismaClient();

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent, setHeaders }) {
	// TODO: local updates
}
