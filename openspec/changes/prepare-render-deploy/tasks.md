# Tasks: Prepare for Render Deploy

**Change ID**: `prepare-render-deploy`

## Task List

### 1. Git Initialization
- [x] 1.1 Create `.gitignore` file at project root with patterns for Node.js, IDEs, and `.opencode/`
- [x] 1.2 Initialize git repository with `git init`
- [x] 1.3 Verify `.gitignore` excludes correct files with `git status`

### 2. Render Configuration
- [x] 2.1 Create `render.yaml` at project root with static site service definition
- [x] 2.2 Configure `publishPath` to point to `bingo-app/` directory
- [x] 2.3 Add appropriate build command (none needed for static site)
- [x] 2.4 Validate YAML syntax and structure

### 3. Documentation
- [x] 3.1 Add "Deployment to Render" section in `bingo-app/README.md`
- [x] 3.2 Include prerequisites (git, Render account)
- [x] 3.3 Document step-by-step deployment process
- [x] 3.4 Add notes about HTTPS requirement for BroadcastChannel API
- [x] 3.5 Include example URLs for both screens (index.html and display.html)

### 4. Validation
- [x] 4.1 Verify all files are properly tracked/ignored by git
- [x] 4.2 Test that `render.yaml` follows Render's static site schema
- [x] 4.3 Run `openspec validate prepare-render-deploy --strict`
- [x] 4.4 Ensure no sensitive files are included in git

## Task Dependencies

- Task 2 (Render Configuration) can run in parallel with Task 1 (Git Initialization)
- Task 3 (Documentation) depends on Task 2 being complete (need final config to document)
- Task 4 (Validation) must run after all other tasks

## Estimated Effort

- Git Initialization: 5 minutes
- Render Configuration: 10 minutes
- Documentation: 15 minutes
- Validation: 5 minutes
- **Total**: ~35 minutes
