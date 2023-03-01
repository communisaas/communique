# **communique**

A web platform that enables sharing, browsing & generation of email message templates.

Let the collective voice rise.

## Stack

- Frontend: [SvelteKit](https://kit.svelte.dev/), [tailwindcss](https://tailwindcss.com/)
- Database: [CockroachDB](https://www.cockroachlabs.com/docs/)
- KYC & 
- Object-relational mapping: [Prisma](https://www.prisma.io/cockroachdb)

## Running locally for development

1. Install [Node.js v18.x](https://nodejs.org/en/download/)
2. Download dependencies into app directory with `npm install`
3. Define or stub environment variables listed below into a `.env` file at repo root

    ```.env

    TINYMCE_KEY={Public client token for TinyMCE editor}

    FINGERPRINTJS_KEY={Public client token for FingerprintJS}
    FINGERPRINTJS_SERVER_KEY={Private server API token for FingerprintJS}
    FINGERPRINTJS_URL={Base URL for FingerprintJS server API}

    DATABASE_URL={Cockroachdb connection URL for Prisma}
    
    ```

4. Run development server on `localhost:5173` with `npm run dev`
