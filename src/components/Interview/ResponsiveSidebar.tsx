import { useState } from "react";
import { NewSessionButton } from "@/components/Interview/NewSessionButton";
import type { InterviewSession } from "@/types";

interface ResponsiveSidebarProps {
  sessions: InterviewSession[] | undefined;
  activeSessionId: string | null;
  setActiveSessionId: (id: string) => void;
}

export default function ResponsiveSidebar({ sessions, activeSessionId, setActiveSessionId }: ResponsiveSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button visible only on small screens */}
    <header className="md:hidden py-4  px-2 flex border-b ">
      <div>
        <button
          className=" text-gray-700 rounded"
          onClick={() => setOpen(true)}
        >
          ☰ Menu
        </button>
      </div>
    </header>

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 border-r p-4">
        <NewSessionButton onSessionCreated={(id) => setActiveSessionId(id)} />
        <ul>
          {sessions?.map((s: any) => (
            <li
              key={s._id}
              className={`cursor-pointer p-2 ${
                activeSessionId === s._id ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveSessionId(s._id)}
            >
              {s.jobTitle} @ {s.companyName}
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dark background */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar drawer */}
          <aside className="relative z-50 w-64 bg-white border-r p-4 h-full">
            <button
              className="mb-4 p-2 border rounded text-gray-700"
              onClick={() => setOpen(false)}
            >
              ✕ Close
            </button>
            <NewSessionButton onSessionCreated={(id) => {
              setActiveSessionId(id);
              setOpen(false);
            }} />
            <ul>
              {sessions?.map((s: any) => (
                <li
                  key={s._id}
                  className={`cursor-pointer p-2 ${
                    activeSessionId === s._id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    setActiveSessionId(s._id);
                    setOpen(false);
                  }}
                >
                  {s.jobTitle} @ {s.companyName}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </>
  );
}
