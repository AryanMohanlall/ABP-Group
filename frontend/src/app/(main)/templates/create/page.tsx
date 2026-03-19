"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Card,
  message,
  Space,
  Typography,
} from "antd";
import {
  useTemplateAction,
  useTemplateState,
} from "@/providers/templates-provider";
import {
  TemplateCategory,
  TemplateStatus,
} from "@/providers/templates-provider/context";
import {
  ProjectFramework,
  ProjectProgrammingLanguage,
  ProjectDatabaseOption,
} from "@/providers/projects-provider/context";
import { ArrowLeftIcon } from "lucide-react";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function CreateTemplatePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { create } = useTemplateAction();
  const { isPending } = useTemplateState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await create({
        ...values,
        forkCount: 0,
        status: TemplateStatus.Draft,
        version: values.version || "1.0.0",
        isFeatured: values.isFeatured || false,
      });
      message.success("Template created successfully!");
      router.push("/templates");
    } catch (error) {
      console.error(error);
      message.error("Failed to create template.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Button
        type="link"
        icon={<ArrowLeftIcon size={16} />}
        onClick={() => router.push("/templates")}
        style={{ marginBottom: 16, padding: 0 }}
      >
        Back to Templates
      </Button>

      <Title level={2}>Create a New Template</Title>
      <Paragraph>
        Share your project structure and configuration with the community.
      </Paragraph>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            framework: ProjectFramework.NextJS,
            language: ProjectProgrammingLanguage.TypeScript,
            database: ProjectDatabaseOption.RenderPostgres,
            category: TemplateCategory.AppsAndGames,
            includesAuth: true,
            version: "1.0.0",
          }}
        >
          <Title level={4}>Basic Information</Title>
          <Form.Item
            name="name"
            label="Template Name"
            rules={[{ required: true, message: "Please enter template name" }]}
          >
            <Input placeholder="e.g. Modern SaaS Starter" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea
              rows={3}
              placeholder="What makes this template special?"
            />
          </Form.Item>

          <Form.Item name="author" label="Author">
            <Input placeholder="Your name or organization" />
          </Form.Item>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                options={Object.entries(TemplateCategory)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => ({ label: key, value }))}
              />
            </Form.Item>

            <Form.Item name="version" label="Version">
              <Input placeholder="1.0.0" />
            </Form.Item>
          </div>

          <Title level={4} style={{ marginTop: 24 }}>
            Tech Stack
          </Title>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="framework"
              label="Framework"
              rules={[{ required: true }]}
            >
              <Select
                options={Object.entries(ProjectFramework)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => ({ label: key, value }))}
              />
            </Form.Item>

            <Form.Item
              name="language"
              label="Language"
              rules={[{ required: true }]}
            >
              <Select
                options={Object.entries(ProjectProgrammingLanguage)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => ({ label: key, value }))}
              />
            </Form.Item>

            <Form.Item
              name="database"
              label="Database"
              rules={[{ required: true }]}
            >
              <Select
                options={Object.entries(ProjectDatabaseOption)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => ({ label: key, value }))}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="includesAuth"
            label="Includes Authentication"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Title level={4} style={{ marginTop: 24 }}>
            Presentation & Metadata
          </Title>
          <Form.Item name="tags" label="Tags (comma separated)">
            <Input placeholder="nextjs, tailwind, saas" />
          </Form.Item>

          <Form.Item name="thumbnailUrl" label="Thumbnail URL">
            <Input placeholder="https://example.com/image.png" />
          </Form.Item>

          <Form.Item name="previewUrl" label="Preview URL">
            <Input placeholder="https://demo.example.com" />
          </Form.Item>

          <Title level={4} style={{ marginTop: 24 }}>
            Technical Configuration
          </Title>
          <Form.Item
            name="scaffoldConfig"
            label="Scaffold Config (JSON)"
            extra="Instructions for the AI on how to structure the project."
          >
            <TextArea
              rows={6}
              placeholder='{ "dependencies": { "antd": "^5.0.0" }, "structure": [ "src/components", "src/hooks" ] }'
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting || isPending}
              >
                Create Template
              </Button>
              <Button onClick={() => router.push("/templates")}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
