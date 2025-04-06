import * as React from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/workflows/$workflowId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowId } = Route.useParams();

  const { data: titles = [] } = useSuspenseQuery(
    convexQuery(api.titles.getTitles, {
      workflowId: workflowId ?? "",
    })
  );

  // Sort titles by rating in descending order
  const sortedTitles = [...titles].sort(
    (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
  );

  // Function to determine background color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "bg-green-900/50 border-green-700";
    if (rating >= 6) return "bg-yellow-900/50 border-yellow-700";
    return "bg-red-900/50 border-red-700";
  };

  // Function to format rating to one decimal place
  const formatRating = (rating: number) => rating.toFixed(1);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="container mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg 
            bg-gray-800 hover:bg-gray-700 transition-colors duration-200
            text-gray-300 hover:text-white mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Video Processing
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Generated Titles
        </h1>

        {workflowId && (
          <div className="space-y-4">
            {titles.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
                  viewBox="0 0 24 24"
                >
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
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-4">
                {sortedTitles.map((title, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border ${getRatingColor(title.rating)} 
                      transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h2 className="text-lg font-medium flex-1">
                      {title.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Rating:</span>
                      <span className="text-xl font-bold">
                        {formatRating(title.rating)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
