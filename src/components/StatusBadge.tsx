import { CheckCircleIcon, XCircleIcon, ClockIcon, BriefcaseIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import type { FC, ReactNode } from "react";

type Status = "applied" | "interview" | "offer" | "rejected" | "accepted";

const statusConfig: Record<Status, { color: string; icon: ReactNode }> = {
  applied: {
    color: "bg-blue-100 text-blue-700",
    icon: <ClockIcon className="w-4 h-4" />,
  },
  interview: {
    color: "bg-yellow-100 text-yellow-700",
    icon: <BriefcaseIcon className="w-4 h-4" />,
  },
  offer: {
    color: "bg-purple-100 text-purple-700",
    icon: <HandThumbUpIcon className="w-4 h-4" />,
  },
  rejected: {
    color: "bg-red-100 text-red-700",
    icon: <XCircleIcon className="w-4 h-4" />,
  },
  accepted: {
    color: "bg-green-100 text-green-700",
    icon: <CheckCircleIcon className="w-4 h-4" />,
  },
};

export const StatusBadge: FC<{ status: Status }> = ({ status }) => {
  const config = statusConfig[status] || statusConfig["applied"];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status}
    </span>
  );
};
