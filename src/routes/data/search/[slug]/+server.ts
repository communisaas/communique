import { rawSqlQuery } from '$lib/data/database';
import { Prisma } from '@prisma/client';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
	const searchTerms = decodeURIComponent(params.slug).split('&');
	const searchQuery = searchTerms.map((term) => `${term.trim()}:*`).join(' & ');
	const source = url.searchParams.get('source');

	let results;

	if (source !== 'location') {
		const pageSize = 10; // Number of items per page
		const page = 1; // Page number, starting from 1

		const offset = (page - 1) * pageSize;

		const rawQuery = Prisma.sql`
        WITH 
        email_search AS (
            SELECT
                'email' AS source, 
                subject AS id, 
                ts_rank(to_tsvector('english', subject), plainto_tsquery('english', ${searchQuery})) AS rank
            FROM email
            WHERE to_tsvector('english', subject) @@ plainto_tsquery('english', ${searchQuery})
        ),
        recipient_search AS (
            SELECT 
                'recipient' AS source, 
                address AS id, 
                ts_rank(to_tsvector('english', address), plainto_tsquery('english', ${searchQuery})) AS rank
            FROM recipient 
            WHERE to_tsvector('english', address) @@ plainto_tsquery('english', ${searchQuery})
        ),
        topic_search AS (
            SELECT 
                'topic' AS source, 
                name AS id, 
                ts_rank(to_tsvector('english', name), plainto_tsquery('english', ${searchQuery})) AS rank
            FROM topic 
            WHERE to_tsvector('english', name) @@ plainto_tsquery('english', ${searchQuery})
        )
        SELECT * FROM (
            SELECT * FROM email_search
            UNION ALL
            SELECT * FROM recipient_search
            UNION ALL
            SELECT * FROM topic_search
        ) AS combined_search
        ORDER BY rank DESC
        LIMIT ${pageSize} OFFSET ${offset};
    `;
		try {
			results = await rawSqlQuery(rawQuery);
		} catch (error) {
			if (error.code == 'P2010') results = []; // if not found, return empty array
			else {
				console.error(error);
				return new Response(JSON.stringify({ error: error.message }), { status: 500 });
			}
		}
	} else if (source === 'location') {
		// TODO resolve locations across multiple languages
		results = [];
	}
	return new Response(JSON.stringify(results));
}
