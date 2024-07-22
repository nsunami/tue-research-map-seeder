# tue-research-map-seeder

The script here seeds a database with TU/e organizations and researchers, available at Pure Portal: https://research.tue.nl/

The data is sourced from [Pure API](https://pure.tue.nl/ws/api/api-docs/index.html?url=/ws/api/openapi.yaml#/).

The goal is to create a organizational diagram with relationships between organizations and persons.

To install dependencies:

```bash
bun install
```

Create a `.env` file:

```bash
DATABASE_URL="YOUR_POSTGRES_DATABASE_URL"
PURE_API_KEY="YOUR_KEY"
```

To run:

```bash
bun run dev
```

This project was created using `bun init` in bun v1.1.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
