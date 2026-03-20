# PromptForge MVP Issue Plan on `deploy/codegen-gemini`

## Summary
- Use the current branch as the implementation base. It already contains the Gemini codegen flow, `/generate`, session persistence, GitHub OAuth callback, and Vercel deployment hooks.
- Goal for today: complete the MVP must-haves from the spec, not rebuild the platform.
- Canonical user flow: `GitHub sign in -> /generate -> review output -> repo commit/deploy -> dashboard/history -> live URL`.

## Issues

1. **Issue: Harden GitHub Auth and Connection State**
Goal: make GitHub sign-in real, consistent, and safe.
Implement: keep the query-parameter callback flow as the branch standard; remove reliance on legacy cookie handoff; ensure the frontend only marks GitHub as connected after a real OAuth callback/bootstrap, not from local session shortcuts.
Acceptance: a user cannot create/deploy a project unless OAuth has completed; callback lands in an authenticated dashboard state; missing/invalid OAuth params show a clear error state.
Depends on: none.

2. **Issue: Make `/generate` the Single Builder Flow**
Goal: align the app to one clear Product Builder journey.
Implement: use `/generate` as the primary entry from landing and authenticated navigation; keep `/create-project` as a redirect or thin wrapper; ensure the flow collects the MVP inputs from the spec: prompt, project category, template, stack choice, deployment target, and repo visibility.
Acceptance: every “start building” CTA reaches `/generate`; the builder can supply all required MVP inputs without leaving the flow.
Depends on: Issue 1 for GitHub gating.

3. **Issue: Tie CodeGen Sessions to Real Projects and Version History**
Goal: make generated work traceable and reopenable.
Implement: ensure a real `Project` exists for each generation run; persist `session.projectId`; use `promptVersion` for refinements; keep prior prompts as version history for the same project instead of creating disconnected records.
Acceptance: generation, reopen, refinement, and dashboard history all resolve to the same persisted project id; reruns increment version cleanly.
Depends on: Issue 2.

4. **Issue: Persist Repository and Deployment Metadata on Projects**
Goal: move repo/deploy state out of transient UI state and into backend truth.
Implement: extend the existing project contract with persisted fields for repository name/full name, repo URL, visibility, branch, commit SHA, deployment target, deployment id/state, deployment error, live URL, and compact job log/history text.
Acceptance: refreshing the app or reopening from the dashboard still shows the correct repo, deployment status, and live URL.
Depends on: Issue 3.

5. **Issue: Make Backend Status Transitions Authoritative**
Goal: ensure codegen, repo push, deployment, success, and failure states come from the backend lifecycle.
Implement: update codegen and GitHub/deployment controllers so project status moves through prompt submitted, generating, generated, repository push in progress, deployed, and failed; persist useful `statusMessage` and failure details at each stage.
Acceptance: the frontend can render progress and failure states using only backend project/session data; deployment success updates the project to `Deployed` with a live URL.
Depends on: Issue 4.

6. **Issue: Complete the Output Review and History UX**
Goal: satisfy the spec’s review and developer-history requirements.
Implement: on the generation/result surfaces show generated summary, architecture snapshot, module list, repo link, deployment status/log, and final live link; on the dashboard show reopen-by-id, history, failed-state visibility, and refinement rerun.
Acceptance: a developer can inspect prior runs, reopen the correct project, see its repo/deploy outcome, and rerun generation with a refinement prompt.
Depends on: Issues 3, 4, and 5.

7. **Issue: Deliver Admin-Lite Monitoring for the MVP**
Goal: cover the administrator use cases without building a full admin console.
Implement: keep templates management on the existing templates surface; expose failed-build and deployment monitoring through persisted status/error/log visibility and dashboard filters; add a lightweight deployment/config diagnostics view if needed.
Acceptance: an admin can see which runs failed, inspect why they failed, and manage templates used by the builder flow.
Depends on: Issues 4, 5, and 6.

8. **Issue: Fix the Frontend Test Harness and E2E Runtime**
Goal: restore reliable verification on this branch.
Implement: fix the Vitest startup/config issue so unit tests actually execute; make Playwright use a deterministic server startup path so tests do not fail on `.next/dev/lock` or port drift; ignore or clean ephemeral test artifacts like `frontend/test-results/.last-run.json`.
Acceptance: frontend unit tests run, targeted Playwright suites run repeatedly without manual port/process cleanup, and test output files do not pollute product changes.
Depends on: can start in parallel, but should finish before final verification.

9. **Issue: Final MVP Verification and Fallback Rule**
Goal: have a clear ship/no-ship decision by 5:00 PM.
Implement: run the happy path for GitHub sign-in, prompt submission, category/template selection, generation, architecture review, repo creation/commit, deployment, dashboard reopen, refinement rerun, and live URL open; if real deploy is still blocked by 3:30 PM, switch to a simulated-preview fallback while keeping persisted status/log/live-result behavior intact.
Acceptance: by 5:00 PM the team can demo either the full real path or the approved fallback path with all must-have status/history surfaces working.
Depends on: Issues 1 through 8.

## Test Scenarios
- GitHub callback succeeds and fails cleanly.
- `/generate` collects all required MVP inputs.
- Generation produces a persisted project id and reviewable output.
- Repo create/commit updates the same project record.
- Deployment success writes a live URL; deployment failure writes a visible error/log.
- Dashboard reopens the correct project and shows history/refinement state.
- Vitest and targeted Playwright suites run successfully on this branch.

## Assumptions
- `deploy/codegen-gemini` is the delivery branch for today.
- Existing `Project`, `Prompt`, `CodeGenSession`, and `Template` models are sufficient for the MVP if extended.
- Full first-class entities like `BuildJobs`, `Deployments`, and `DeploymentLogs` remain deferred unless they become necessary to satisfy persistence gaps uncovered during implementation.
- The only out-of-scope items for today are stretch features: branch-per-version, preview environments, quality scoring, and a template marketplace.
