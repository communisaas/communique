import { rawSqlQuery } from '$lib/data/database';
import { Prisma } from '@prisma/client';
import { fuzzyMatch } from 'fuzzbunny';
import { Country, State, City } from 'country-state-city';

const allCountries = Country.getAllCountries();
const allStates = State.getAllStates();
const allCities = City.getAllCities();

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
	const searchTerms = decodeURIComponent(params.slug).split('&');
	let searchQuery = searchTerms.map((term) => `${term.trim()}:*`).join(' & ');
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
		const searchAndRank = (data, fields, type, maxResults = 5) => {
			const searchQueries = searchTerms[0].split(',').map((part) => part.trim().toLowerCase()); // Preprocess search terms
			let topResults = []; // Maintain only top 5 entities

			data.forEach((item) => {
				let totalRank = 0; // Initialize total rank

				searchQueries.forEach((queryPart) => {
					let bestRankForThisPart = 0;

					fields.forEach((field) => {
						const itemFieldLower = item[field].toLowerCase(); // Lowercase once
						const rank = fuzzyMatch(itemFieldLower, queryPart)?.score ?? 0;
						bestRankForThisPart = Math.max(bestRankForThisPart, rank);
					});

					totalRank += bestRankForThisPart; // Aggregate the best rank for this part
				});

				let normalizedRank = totalRank < Infinity ? -totalRank : totalRank;

				if (normalizedRank < 0) {
					// If the item is a meaningful match
					let hierarchicalName = item.name;
					if (type === 'city' && item.stateCode !== item.countryCode) {
						hierarchicalName += `, ${item.stateCode}`;
					}
					if (type !== 'country') {
						hierarchicalName += `, ${item.countryCode}`;
					}

					// penalize longer matches
					normalizedRank += hierarchicalName.length / searchTerms[0].length;

					const newItem = { item: hierarchicalName, source: type, rank: normalizedRank };

					// Maintain top 5 results using a sorted insertion approach
					if (
						topResults.length < maxResults ||
						newItem.rank < topResults[topResults.length - 1].rank
					) {
						topResults.push(newItem); // Add new item
						topResults.sort((a, b) => a.rank - b.rank); // Sort descending by rank
						if (topResults.length > maxResults) topResults.pop(); // Ensure only top 5 are kept
					}
				}
			});

			return topResults; // Return the top results, up to 5
		};

		let cityResults = searchAndRank(allCities, ['name', 'countryCode', 'stateCode'], 'city');
		let stateResults = searchAndRank(allStates, ['name', 'countryCode'], 'state');
		let countryResults = searchAndRank(allCountries, ['name'], 'country');

		// Merge and directly return the top sorted results, up to 5
		let combinedResults = [...cityResults, ...stateResults, ...countryResults];
		combinedResults.sort((a, b) => a.rank - b.rank); // Sort descending by rank
		results = combinedResults.slice(0, 5); // Return top 5 results
	}
	return new Response(JSON.stringify(results));
}
