export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

export const toInputDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
};

export const calcDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return 0;
  const [inH, inM] = inTime.split(":").map(Number);
  const [outH, outM] = outTime.split(":").map(Number);
  const minutes = outH * 60 + outM - (inH * 60 + inM);
  return minutes > 0 ? minutes : 0;
};

export const formatDuration = (minutes) => {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

export const calcPercentage = (part, total) => {
  if (!total) return 0;
  return Math.round((part / total) * 100);
};
