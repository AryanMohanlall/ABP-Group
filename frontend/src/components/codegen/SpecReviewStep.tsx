"use client";

import { useEffect, useState } from "react";
import {
  Skeleton,
  Spin,
  message,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Space,
  Button,
  Divider,
  Tooltip,
} from "antd";
import {
  RocketIcon,
  ArrowLeftIcon,
  FileTextIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  DatabaseIcon,
  MonitorIcon,
  ServerIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useCodeGenAction,
  useCodeGenState,
} from "@/providers/codegen-provider";
import type {
  IReadmeResult,
  IAppSpec,
  IEntitySpec,
  IPageSpec,
  IApiRouteSpec,
} from "@/providers/codegen-provider";
import { useStyles } from "./SpecReviewStep.styles";

interface SpecReviewStepProps {
  sessionId: string;
  onConfirm: () => void;
  onBack: () => void;
}

const LOADING_STAGES = [
  {
    title: "Drafting the README",
    description: "Turning your prompt and selected stack into a clear application brief.",
  },
  {
    title: "Deriving the build plan",
    description: "Recovering entities, routes, APIs, and package needs from that README.",
  },
  {
    title: "Preparing the review",
    description: "Organizing everything into a preview you can sanity-check before generation.",
  },
];

const AI_THOUGHTS = [
  "Inference in progress...",
  "Detecting data relationships...",
  "Normalizing API patterns...",
  "Calculating dependency tree...",
  "Defining security boundaries...",
  "Optimizing page layouts...",
  "Wiring up event handlers...",
  "Ensuring type safety...",
  "Mapping navigation flow...",
  "Polishing the brief...",
];

function isNonEmpty(value: string | null | undefined): value is string {
  return Boolean(value && value.trim());
}

