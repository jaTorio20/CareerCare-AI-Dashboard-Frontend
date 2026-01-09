import { useState } from "react";
import { NewSessionButton } from "@/components/Interview/NewSessionButton";
import type { InterviewSession } from "@/types";
import { Brain, Trash, Loader } from "lucide-react";
import { getSessionLabel } from '@/utils/interviews/interview'

interface ResponsiveSidebarProps {
  sessions: InterviewSession[] | undefined;
  activeSessionId: string | null;
  setActiveSessionId: (id: string) => void;
  deleteMutate: (id: string) => Promise<void>; // mutation function 
  isDeleting: boolean;
}

export default function ResponsiveSidebar({ sessions, activeSessionId, setActiveSessionId, deleteMutate, isDeleting }: ResponsiveSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
<>
  {/* Mobile Header */}
    <button
      onClick={() => setOpen(true)}
      className="lg:hidden fixed z-40 m-2
      rounded-full border bg-indigo-600 p-2
       cursor-pointer hover:scale-[1.2] transform duration-200 ease-in-out
        text-white shadow-lg hover:border-indigo-600 hover:bg-transparent
         hover:text-indigo-600 transition"
    >
      <Brain/>
    </button>


 {/* Desktop Sidebar */}
<aside className="hidden lg:flex w-62 flex-col bg-white
  shadow-lg p-4 rounded-r-2xl ">
  {/* New Session Button */}
  <NewSessionButton
    onSessionCreated={setActiveSessionId}
  />

  {/* Session List */}
  <ul className="flex-1 overflow-y-auto space-y-2">
    {sessions?.map((s: any) => {
      const isActive = activeSessionId === s._id;

      return (
        <li
          key={s._id}
          onClick={() => setActiveSessionId(s._id)}
          className={`group flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition
            ${
              isActive
                ? "bg-indigo-50 text-indigo-700 shadow-inner"
                : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
        >
          {/* Session Info */}
          <span className="truncate text-sm font-medium">
             {getSessionLabel(s)}
          </span>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this session?")) deleteMutate(s._id);
            }}
            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
          >
            ✕
          </button>
        </li>
      );
    })}
  </ul>
</aside>



{/* Mobile Drawer */}
  <div className={`fixed inset-0 z-50 flex transition-opacity
      ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
    
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/40 transition-opacity"
      onClick={() => setOpen(false)}/>

    {/* Drawer */}
    <aside className={`relative z-50 w-72 
      max-w-full bg-white max-h-screen overflow-y-auto
      p-6 shadow-2xl rounded-r-3xl flex flex-col transition-transform
      transform duration-300 ease-out ai-sidebar
      ${open ? "translate-x-0" : "-translate-x-full"}`}
      onClick={(e) => e.stopPropagation()}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Sessions</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
        >
          ✕
        </button>
      </div>

      {/* New Session Button */}
      <NewSessionButton
        onSessionCreated={(id) => {
          setActiveSessionId(id);
          setOpen(false);
        }}
      />

      {/* Session List */}
      <ul className="flex-1 overflow-y-auto space-y-2">
        {sessions?.map((s: any) => {
        const isActive = activeSessionId === s._id;
        return(
          <li
            key={s._id}
            onClick={() => setActiveSessionId(s._id)} //setOpen(false) if want to auto close sidebar             
            className={`group flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition
              ${ isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-inner"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
            <span className="truncate text-sm font-medium">
                {getSessionLabel(s)}
            </span>          
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteMutate(s._id);
              }}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100
               text-red-500 
                hover:text-red-700 transition"
            >
              { isDeleting ?
                <Loader className="disabled:cursor-not-allowed disabled:opacity-50
                animate-spin w-5 h-5"/>
              : 
              <Trash className="w-5 h-5"/>
              }
            </button>
          </li>
        )
        })}
      </ul>
    </aside>
  </div>




</>

  );
}
