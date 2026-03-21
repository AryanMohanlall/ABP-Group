import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import CreateProject from "./page";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
  useRouter: vi.fn(),
}));

describe("CreateProject Page", () => {
  it("redirects to /generate on mount", () => {
    const replaceMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      replace: replaceMock,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      push: vi.fn(),
      prefetch: vi.fn(),
    } as ReturnType<typeof useRouter>);

    render(<CreateProject />);

    expect(replaceMock).toHaveBeenCalledWith("/generate");
  });
});