# -------------------------
# Development Dockerfile
# -------------------------
    FROM node:20-alpine

    WORKDIR /app
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Copy root monorepo files
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
    
    # Copy package.json files of services & client
    COPY packages/server/gateway/package.json packages/server/gateway/
    COPY packages/server/services/users-service/package.json packages/server/services/users-service/
    COPY packages/server/services/projects-service/package.json packages/server/services/projects-service/
    COPY packages/server/services/clients-service/package.json packages/server/services/clients-service/
    COPY packages/web/client/package.json packages/web/client/
    COPY packages/server/seed-data/package.json packages/seed-data/
    
    # Install dependencies for the whole monorepo
    RUN pnpm install --frozen-lockfile --shamefully-hoist
    
    # Copy the rest of the code
    COPY . .
    
    # Expose all relevant ports
    EXPOSE 4001 4002 4003 5001 5173
    
    # Generate Prisma clients + push schema to DB + start all services
    CMD sh -c "\
  pnpm run generate && \
  pnpm --filter users-service exec prisma migrate deploy && pnpm --filter users-service exec prisma db seed && \
  pnpm --filter projects-service exec prisma migrate deploy && pnpm --filter projects-service exec prisma db seed && \
  pnpm --filter clients-service exec prisma migrate deploy && pnpm --filter clients-service exec prisma db seed && \
  pnpm run start-all"