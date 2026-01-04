export function getSessionLabel(s: {
  jobTitle?: string;
  companyName?: string;
  topic?: string;
}) {
  const jobTitle = s.jobTitle !== "none" ? s.jobTitle : "";
  const companyName = s.companyName !== "none" ? s.companyName : "";
  const topic = s.topic !== "none" ? s.topic : "";

  if (jobTitle && companyName) return `${jobTitle} @ ${companyName}`;
  if (jobTitle) return jobTitle;
  if (companyName) return companyName;
  if (topic) return topic;

  return "Untitled Interview";
}
