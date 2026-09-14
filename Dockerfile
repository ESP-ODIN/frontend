# Dockerfile de développement pour le service frontend (Next.js)
# Objectif : lancer `next dev` avec hot-reload dans un conteneur,
# pour être branché tel quel dans le docker-compose global de l'archi micro-service.

FROM node:22-alpine

WORKDIR /app

# pnpm via corepack (version pilotée par packageManager si présent, sinon "latest")
RUN corepack enable

# On copie d'abord uniquement les manifests pour profiter du cache Docker :
# tant que package.json / pnpm-lock.yaml ne changent pas, ce layer n'est pas rejoué.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Le reste du code sera de toute façon écrasé par le bind mount en dev,
# mais on le copie pour que l'image soit utilisable seule (ex: premier build, CI).
COPY . .

ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    # nécessaire pour que le hot-reload fonctionne de façon fiable
    # quand /app est un volume monté (Docker Desktop macOS/Windows)
    WATCHPACK_POLLING=true \
    CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["pnpm", "exec", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
