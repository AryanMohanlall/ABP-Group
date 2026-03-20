import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const routerReplaceMock = vi.fn();
const setAuthTokenMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: routerReplaceMock }),
}));

vi.mock("@/utils/axiosInstance", () => ({
  setAuthToken: setAuthTokenMock,
}));

import GitHubCallbackPage from "./page";

function setUrlParams(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  Object.defineProperty(window, "location", {
    writable: true,
    value: { ...window.location, search: qs ? `?${qs}` : "" },
  });
}

describe("GitHubCallbackPage", () => {
  beforeEach(() => {
    routerReplaceMock.mockReset();
    setAuthTokenMock.mockReset();
    sessionStorage.clear();
  });

  it("redirects to /dashboard and stores auth + oauth marker on valid params", () => {
    setUrlParams({ token: "abc-123", userId: "7", expireInSeconds: "3600" });

    render(<GitHubCallbackPage />);

    expect(setAuthTokenMock).toHaveBeenCalledWith("abc-123");

    const stored = JSON.parse(sessionStorage.getItem("auth_user")!);
    expect(stored.userId).toBe(7);
    expect(stored.accessToken).toBe("abc-123");
    expect(stored.expireInSeconds).toBe(3600);

    expect(sessionStorage.getItem("github_oauth_complete")).toBe("true");

    expect(routerReplaceMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows error state when token is missing", () => {
    setUrlParams({ userId: "7" });

    render(<GitHubCallbackPage />);

    expect(screen.getByText(/missing or invalid OAuth parameters/i)).toBeInTheDocument();
    expect(routerReplaceMock).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("github_oauth_complete")).toBeNull();
  });

  it("shows error state when userId is missing", () => {
    setUrlParams({ token: "abc-123" });

    render(<GitHubCallbackPage />);

    expect(screen.getByText(/missing or invalid OAuth parameters/i)).toBeInTheDocument();
    expect(routerReplaceMock).not.toHaveBeenCalled();
  });

  it("shows error state when all params are missing", () => {
    setUrlParams({});

    render(<GitHubCallbackPage />);

    expect(screen.getByText(/missing or invalid OAuth parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to login/i)).toBeInTheDocument();
  });

  it("defaults expireInSeconds to 86400 when not provided", () => {
    setUrlParams({ token: "abc-123", userId: "7" });

    render(<GitHubCallbackPage />);

    const stored = JSON.parse(sessionStorage.getItem("auth_user")!);
    expect(stored.expireInSeconds).toBe(86400);
    expect(routerReplaceMock).toHaveBeenCalledWith("/dashboard");
  });
});
