interface FieldMap {
	[field: string]: string | Clause | Operator | unknown;
}

interface QueryResult {
	source: 'recipient' | 'topic' | 'email';
	id: string;
	rank: number;
	lev_distance: number;
}

interface Query {
	[table: string]: Clause;
}

interface Clause {
	where?: Criteria;
	update?: FieldMap;
	create?: FieldMap;
	data?: FieldMap;
	take?: number;
	select?: FieldMap;
}

interface Criteria {
	[field: string]: Operator | Query | string;
}

interface Operator {
	has?: string;
	hasSome?: string[];
	hasEvery?: string[];
	in?: string[];
	equals?: string | number;
	increment?: number;
	push?: unknown;
	OR?: Criteria[];
}
