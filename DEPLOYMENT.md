# Deploying to GitHub Pages

## Setup Instructions

### 1. Enable GitHub Pages with GitHub Actions

1. Go to your repository: https://github.com/faooful/mockingbird
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" from the dropdown
5. Save the changes

### 2. Push Your Changes

Push all the changes to GitHub:

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

### 3. Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (usually 1-2 minutes)
4. Once complete, your site will be live at: **https://faooful.github.io/mockingbird**

## What Was Changed

- ✅ Added `output: 'export'` to `next.config.ts` for static export
- ✅ Set `basePath: '/mockingbird'` for GitHub Pages subdirectory
- ✅ Created GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Added `.nojekyll` file to prevent Jekyll processing
- ✅ Fixed all ESLint errors preventing build

## Troubleshooting

### If the site still shows the README:
1. Make sure GitHub Pages source is set to "GitHub Actions" (not "Deploy from a branch")
2. Check the Actions tab for any failed workflow runs
3. Ensure the workflow has completed successfully

### If you see a 404 error:
- Wait a few minutes after the first deployment
- Clear your browser cache
- Check that the workflow completed successfully in the Actions tab

### Local Testing

To test the production build locally:

```bash
npm run build
npx serve out
```

Then visit http://localhost:3000 to see the production build.

## Future Deployments

Every time you push to the `main` branch, GitHub Actions will automatically:
1. Build your Next.js app
2. Export it as static files
3. Deploy to GitHub Pages

Your changes will be live within 1-2 minutes of pushing!

