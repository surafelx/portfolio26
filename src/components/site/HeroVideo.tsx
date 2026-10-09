import type { Site } from "@/lib/schema";

/** Turns a YouTube, Vimeo or Loom link into its embed address; a direct .mp4/.webm plays in a video tag. */
function embedFor(url: string): { kind: "iframe" | "video"; src: string } | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?dnt=1` };
  const loom = url.match(/loom\.com\/(?:share|embed)\/([a-f0-9]{16,})/);
  if (loom) return { kind: "iframe", src: `https://www.loom.com/embed/${loom[1]}` };
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url) || url.startsWith("/")) return { kind: "video", src: url };
  return null;
}

/** The intro video in the hero. Until a link is added it keeps the space with a sketched placeholder. */
export function HeroVideo({ profile }: { profile: Site["profile"] }) {
  const embed = profile.videoUrl ? embedFor(profile.videoUrl) : null;
  if (!embed && !profile.videoSlot) return null;
  const title = `${profile.shortName}, intro video`;
  return (
    <div className="hero-video reveal">
      <div className="frame">
        {embed?.kind === "iframe" && <iframe src={embed.src} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
        {embed?.kind === "video" && <video src={embed.src} controls preload="metadata" playsInline aria-label={title} />}
        {!embed && profile.videoUrl && (
          <a className="placeholder" href={profile.videoUrl} target="_blank" rel="noopener noreferrer">
            <span className="play" aria-hidden="true" />
            <span>Watch the intro video</span>
          </a>
        )}
        {!embed && !profile.videoUrl && (
          <div className="placeholder" aria-label="Intro video, coming soon">
            <span className="play" aria-hidden="true" />
            <span className="hand">intro video, coming soon</span>
          </div>
        )}
      </div>
      {profile.videoCaption && <p className="caption">{profile.videoCaption}</p>}
    </div>
  );
}
