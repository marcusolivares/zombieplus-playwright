![poster](https://raw.githubusercontent.com/qaxperience/thumbnails/main/playwright-zombie.png)

## About

Automated test suite for the Zombie Plus streaming platform, built with Playwright. This project demonstrates end-to-end testing best practices including Page Object Model patterns, API testing, database integration, and fixture-based test data management.

## Technologies

- [Playwright](https://playwright.dev/) - Modern end-to-end testing framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Faker.js](https://fakerjs.dev/) - Test data generation
- [PostgreSQL](https://www.postgresql.org/) - Database for test setup/teardown
- [dotenv](https://github.com/motdotla/dotenv) - Environment configuration
- Node.js

## Project Structure

```
tests/
├── e2e/              # End-to-end test specs
├── support/
│   ├── actions/      # Page Object classes
│   ├── api/          # API helper functions
│   ├── fixtures/     # Test data (JSON)
│   └── database.ts   # Database utilities
```

## Getting Started

1. Clone the repository and install dependencies
```bash
npm install
```

2. Install Playwright browsers
```bash
npx playwright install
```

3. Configure environment variables (create a `.env` file based on your setup)

## Running Tests

Run all tests in headless mode:
```bash
npm test
```

Run tests with interactive UI:
```bash
npm run test:ui
```

Run tests in debug mode:
```bash
npm run test:debug
```

View test report:
```bash
npm run test:report
```

Run only agent-generated tests:
```bash
npx playwright test --grep @agent
```

---
