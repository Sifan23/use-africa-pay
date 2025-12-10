# GitHub Release Publishing Guide

## Your Current Setup

You publish via **GitHub Releases**, not direct `npm publish`. This is actually better because it's automated!

## How It Works

### 1. **Create a Git Tag**

```bash
# Commit your changes first
git add .
git commit -m "chore: release v1.1.1"

# Create and push tag
git tag v1.1.1
git push origin v1.1.1
```

### 2. **GitHub Actions Runs**

When you push a tag:
1. ✅ GitHub Actions detects the tag
2. ✅ Builds the packages
3. ✅ Publishes to npm
4. ✅ Creates GitHub release

### 3. **Package is Live**

Your package appears on:
- npm: `@use-africa-pay/core@1.1.1`
- GitHub: Release page with notes

## Setup Required

### Step 1: Add NPM Token to GitHub Secrets

1. **Get npm token**:
   ```bash
   npm login
   npm token create
   ```

2. **Add to GitHub**:
   - Go to: https://github.com/idyWilliams/use-africa-pay/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: (paste your npm token)

### Step 2: Commit Version Changes

```bash
# You're currently on feat/react-native-support branch
# Need to merge to main first

git checkout main
git merge feat/react-native-support

# Or commit directly on main
git add packages/core/package.json
git add packages/core/CHANGELOG.md
git add .changeset
git commit -m "chore: bump @use-africa-pay/core to v1.1.1"
git push origin main
```

### Step 3: Create and Push Tag

```bash
git tag v1.1.1
git push origin v1.1.1
```

### Step 4: Watch GitHub Actions

- Go to: https://github.com/idyWilliams/use-africa-pay/actions
- Watch the "Release" workflow run
- It will publish to npm automatically

## Alternative: Manual npm Login

If you want to publish manually instead:

```bash
# Login to npm
npm login

# Publish
cd packages/core
npm publish
```

But GitHub Actions is better because:
- ✅ Automated
- ✅ Consistent
- ✅ Creates GitHub release
- ✅ No need to remember commands

## Current Status

**What You Need to Do**:

1. ✅ Version bumped to 1.1.1
2. ✅ Package built
3. ⏳ Add NPM_TOKEN to GitHub secrets
4. ⏳ Commit changes
5. ⏳ Create git tag
6. ⏳ Push tag → Auto-publish

## Quick Commands

```bash
# 1. Commit version bump
git add .
git commit -m "chore: release v1.1.1"
git push

# 2. Create and push tag
git tag v1.1.1
git push origin v1.1.1

# 3. GitHub Actions does the rest!
```

## Troubleshooting

**"Access token expired"**
→ Run `npm login` first

**"404 Not found"**
→ You need npm token in GitHub secrets

**"Already published"**
→ Version already exists, bump version

## Recommended Workflow

Going forward:

1. Make changes
2. Create changeset: `pnpm changeset`
3. Bump version: `pnpm version`
4. Commit: `git commit -m "chore: release vX.X.X"`
5. Tag: `git tag vX.X.X`
6. Push: `git push --follow-tags`
7. GitHub Actions publishes automatically!

This is the **modern, automated way** to publish npm packages. 🚀
