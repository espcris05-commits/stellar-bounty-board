import React from "react";

interface Props { deadline: string; }

const ExpirationBadge: React.FC<Props> = ({ deadline }) => {
  const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  const urgency = daysLeft < 1 ? "critical" : daysLeft < 3 ? "urgent" : daysLeft < 7 ? "soon" : "normal";
  const colors: Record<string, string> = {
    critical: "#ef4444", urgent: "#f59e0b", soon: "#3b82f6", normal: "#10b981",
  };
  const labels: Record<string, string> = {
    critical: "Expires today", urgent: `in ${daysLeft}d`, soon: `in ${daysLeft}d`, normal: `in ${daysLeft}d`,
  };
  return (
    <span style={{ background: colors[urgency] + "20", color: colors[urgency], padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 }}>
      ⏳ {labels[urgency]}
    </span>
  );
};
export default ExpirationBadge;
