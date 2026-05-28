"use client";

import { StudyPlan as StudyPlanType } from "@/lib/types";

export default function StudyPlan({ data }: { data: StudyPlanType }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
        <p
          className="text-accent text-xs uppercase tracking-widest font-body mb-2"
        >
          Overview
        </p>
        <p className="text-text-primary font-body text-sm leading-relaxed">
          {data.summary}
        </p>
        <p className="text-text-muted font-body text-xs mt-2">
          {data.totalDays} day{data.totalDays !== 1 ? "s" : ""} study plan ·{" "}
          {data.sessions.length} sessions
        </p>
      </div>

      {/* Sessions */}
      <div className="space-y-3">
        {data.sessions.map((session, i) => (
          <div
            key={session.day}
            className="bg-bg border border-border rounded-xl p-5 fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-accent text-xs font-body font-medium">
                  {session.day}
                </span>
                <div>
                  <h3 className="text-text-primary font-body font-medium text-sm">
                    {session.topic}
                  </h3>
                  <p className="text-text-muted font-body text-xs mt-0.5">
                    {session.focusArea}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-text-secondary font-body text-xs bg-surface border border-border rounded-full px-3 py-1">
                {session.duration}
              </span>
            </div>
            <ul className="space-y-1.5 pl-10">
              {session.tasks.map((task, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-text-secondary font-body text-xs"
                >
                  <span className="text-accent mt-0.5">·</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
