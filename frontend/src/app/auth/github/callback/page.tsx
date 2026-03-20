"use client";

import { Suspense, useEffect, useState } from "react";
import { setAuthToken } from "@/utils/axiosInstance";

const AUTH_USER_KEY = "auth_user";
const GITHUB_OAUTH_COMPLETE_KEY = "github_oauth_complete";

function GitHubCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const userId = params.get("userId");
    const expireInSeconds = params.get("expireInSeconds");

    if (!accessToken || !userId) {
      setError(
        "GitHub sign-in failed: missing or invalid OAuth parameters. Please try again."
      );
      return;
    }

    setAuthToken(accessToken);

    sessionStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({
        userId: Number(userId),
        accessToken,
        expireInSeconds: Number(expireInSeconds ?? 86400),
      })
    );

    sessionStorage.setItem(GITHUB_OAUTH_COMPLETE_KEY, "true");

    // Full page navigation so AuthProvider re-bootstraps with the updated sessionStorage.
    // Client-side router.replace would skip the bootstrap useEffect since AuthProvider is already mounted.
    window.location.replace("/dashboard");
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#ef4444", fontWeight: 600, maxWidth: 440 }}>
          {error}
        </p>
        <a
          href="/login"
          style={{ color: "#6366f1", textDecoration: "underline" }}
        >
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      Signing you in…
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense>
      <GitHubCallback />
    </Suspense>
  );
}
