"use client";

import { useEffect, useState } from "react";
import type { Site } from "@/lib/schema";
import type { Visits } from "@/lib/visits";
import type { Activity } from "@/app/api/github/route";
import { ago, loadActivity, loadVisits } from "@/lib/live-client";

type Post = Site["posts"][number];

/** The live rows of the Right now panel: visitors today, GitHub activity, and the latest note. */
export function LiveNow({ visitors, github, post }: { visitors: boolean; github: boolean; post: Post | null }) {
  const [visits, setVisits] = useState<Visits | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (visitors) loadVisits().then(setVisits);
    if (github) loadActivity().then(setActivity);
  }, [visitors, github]);

  const showVisits = visitors && visits !== null && visits.total > 0;
  const showActivity = github && activity !== null && (activity.pushes > 0 || (activity.commits ?? 0) > 0);
  if (!showVisits && !showActivity && !post) return null;

  const count = (n: number, one: string, many: string) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;

  return (
    <ul className="live" aria-label="Live">
      {showVisits && (
        <li>
          <b>{count(visits.total, "visitor", "visitors")}</b>
          <span>{visits.today > 0 ? `${visits.today.toLocaleString("en-US")} today` : "none yet today"}</span>
        </li>
      )}
      {showActivity && (
        <li>
          <b>
            <i className="pulse" aria-hidden="true" />
            {activity.commits !== null ? count(activity.commits, "commit", "commits") : count(activity.pushes, "push", "pushes")} in {activity.days} days
          </b>
          <span>
            {count(activity.repos, "repo", "repos")}
            {activity.latest && (
              <>
                {" · last "}
                {activity.latest.url ? (
                  <a href={activity.latest.url} target="_blank" rel="noopener noreferrer">
                    {activity.latest.repo.replace(/^[^/]+\//, "")}
                  </a>
                ) : (
                  activity.latest.repo
                )}{" "}
                {ago(activity.latest.at)}
              </>
            )}
          </span>
        </li>
      )}
      {post && (
        <li>
          <b>Latest note</b>
          <span>
            <a href={post.url || "#writing"}>{post.title}</a>
          </span>
        </li>
      )}
    </ul>
  );
}
