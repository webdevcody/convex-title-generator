import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workflow.kickoffTitleGenerationWorkflow),
    onSuccess: (id) => {
      router.navigate({
        to: "/workflows/$workflowId",
        params: { workflowId: id as string },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutate({ url });
    setUrl("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">
          YouTube Title Generator
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </div>
              ) : (
                "Generate Titles"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
