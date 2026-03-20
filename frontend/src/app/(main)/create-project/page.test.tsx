import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import CreateProject from "./page";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CreateProject Page", () => {
  it("redirects to /generate on mount", () => {
    const replaceMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ replace: replaceMock } as any);
    
    render(<CreateProject />);
    
    expect(replaceMock).toHaveBeenCalledWith("/generate");
  });
});
