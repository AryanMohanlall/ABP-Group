import { test } from "@playwright/test";

const seedAuth = async (page: import("@playwright/test").Page) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "auth_user",
      JSON.stringify({ accessToken: "test-token", userId: 1, expireInSeconds: 3600 })
    );
  });
};

const mockCreateSession = (page: import("@playwright/test").Page) =>
  page.route("**/api/services/app/CodeGen/CreateSession", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        result: {
          id: "session-1",
          userId: 1,
          projectId: null,
          projectName: "my-todo-app",
          prompt: "Build a todo app with authentication and drag-and-drop kanban boards",
          normalizedRequirement: "A todo application with auth and kanban",
          detectedFeatures: ["authentication", "kanban-board", "drag-and-drop"],
          detectedEntities: ["User", "Board", "Card"],
          confirmedStack: null,
          spec: null,
          specConfirmedAt: null,
          generationStartedAt: null,
          generationCompletedAt: null,
          status: 1,
          validationResults: [],
          scaffoldTemplate: "next-ts-antd-prisma",
          generatedFiles: [],
          repairAttempts: 0,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      }),
    })
  );

const mockRecommendStack = (page: import("@playwright/test").Page) =>
  page.route("**/api/services/app/CodeGen/RecommendStack**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        result: {
          framework: "Next.js",
          language: "TypeScript",
          styling: "Ant Design",
          database: "PostgreSQL",
          orm: "Prisma",
          auth: "NextAuth.js",
          reasoning: {
            framework: "Best for SSR and full-stack",
            language: "Type safety for large apps",
            styling: "Rich component library",
            database: "Relational data fits well",
            orm: "Best TypeScript ORM",
            auth: "Seamless Next.js integration",
          },
        },
      }),
    })
  );

const mockSaveStack = (page: import("@playwright/test").Page) =>
  page.route("**/api/services/app/CodeGen/SaveStack", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        result: {
          id: "session-1",
          status: 2,
          confirmedStack: {
            framework: "Next.js",
            language: "TypeScript",
            styling: "Ant Design",
            database: "PostgreSQL",
            orm: "Prisma",
            auth: "NextAuth.js",
            reasoning: {},
          },
        },
      }),
    })
  );
