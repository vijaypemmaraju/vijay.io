# vijay.io

my personal site. every plant on it is grown from a seed in the browser (`src/lib/grow.ts`); add `?seed=123` to the url to regrow a specific one.

projects live in `src/data/projects.ts`, screenshots in `src/assets/projects/`.

```
npm install
npm run dev
npm run build
```

pushes to `master` deploy to s3 + cloudfront via `.github/workflows`.
