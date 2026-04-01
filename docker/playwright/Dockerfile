FROM mcr.microsoft.com/playwright:v1.58.2-noble
WORKDIR /app

# playwright/ and node_modules/ are mounted at runtime via docker-compose volumes
COPY playwright.config.ts ./

CMD ["npx", "playwright", "test"]
