"use client";

import { useEffect, useState } from "react";
import { Spin, message } from "antd";
import { RocketIcon, ArrowLeftIcon, FileTextIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useCodeGenAction, useCodeGenState } from "@/providers/codegen-provider";
import type { IReadmeResult } from "@/providers/codegen-provider";
import { useStyles } from "./SpecReviewStep.styles";

interface SpecReviewStepProps {
  sessionId: string;
  onConfirm: () => void;
  onBack: () => void;
}

export function SpecReviewStep({ sessionId, onConfirm, onBack }: SpecReviewStepProps) {
  const { styles } = useStyles();
  const { isPending } = useCodeGenState();
  const { generateReadme, confirmReadme } = useCodeGenAction();

  const [readmeResult, setReadmeResult] = useState<IReadmeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    generateReadme(sessionId)
      .then((result) => {
        setReadmeResult(result);
        setLoading(false);
      })
      .catch(() => {
        setLoadError("Failed to generate README. Please retry.");
        message.error("Failed to generate README.");
        setLoading(false);
      });
  }, [generateReadme, sessionId]);

  const handleConfirm = async () => {
    try {
      await confirmReadme(sessionId);
      onConfirm();
    } catch {
      message.error("Failed to confirm README.");
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const result = await generateReadme(sessionId);
      setReadmeResult(result);
    } catch {
      setLoadError("Failed to generate README. Please retry.");
      message.error("Failed to generate README.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrap}>
          <Spin size="large" />
          <span className={styles.loadingText}>
            AI is generating a comprehensive README document...
          </span>
          <span className={styles.loadingText}>This may take a moment.</span>
        </div>
      </div>
    );
  }

  if (!readmeResult) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrap}>
          <span className={styles.loadingText}>{loadError || "README is unavailable."}</span>
          <div className={styles.actionRow}>
            <button type="button" className={styles.backButton} onClick={onBack}>
              Back
            </button>
            <button type="button" className={styles.confirmButton} onClick={handleRetry}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <FileTextIcon size={24} />
        </div>
        <h2 className={styles.title}>Review Application Spec</h2>
        <p className={styles.subtitle}>
          Review the AI-generated README below. A structured build plan is derived from this exact README and reused during scaffolding and generation.
        </p>
      </div>

      {readmeResult.summary && (
        <motion.div
          className={styles.summaryCard}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className={styles.summaryTitle}>Summary</h3>
          <p className={styles.summaryText}>{readmeResult.summary}</p>
        </motion.div>
      )}

      {readmeResult.plan && (
        <motion.div
          className={styles.summaryCard}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <h3 className={styles.summaryTitle}>Plan Snapshot</h3>
          <p className={styles.summaryText}>
            {readmeResult.plan.entities?.length ?? 0} entities, {readmeResult.plan.pages?.length ?? 0} pages,{" "}
            {readmeResult.plan.apiRoutes?.length ?? 0} API routes, and{" "}
            {(readmeResult.plan.dependencyPlan?.dependencies ?? []).filter((dependency) => !dependency.isExisting).length} planned package additions.
          </p>
        </motion.div>
      )}

      <motion.div
        className={styles.readmeCard}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className={styles.readmeHeader}>
          <FileTextIcon size={16} />
          <span>README.md</span>
        </div>
        <div className={styles.readmeContent}>
          <pre className={styles.readmePre}>{readmeResult.readmeMarkdown}</pre>
        </div>
      </motion.div>

      <div className={styles.actionRow}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowLeftIcon size={16} />
          Back
        </button>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? <Spin size="small" /> : <RocketIcon size={16} />}
          Approve & Generate
        </button>
      </div>
    </div>
  );
}
