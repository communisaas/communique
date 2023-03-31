import { PrismaClient } from '@prisma/client';

const objectMapper = new PrismaClient();

export function findMany(table: string, options: Query) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore indexing type error
	return objectMapper[table].findMany({ ...options });
}

// patch BigInt to serialize JSON as string
BigInt.prototype.toJSON = function (): string {
	return this.toString();
};

export default objectMapper;
