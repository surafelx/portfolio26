import Link from "next/link";
import { CardLink } from "@/components/Entries";
import { HandNote } from "@/components/HandNote";
import { Status } from "@/components/Status";
import { FADER_ON } from "@/content/fade";
import { MiniMap } from "@/components/MiniMap";
import { links } from "@/content/map";
import { layout } from "@/content/map-layout";
import { featured, hero, pillars, profile, visible, work, type Side } from "@/content/site";

const SIDES: Side[] = ["engineer", "middle", "artist"];

// Laid out once at build time, squarer than the full map so it fits beside the intro
const miniLayout = layout(440, 380, 34, true);

export default function Home() {
  return (
    <>
      {/* Round one, abol: who I am */}
      <section className="wrap hero">
        <span className="hero-am" lang="am" aria-hidden="true">{profile.amharic.split(" ")[0]}</span>
        {FADER_ON && (
          <HandNote arrow="up" className="notch-note">
            slide me, I&rsquo;m two people
          </HandNote>
        )}
        <div>
          <p>
            <span className="greeting">Hi, I&rsquo;m Surafel.</span>
            <Status />
          </p>
          <h1>
            {SIDES.map((s) => (
              <span key={s} className={`v-${s}`}>
                {hero[s].headline} <span className="mark">{hero[s].mark}</span>
              </span>
            ))}
          </h1>
          {SIDES.map((s) => (
            <p key={s} className={`lede v-${s}`}>{hero[s].lede}</p>
          ))}
          <div className="actions">
            <Link className="btn" href="/work">See my work</Link>
            <a className="btn line" href={profile.cvUrl}>Download CV</a>
          </div>
        </div>
        <div className="side">
          <div className="panel map-panel">
            <div className="map-panel-head">
              <p className="label">How it all connects</p>
              <Link href="/map" className="mini-open">
                Full map →
              </Link>
            </div>
            <MiniMap layout={miniLayout} links={links} />
          </div>
        </div>
      </section>

      {/* Round two, tona: what I make */}
      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="label">Things I make <span className="am" lang="am">ቶና</span></p>
            <h2 className="squiggle">Code, sound, and things for home.</h2>
          </div>
          <div className="aside">
            {FADER_ON && <p>Slide the fader and this list reorders itself around whoever you came to meet.</p>}
            <p className="map-link-home">
              <Link href="/map">See all of it, connected →</Link>
            </p>
          </div>
        </div>
        <div className="grid">
          {visible(featured).map((f) => (
            <CardLink key={f.title} entry={f} href={`/${f.room}`} className={`lean-${f.lean}`} />
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="label">Five rooms</p>
            <h2 className="squiggle">Pick a door.</h2>
          </div>
        </div>
        <div className="rooms">
          {pillars.map((p, i) => (
            <Link key={p.id} href={`/${p.id}`} className="card room">
              <span className="num">0{i + 1}</span>
              <div>
                <h3>{p.nav}</h3>
                <p>{p.door}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section about-block">
        <div>
          <p className="label">About</p>
          <h2 className="squiggle">
            The <span className="circled">human</span> part.
          </h2>
        </div>
        <p>{profile.about}</p>
      </section>

      {/* Round three, bereka: the blessing */}
      <section className="wrap section">
        <div className="contact">
          <div>
            <p className="label" style={{ color: "#9bb7ff" }}>
              Say hello <span className="am" lang="am" style={{ color: "#cfcbc3" }}>በረካ</span>
            </p>
            <h2 className="squiggle">Let&rsquo;s make something.</h2>
            <p>{work.availability} Or just say hello about music, art, or a project for home. I usually reply within a day.</p>
          </div>
          <div className="actions">
            <a className="btn" href={profile.bookingUrl}>Book a call</a>
            <a className="btn line" href={`mailto:${profile.email}`}>Email me</a>
          </div>
        </div>
      </section>
    </>
  );
}
