import { PrismaClient } from '@prisma/client';

const objectMapper = new PrismaClient();

export function findMany(
	table: string,
	queryParameters: URLSearchParams,
	take: number,
	fieldMap?: FieldMap
) {
	const options = {
		where: Array.from(queryParameters.entries()).reduce(
			// TODO handle additional filter options
			(filter: { [field: string]: { has: string } }, [field, value]: string[]) => {
				filter[fieldMap ? fieldMap[field as keyof typeof fieldMap] : field] = {
					has: value
				};
				return filter;
			},
			{}
		),
		take
	};
	// ignore indexing type error
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore: Unreachable code error
	return objectMapper[table].findMany({ ...options });
}

export default objectMapper;
