# Specification: Render Deployment

**Capability**: `render-deployment`  
**Version**: 1.0.0  
**Status**: Proposed

## Overview

Defines the deployment configuration and workflow for hosting the Bingo application as a static site on Render.com, enabling public access without requiring local development server setup.

---

## ADDED Requirements

### Requirement: Git Repository Initialization

The project MUST be version-controlled using Git to enable Render deployment. A `.gitignore` file SHALL exclude development tooling and IDE artifacts from version control.

#### Scenario: Initialize Git repository

**Given** the project directory has no `.git` folder  
**When** git is initialized  
**Then** a `.git` directory is created at the project root  
**And** git tracking is ready for commits

#### Scenario: Exclude development files from version control

**Given** a `.gitignore` file exists at the project root  
**When** files are staged for commit  
**Then** `.opencode/` directory is excluded  
**And** `node_modules/` directories are excluded  
**And** IDE-specific files (`.vscode/`, `.idea/`, `.DS_Store`) are excluded  
**And** environment files (`.env`, `.env.local`) are excluded

---

### Requirement: Render Static Site Configuration

A `render.yaml` configuration file MUST define how Render.com deploys the application as a static site. The configuration SHALL specify the publish path, build command, and service type.

#### Scenario: Define static site service

**Given** a `render.yaml` file exists at the project root  
**When** Render parses the configuration  
**Then** a static site service named "bingo-app" is defined  
**And** the service type is `web` with `staticSite` plan  
**And** the publish path is set to `./bingo-app`  
**And** the build command is empty or `echo "No build required"`

#### Scenario: Enable auto-deploy from main branch

**Given** the `render.yaml` configuration includes a branch reference  
**When** commits are pushed to the main branch  
**Then** Render automatically triggers a new deployment  
**And** the static files from `bingo-app/` are published

#### Scenario: Serve multiple HTML entry points

**Given** both `index.html` and `display.html` exist in `bingo-app/`  
**When** the site is deployed to Render  
**Then** `index.html` is accessible at the root URL  
**And** `display.html` is accessible at `/display.html`  
**And** all assets (CSS, JS) load correctly from subdirectories

---

### Requirement: Deployment Documentation

The `bingo-app/README.md` MUST include clear instructions for deploying the application to Render.com. Documentation SHALL cover prerequisites, step-by-step deployment process, and HTTPS requirements.

#### Scenario: Document Render deployment process

**Given** the `bingo-app/README.md` file  
**When** a user reads the "Deployment to Render" section  
**Then** prerequisites are listed (Git installed, Render account created)  
**And** step-by-step instructions are provided for connecting the repo to Render  
**And** configuration details reference the `render.yaml` file  
**And** post-deployment instructions explain how to access both screens

#### Scenario: Document HTTPS requirement

**Given** the deployment documentation  
**When** a user reads about browser compatibility  
**Then** HTTPS requirement for BroadcastChannel API is explained  
**And** Render's automatic HTTPS provisioning is mentioned  
**And** fallback to localStorage is documented for local development

---

### Requirement: File Structure Organization

The project structure MUST support static site deployment while maintaining development tooling separation. Only files in `bingo-app/` SHALL be published to Render.

#### Scenario: Deployable files are isolated

**Given** the project directory structure  
**When** Render deploys the static site  
**Then** only files in `bingo-app/` are published  
**And** `.opencode/` and `openspec/` directories are not deployed  
**And** configuration files (`render.yaml`, `.gitignore`) are not served publicly

---

## Design Constraints

- **No Build System**: Must deploy raw HTML/CSS/JS files without compilation or bundling
- **Static Site Only**: Cannot use Render's web service type (no backend server)
- **HTTPS Required**: BroadcastChannel API requires secure context (HTTPS)
- **Free Tier Compatible**: Configuration should work on Render's free static site plan
- **Git-Based Deployment**: Render requires Git repository for deployment source

## Related Capabilities

None - this is the first deployment capability for the project.

## Implementation Notes

### Render.yaml Example Structure
```yaml
services:
  - type: web
    name: bingo-app
    runtime: static
    buildCommand: echo "No build required"
    staticPublishPath: ./bingo-app
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### .gitignore Key Patterns
- `.opencode/` - Development tooling
- `node_modules/` - Dependencies (if any added later)
- `.DS_Store` - macOS artifacts
- `.env*` - Environment variables (future-proofing)
- `.idea/`, `.vscode/` - IDE configurations

### Deployment Workflow
1. Developer pushes to main branch
2. Render detects changes via webhook
3. Render reads `render.yaml` configuration
4. Render copies `bingo-app/` directory to static hosting
5. Site is accessible via `https://<service-name>.onrender.com`

## Validation Criteria

- `render.yaml` passes YAML lint validation
- Git repository excludes all development files
- Both HTML entry points are accessible after deployment
- Static assets load correctly (CSS, JS files)
- BroadcastChannel API works over HTTPS
- Documentation accurately reflects deployment process
