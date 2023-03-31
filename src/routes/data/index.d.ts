interface FieldMap {
	[field: string]: string;
}

interface Query {
	where: Criteria;
	take: number;
}

interface Criteria {
	[field: string]: Operator;
}

interface Operator {
	has?: string;
	equals?: string | number;
}
