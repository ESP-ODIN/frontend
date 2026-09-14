# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Running with Docker

> If `pnpm` is not found, enable it via corepack (bundled with Node.js):
>
> ```bash
> corepack enable
> corepack prepare pnpm@9.15.0 --activate
> ```

Build the image:

```bash
pnpm docker:build
```

Run it locally with hot-reload (mounts the source code and exposes the app on port 3000):

```bash
pnpm docker:dev
```

The app is then available at [http://localhost:3000](http://localhost:3000).

<details>
<summary>Equivalent raw docker commands</summary>

```bash
docker build -t odin-frontend .

docker run --rm -p 3000:3000 \
  -v "$PWD":/app \
  -v /app/node_modules \
  -v /app/.next \
  -e WATCHPACK_POLLING=true \
  -e CHOKIDAR_USEPOLLING=true \
  odin-frontend
```

</details>
