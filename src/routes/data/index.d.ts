interface FieldMap {
	[field: string]: string;
}

interface Query {
	where: Criteria | Operator;
	take?: number;
}

interface Criteria {
	[field: string]: Operator | undefined;
}

interface Operator {
	has?: string;
	equals?: string | number;
	OR?: Criteria[];
}
