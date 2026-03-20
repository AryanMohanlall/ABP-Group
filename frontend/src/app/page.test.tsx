import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PromptForgeLanding from "./page";

vi.mock("next/image", () => ({
  default: () => <img alt="mock" />
}));

describe("Landing Page", () => {
  it("renders the Generate App CTA linking to /generate", () => {
    render(<PromptForgeLanding />);
    
    // An element with text "Generate App" inside a link going to /generate
    const generateLinks = screen.getAllByRole("link");
    const generateLink = generateLinks.find(l => l.getAttribute("href") === "/generate");
    
    expect(generateLink).toBeTruthy();
    expect(generateLink?.textContent).toContain("Generate App");
  });
});
