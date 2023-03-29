import { PrismaClient } from '@prisma/client';

const objectMapper = new PrismaClient();

// patch BigInt to serialize as string
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): string {
	return this.toString();
};

export default objectMapper;
