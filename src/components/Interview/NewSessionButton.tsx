import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession } from "@/api/interview";
import { toast } from "sonner";
import { createPortal } from "react-dom";

export function NewSessionButton({ onSessionCreated }: { onSessionCreated: (id: string) => void }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    topic: "",
    difficulty: "none",
  });

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      onSessionCreated(newSession._id);
      setOpen(false); // close modal
      setForm({ jobTitle: "", companyName: "", topic: "", difficulty: "none" });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.error || err.message || "Unknown error";
      toast.error("Failed to create interview room. " + message);
    }

  });

  const formSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // At least one of the three fields must be filled
    if (!form.jobTitle && !form.companyName && !form.topic) {
      toast.error("At least one of Job Title, Company Name, or Topic is required.");
      return;
    }

    // Prepare payload with defaults
    const payload = {
      jobTitle: form.jobTitle || "none",
      companyName: form.companyName || "none",
      topic: form.topic || "none",
      difficulty: form.difficulty || "none",
    };

    await createSessionMutation.mutateAsync(payload);
};



  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-4 p-2 cursor-pointer hover:bg-indigo-700 bg-indigo-600 text-white rounded"
      >
        Start New Chat
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Start New Interview</h2>
            <form
              onSubmit={formSubmit}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Job Title "
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                className="w-full border p-2 rounded"
                
              />
              <input
                type="text"
                placeholder="Company Name "
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="none">None</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer hover:bg-gray-200
                  px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSessionMutation.isPending}
                  className="cursor-pointer hover:bg-blue-800
                  px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {createSessionMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
