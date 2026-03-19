"use client";

import { useStyles } from "./styles/style";
import { Card, Switch, Typography } from "antd";

export default function SettingsPage() {
  const { styles } = useStyles();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography.Title level={2} className={styles.title}>
          Settings
        </Typography.Title>
        <Typography.Paragraph className={styles.subtitle}>
          Configure your PromptForge experience.
        </Typography.Paragraph>
      </div>

      <div className={styles.grid}>
        <Card className={styles.card} title="Theme">
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Dark mode</span>
            <Switch checked disabled />
          </div>
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Enable animations</span>
            <Switch defaultChecked />
          </div>
        </Card>
        <Card className={styles.card} title="Account">
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Email notifications</span>
            <Switch defaultChecked />
          </div>
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Auto-update</span>
            <Switch />
          </div>
        </Card>
      </div>
    </div>
  );
}
