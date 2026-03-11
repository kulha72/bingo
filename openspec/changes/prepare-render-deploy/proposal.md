# Proposal: Prepare for Render Deploy

**Change ID**: `prepare-render-deploy`  
**Status**: Proposed  
**Created**: 2026-01-06

## Problem Statement

The Bingo application is currently a local-only web application that requires manual setup with Python's HTTP server. There is no deployment configuration, no git repository, and no way to share the application publicly or host it on a cloud platform like Render.com.

To make the application accessible to users without requiring local setup, we need to prepare it for deployment as a static site on Render.com.

## Proposed Solution

Configure the project for deployment on Render.com as a static site, which involves:

1. **Initialize Git repository** - Required by Render for deployment
2. **Create Render configuration** - Add `render.yaml` to define the static site service
3. **Add deployment documentation** - Update README with deployment instructions
4. **Create .gitignore** - Exclude unnecessary files from version control

This solution maintains the project's "no build system" constraint by deploying the vanilla HTML/CSS/JS files directly as a static site.

## Capabilities Affected

- **New**: `render-deployment` - Static site deployment configuration for Render.com

## User-Visible Changes

- Users will be able to deploy the Bingo app to Render.com with a single command
- The app will be publicly accessible via a Render URL
- Documentation will include deployment instructions
- Project will be version-controlled with Git

## Technical Approach

### Render Configuration
- Create `render.yaml` defining a static site service
- Specify `bingo-app/` as the publish directory
- Configure index.html as the entry point
- Use Render's free static site hosting tier

### Git Setup
- Initialize repository at project root
- Create comprehensive `.gitignore` for Node.js and IDE files
- Exclude `.opencode/` directory (development tooling)

### Documentation Updates
- Add "Deployment" section to `bingo-app/README.md`
- Include step-by-step Render deployment instructions
- Document environment setup requirements

## Risks & Mitigations

**Risk**: BroadcastChannel API may not work across different browser windows if served over HTTP (not HTTPS)
**Mitigation**: Render provides HTTPS by default; document fallback to localStorage for local development

**Risk**: Git initialization might conflict with existing workflows
**Mitigation**: No existing git repo, so this is a clean slate; add comprehensive .gitignore

**Risk**: Multiple entry points (index.html and display.html) might confuse deployment
**Mitigation**: Both files are in the same directory; document that users should bookmark both URLs

## Dependencies

None - this is a standalone change.

## Open Questions

None - the requirements are clear and the solution is straightforward.

## Success Criteria

- [ ] Git repository initialized successfully
- [ ] `render.yaml` validates with Render's schema
- [ ] Static files can be served correctly from `bingo-app/` directory
- [ ] Both `index.html` and `display.html` are accessible
- [ ] Documentation clearly explains deployment process
- [ ] `.gitignore` prevents committing unnecessary files
