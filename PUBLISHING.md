# Publishing Guide

This guide explains how to publish the `@use-africa-pay/core` package to npm.

## Prerequisites

1.  **NPM Account**: Ensure you have an account on [npmjs.com](https://www.npmjs.com/).
2.  **Login**: Login to npm in your terminal:
    ```bash
    npm login
    # Follow the prompts to authenticate
    ```

## Manual Publishing

### 1. Build the Project

Ensure the project is built and free of errors:

```bash
pnpm build
```

### 2. Update Version

Update the version number in `packages/core/package.json`. You should follow [Semantic Versioning](https://semver.org/):

-   **Patch** (0.0.x): Bug fixes
-   **Minor** (0.x.0): New features (backward compatible)
-   **Major** (x.0.0): Breaking changes

```bash
# Example: Bump version manually in package.json
# "version": "0.0.2"
```

### 3. Publish

Navigate to the core package directory and publish:

```bash
cd packages/core
pnpm publish --access public --no-git-checks
```

> **Note**: `--access public` is required for scoped packages (like `@use-africa-pay/core`) unless you have a paid npm organization.
> **Note**: `--no-git-checks` might be needed if you haven't committed changes yet, but it's recommended to commit first.

## Automating with GitHub Actions

**Automation is now set up!**

### 1. Get the Correct NPM Token
Since Legacy tokens are deprecated, you must create a **Granular Access Token** with specific settings:

1.  Go to [npmjs.com](https://www.npmjs.com/) -> **Access Tokens** -> **Generate New Token**.
2.  Select **Granular Access Token**.
3.  **Name**: `github-action-automation`
4.  **Expiration**: Set to maximum (e.g., 365 days).
5.  **Packages and Scopes**:
    -   Select **Read and write** access.
    -   Select **Only select packages and scopes**.
    -   Choose your organization (`use-africa-pay`) or specific package.
6.  **Organizations**: Select your organization (`use-africa-pay`) with **Read and write** access.
7.  **IMPORTANT**: Under "Security", check the box **"Bypass 2FA requirements"**.
    -   *This is critical for CI/CD. If unchecked, the build will fail with an OTP error.*
8.  Generate the token and copy it.

### 2. Add to GitHub Secrets
1.  Go to your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions**.
2.  Update `NPM_TOKEN` with the new token string.

### 3. Trigger a Release
To publish a new version automatically:

1.  **Update Version**: Bump the version in `packages/core/package.json` (e.g., to `0.0.3`) and commit it.
    ```bash
    git add .
    git commit -m "chore: bump version to 0.0.3"
    git push origin main
    ```
2.  **Create a Release**:
    -   Go to your GitHub repository.
    -   Click "Releases" -> "Draft a new release".
    -   Tag version: `v0.0.3`.
    -   Title: `v0.0.3`.
    -   Click **Publish release**.

The GitHub Action will automatically build and publish your package to npm! 🚀
