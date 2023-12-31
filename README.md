# CreationEngineAI



## How It Works

Given a query, CreationEnginefetches relevant, up-to-date information from the web and uses OpenAI's API to generate an answer.

The app works as follows:

1. Get query from user
2. Scrape Google for relevant webpages
3. Parse webpages for text
4. Build prompt using query + webpage text
5. Call OpenAI API to generate answer
6. Stream answer back to user

## Requirements

Get OpenAI API key [here](https://openai.com/api/).

## Running Locally

1. Clone repo

```bash
git clone https://github.com/mckaywrigley/clarity-ai.git
```

2. Install dependencies

```bash
npm i
```

3. Run app

```bash
npm run dev
```

## Improvement Ideas