function describeCount(
  count: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function buildPlanHeadline(result: IReadmeResult | null): string {
  const plan = result?.plan;
  if (!plan) {
    return "";
  }

  const packageCount = [
    ...(plan.dependencyPlan?.dependencies ?? []),
    ...(plan.dependencyPlan?.devDependencies ?? []),
  ].filter((dependency) => !dependency.isExisting).length;

  return [
    describeCount(plan.entities.length, "entity"),
    describeCount(plan.pages.length, "page"),
    describeCount(plan.apiRoutes.length, "API route"),
    describeCount(packageCount, "package addition"),
  ].join(", ");
}

function buildPlannedPackages(result: IReadmeResult | null) {
  const plan = result?.plan;
  if (!plan) {
    return [];
  }

  return [
    ...(plan.dependencyPlan?.dependencies ?? []).map((dependency) => ({
      ...dependency,
      kind: "runtime",
    })),
    ...(plan.dependencyPlan?.devDependencies ?? []).map((dependency) => ({
      ...dependency,
      kind: "dev",
    })),
  ].filter(
    (dependency) => !dependency.isExisting && isNonEmpty(dependency.name),
  );
}

export function SpecReviewStep({
  sessionId,
  onConfirm,
  onBack,
}: SpecReviewStepProps) {
  const { styles, cx } = useStyles();
  const { isPending } = useCodeGenState();
  const { generateReadme, confirmReadme, saveSpec } = useCodeGenAction();

  const [readmeResult, setReadmeResult] = useState<IReadmeResult | null>(null);
  const [editablePlan, setEditablePlan] = useState<IAppSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [currentThought, setCurrentThought] = useState(AI_THOUGHTS[0]);

  // Modal states
  const [entityModalVisible, setEntityModalVisible] = useState(false);
  const [pageModalVisible, setPageModalVisible] = useState(false);
  const [apiModalVisible, setApiModalVisible] = useState(false);

  // Editing states
  const [editingEntity, setEditingEntity] = useState<IEntitySpec | null>(null);
  const [editingPage, setEditingPage] = useState<IPageSpec | null>(null);
  const [editingApi, setEditingApi] = useState<IApiRouteSpec | null>(null);

  const [form] = Form.useForm();

  const plan = editablePlan || readmeResult?.plan || null;
  const planHeadline = buildPlanHeadline({ ...readmeResult!, plan });
  const plannedPackages = buildPlannedPackages({ ...readmeResult!, plan });

  const entityPreview = plan?.entities ?? [];
  const pagePreview = plan?.pages ?? [];
  const apiPreview = plan?.apiRoutes ?? [];
  const packagePreview = plannedPackages;

  const hasHomePage = pagePreview.some((page) => page.route === "/");

  const previewMetrics = plan
    ? [
        {
          label: "Entities",
          value: plan.entities.length.toString(),
          detail:
            plan.entities.length > 0
              ? "Core data objects inferred from the README."
              : "No persistent entities planned yet.",
        },
        {
          label: "Pages",
          value: plan.pages.length.toString(),
          detail: hasHomePage
            ? "Includes a root homepage route."
            : "Homepage route still needs attention.",
        },
        {
          label: "API Routes",
          value: plan.apiRoutes.length.toString(),
          detail:
            plan.apiRoutes.length > 0
              ? "Backend endpoints the app expects."
              : "Client-side flow with no backend routes planned.",
        },
        {
          label: "Packages",
          value: plannedPackages.length.toString(),
          detail:
            plannedPackages.length > 0
              ? "New packages that scaffolding may add."
              : "No extra packages planned beyond the scaffold.",
        },
      ]
    : [];

  useEffect(() => {
    generateReadme(sessionId)
      .then((result) => {
        setReadmeResult(result);
        if (result.plan) {
          setEditablePlan(result.plan);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoadError("Failed to generate README. Please retry.");
        message.error("Failed to generate README.");
        setLoading(false);
      });
  }, [generateReadme, sessionId]);

  useEffect(() => {
    if (!loading) {
      setLoadingStageIndex(0);
      return;
    }

    const stageInterval = window.setInterval(() => {
      setLoadingStageIndex((current) => (current + 1) % LOADING_STAGES.length);
    }, 2800);

    const thoughtInterval = window.setInterval(() => {
      setCurrentThought(AI_THOUGHTS[Math.floor(Math.random() * AI_THOUGHTS.length)]);
    }, 1200);

    return () => {
      window.clearInterval(stageInterval);
      window.clearInterval(thoughtInterval);
    };
  }, [loading]);

  // ─── Entity Handlers ───────────────────────────────────────────────────────

  const handleAddEntity = () => {
    setEditingEntity(null);
    form.resetFields();
    form.setFieldsValue({ fields: [{ name: "id", type: "string", required: true }] });
    setEntityModalVisible(true);
  };

  const handleEditEntity = (entity: IEntitySpec) => {
    setEditingEntity(entity);
    form.setFieldsValue(entity);
    setEntityModalVisible(true);
  };

  const handleDeleteEntity = (entityName: string) => {
    if (!editablePlan) return;
    const newEntities = editablePlan.entities.filter((e) => e.name !== entityName);
    const newPlan = { ...editablePlan, entities: newEntities };
    setEditablePlan(newPlan);
    message.success(`Entity "${entityName}" removed.`);
  };

  const handleEntityModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!editablePlan) return;

      let newEntities: IEntitySpec[];
      if (editingEntity) {
        newEntities = editablePlan.entities.map((e) =>
          e.name === editingEntity.name ? { ...e, ...values } : e
        );
      } else {
        if (editablePlan.entities.some((e) => e.name === values.name)) {
          message.error("An entity with this name already exists.");
          return;
        }
        newEntities = [...editablePlan.entities, { ...values, relations: [], tableName: values.name.toLowerCase() }];
      }

      setEditablePlan({ ...editablePlan, entities: newEntities });
      setEntityModalVisible(false);
    } catch (_err) {
      // Validation failed
    }
  };

  // ─── Page Handlers ─────────────────────────────────────────────────────────

  const handleAddPage = () => {
    setEditingPage(null);
    form.resetFields();
    form.setFieldsValue({ layout: "authenticated" });
    setPageModalVisible(true);
  };

  const handleEditPage = (page: IPageSpec) => {
    setEditingPage(page);
    form.setFieldsValue(page);
    setPageModalVisible(true);
  };

  const handleDeletePage = (route: string) => {
    if (!editablePlan) return;
    const newPages = editablePlan.pages.filter((p) => p.route !== route);
    setEditablePlan({ ...editablePlan, pages: newPages });
    message.success(`Page route "${route}" removed.`);
  };

  const handlePageModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!editablePlan) return;

      let newPages: IPageSpec[];
      if (editingPage) {
        newPages = editablePlan.pages.map((p) =>
          p.route === editingPage.route ? { ...p, ...values } : p
        );
      } else {
        if (editablePlan.pages.some((p) => p.route === values.route)) {
          message.error("A page with this route already exists.");
          return;
        }
        newPages = [...editablePlan.pages, { ...values, components: [], dataRequirements: [] }];
      }

      setEditablePlan({ ...editablePlan, pages: newPages });
      setPageModalVisible(false);
    } catch (_err) {}
  };

  // ─── API Route Handlers ────────────────────────────────────────────────────

  const handleAddApi = () => {
    setEditingApi(null);
    form.resetFields();
    form.setFieldsValue({ method: "GET", auth: true });
    setApiModalVisible(true);
  };

  const handleEditApi = (api: IApiRouteSpec) => {
    setEditingApi(api);
    form.setFieldsValue(api);
    setApiModalVisible(true);
  };

  const handleDeleteApi = (method: string, path: string) => {
    if (!editablePlan) return;
    const newApis = editablePlan.apiRoutes.filter((a) => !(a.method === method && a.path === path));
    setEditablePlan({ ...editablePlan, apiRoutes: newApis });
    message.success(`API endpoint "${method} ${path}" removed.`);
  };

  const handleApiModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!editablePlan) return;

      let newApis: IApiRouteSpec[];
      if (editingApi) {
        newApis = editablePlan.apiRoutes.map((a) =>
          a.method === editingApi.method && a.path === editingApi.path ? { ...a, ...values } : a
        );
      } else {
        if (editablePlan.apiRoutes.some((a) => a.method === values.method && a.path === values.path)) {
          message.error("An API route with this method and path already exists.");
          return;
        }
        newApis = [...editablePlan.apiRoutes, { ...values, handler: "", responseShape: {} }];
      }

      setEditablePlan({ ...editablePlan, apiRoutes: newApis });
      setApiModalVisible(false);
    } catch (_err) {}
  };

  const handleConfirm = async () => {
    try {
      if (editablePlan) {
        // Save the manual changes back to the session before confirming
        await saveSpec(sessionId, editablePlan);
      }
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
      if (result.plan) {
        setEditablePlan(result.plan);
      }
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
        <div className={styles.loadingCard}>
          <div className={styles.loadingStageRow}>
            <Spin size="large" />
            <div className={styles.loadingStageCopy}>
              <span className={styles.loadingEyebrow}>
                Preparing your review
              </span>
              <motion.span 
                key={loadingStageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.loadingTitle}
              >
                {LOADING_STAGES[loadingStageIndex]?.title}
              </motion.span>
              <motion.span 
                key={currentThought}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.loadingText}
              >
                <span className={styles.loadingSparkle}>✨</span> {currentThought}
              </motion.span>
            </div>
          </div>

          <div className={styles.loadingTimeline}>
            {LOADING_STAGES.map((stage, index) => {
              const stateClassName =
                index === loadingStageIndex
                  ? styles.loadingStageActive
                  : index < loadingStageIndex
                    ? styles.loadingStageComplete
                    : styles.loadingStagePending;

              return (
                <div
                  key={stage.title}
                  className={styles.loadingStageContainer}
                >
                  <div className={`${styles.loadingStagePill} ${stateClassName}`} />
                  <span className={cx(styles.loadingStageLabel, stateClassName === styles.loadingStageActive && styles.loadingStageLabelActive)}>
                    {stage.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.loadingPreviewGrid}>
            {[0, 1, 2].map((cardIndex) => (
              <div key={cardIndex} className={styles.loadingPreviewCard}>
                <Skeleton
                  active
                  title={{ width: cardIndex === 0 ? "45%" : "55%" }}
                  paragraph={{ rows: cardIndex === 2 ? 4 : 3 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!readmeResult) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrap}>
          <span className={styles.loadingText}>
            {loadError || "README is unavailable."}
          </span>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleRetry}
            >
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
          Review the AI-generated README below. A structured build plan is
          derived from this exact README and reused during scaffolding and
          generation.
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
          className={styles.planCard}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className={styles.planHeader}>
            <div className={styles.planHeaderCopy}>
              <h3 className={styles.summaryTitle}>Plan Preview</h3>
              <p className={styles.summaryText}>
                {planHeadline}. This preview is generated from the approved
                README and becomes the implementation plan we scaffold from.
              </p>
            </div>
            <span className={styles.planStatusBadge}>
              {hasHomePage ? "Homepage included" : "Homepage missing"}
            </span>
          </div>

          <div className={styles.metricGrid}>
            {previewMetrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricDetail}>{metric.detail}</span>
              </div>
            ))}
          </div>

          <div className={styles.previewGrid}>
            <div className={styles.previewSection}>
              <div className={styles.previewSectionHeader}>
                <DatabaseIcon size={16} color="#2dd4a8" />
                <h4 className={styles.previewSectionTitle}>Entities</h4>
                <div style={{ flex: 1 }} />
                <Button
                  size="small"
                  type="text"
                  icon={<PlusIcon size={14} />}
                  onClick={handleAddEntity}
                  style={{ color: "#2dd4a8" }}
                >
                  Add
                </Button>
              </div>
              {entityPreview.length > 0 ? (
                <div className={styles.previewList}>
                  {entityPreview.map((entity) => {
                    const fieldNames = entity.fields
                      .map((field) => field.name)
                      .filter(isNonEmpty)
                      .slice(0, 4)
                      .join(", ");

                    return (
                      <div key={entity.name} className={styles.previewListItem}>
                        <div className={styles.previewItemRow}>
                          <span className={styles.previewItemPrimary}>
                            {entity.name}
                          </span>
                          <Space size={4}>
                            <Tooltip title="Edit">
                              <Button
                                size="small"
                                type="text"
                                icon={<PencilIcon size={12} />}
                                onClick={() => handleEditEntity(entity)}
                                style={{ color: "#8b95a2" }}
                              />
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                size="small"
                                type="text"
                                icon={<Trash2Icon size={12} />}
                                onClick={() => handleDeleteEntity(entity.name)}
                                style={{ color: "#ff4d4f" }}
                              />
                            </Tooltip>
                            <span className={styles.previewBadge}>
                              {describeCount(entity.fields.length, "field")}
                            </span>
                          </Space>
                        </div>
                        <span className={styles.previewItemSecondary}>
                          {fieldNames ||
                            "Fields will be refined during generation."}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.emptyState}>
                  No persistent entities are planned yet.
                </p>
              )}
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewSectionHeader}>
                <MonitorIcon size={16} color="#2dd4a8" />
                <h4 className={styles.previewSectionTitle}>Pages</h4>
                <div style={{ flex: 1 }} />
                <Button
                  size="small"
                  type="text"
                  icon={<PlusIcon size={14} />}
                  onClick={handleAddPage}
                  style={{ color: "#2dd4a8" }}
                >
                  Add
                </Button>
              </div>
              {pagePreview.length > 0 ? (
                <div className={styles.previewList}>
                  {pagePreview.map((page) => (
                    <div
                      key={`${page.route}-${page.name}`}
                      className={styles.previewListItem}
                    >
                      <div className={styles.previewItemRow}>
                        <span className={styles.previewItemPrimary}>
                          {page.route}
                        </span>
                        <Space size={4}>
                          <Tooltip title="Edit">
                            <Button
                              size="small"
                              type="text"
                              icon={<PencilIcon size={12} />}
                              onClick={() => handleEditPage(page)}
                              style={{ color: "#8b95a2" }}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              size="small"
                              type="text"
                              icon={<Trash2Icon size={12} />}
                              onClick={() => handleDeletePage(page.route)}
                              style={{ color: "#ff4d4f" }}
                            />
                          </Tooltip>
                          <span className={styles.previewBadge}>
                            {page.layout}
                          </span>
                        </Space>
                      </div>
                      <span className={styles.previewItemSecondary}>
                        {page.description || `${page.name} page`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No pages are planned yet.</p>
              )}
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewSectionHeader}>
                <ServerIcon size={16} color="#2dd4a8" />
                <h4 className={styles.previewSectionTitle}>API Routes</h4>
                <div style={{ flex: 1 }} />
                <Button
                  size="small"
                  type="text"
                  icon={<PlusIcon size={14} />}
                  onClick={handleAddApi}
                  style={{ color: "#2dd4a8" }}
                >
                  Add
                </Button>
              </div>
              {apiPreview.length > 0 ? (
                <div className={styles.previewList}>
                  {apiPreview.map((route) => (
                    <div
                      key={`${route.method}-${route.path}`}
                      className={styles.previewListItem}
                    >
                      <div className={styles.previewItemRow}>
                        <span className={styles.previewItemPrimary}>
                          {route.method} {route.path}
                        </span>
                        <Space size={4}>
                          <Tooltip title="Edit">
                            <Button
                              size="small"
                              type="text"
                              icon={<PencilIcon size={12} />}
                              onClick={() => handleEditApi(route)}
                              style={{ color: "#8b95a2" }}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              size="small"
                              type="text"
                              icon={<Trash2Icon size={12} />}
                              onClick={() => handleDeleteApi(route.method, route.path)}
                              style={{ color: "#ff4d4f" }}
                            />
                          </Tooltip>
                          <span className={styles.previewBadge}>
                            {route.auth ? "auth" : "public"}
                          </span>
                        </Space>
                      </div>
                      <span className={styles.previewItemSecondary}>
                        {route.description || "Recovered from the README plan."}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No backend API routes.</p>
              )}
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewSectionHeader}>
                <RocketIcon size={16} color="#2dd4a8" />
                <h4 className={styles.previewSectionTitle}>Packages</h4>
              </div>
              {packagePreview.length > 0 ? (
                <div className={styles.previewList}>
                  {packagePreview.map((dependency) => (
                    <div
                      key={`${dependency.kind}-${dependency.name}`}
                      className={styles.previewListItem}
                    >
                      <div className={styles.previewItemRow}>
                        <span className={styles.previewItemPrimary}>
                          {dependency.name}
                        </span>
                        <span className={styles.previewBadge}>
                          {dependency.kind}
                        </span>
                      </div>
                      <span className={styles.previewItemSecondary}>
                        {dependency.purpose ||
                          `Planned package addition (${dependency.version}).`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No package additions.</p>
              )}
            </div>
          </div>
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

      {/* ─── Entity Modal ─────────────────────────────────────────────────── */}
      <Modal
        title={editingEntity ? "Edit Entity" : "Add Entity"}
        open={entityModalVisible}
        onOk={handleEntityModalOk}
        onCancel={() => setEntityModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Entity Name" rules={[{ required: true }]}>
            <Input placeholder="User, Project, Ticket..." />
          </Form.Item>
          <Divider>Fields</Divider>
          <Form.List name="fields">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Missing name" }]}
                    >
                      <Input placeholder="Field Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "type"]}
                      rules={[{ required: true, message: "Missing type" }]}
                    >
                      <Select style={{ width: 120 }}>
                        <Select.Option value="string">String</Select.Option>
                        <Select.Option value="int">Integer</Select.Option>
                        <Select.Option value="float">Float</Select.Option>
                        <Select.Option value="boolean">Boolean</Select.Option>
                        <Select.Option value="datetime">DateTime</Select.Option>
                        <Select.Option value="enum">Enum</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "required"]} valuePropName="checked">
                      <Checkbox>Required</Checkbox>
                    </Form.Item>
                    <Trash2Icon
                      size={16}
                      onClick={() => remove(name)}
                      style={{ cursor: "pointer", color: "#ff4d4f" }}
                    />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusIcon size={14} />}>
                  Add Field
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* ─── Page Modal ───────────────────────────────────────────────────── */}
      <Modal
        title={editingPage ? "Edit Page" : "Add Page"}
        open={pageModalVisible}
        onOk={handlePageModalOk}
        onCancel={() => setPageModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="route" label="Route" rules={[{ required: true }]}>
            <Input placeholder="/dashboard, /settings, /projects/:id..." />
          </Form.Item>
          <Form.Item name="name" label="Page Name" rules={[{ required: true }]}>
            <Input placeholder="Dashboard, Settings, ProjectDetails..." />
          </Form.Item>
          <Form.Item name="layout" label="Layout" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="authenticated">Authenticated (Navbar + Sidebar)</Select.Option>
              <Select.Option value="public">Public (Landing Page style)</Select.Option>
              <Select.Option value="admin">Admin (Restricted access)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="User profile management page..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* ─── API Modal ────────────────────────────────────────────────────── */}
      <Modal
        title={editingApi ? "Edit API Route" : "Add API Route"}
        open={apiModalVisible}
        onOk={handleApiModalOk}
        onCancel={() => setApiModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Space>
            <Form.Item name="method" label="Method" rules={[{ required: true }]}>
              <Select style={{ width: 100 }}>
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
                <Select.Option value="PUT">PUT</Select.Option>
                <Select.Option value="PATCH">PATCH</Select.Option>
                <Select.Option value="DELETE">DELETE</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="path" label="Path" rules={[{ required: true }]}>
              <Input placeholder="/api/projects, /api/tasks/:id..." style={{ width: 300 }} />
            </Form.Item>
          </Space>
          <Form.Item name="auth" label="Authentication" valuePropName="checked">
            <Checkbox>Requires authenticated user</Checkbox>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Retrieve list of projects for the current user..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
