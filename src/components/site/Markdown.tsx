import type { ReactNode } from "react";

/**
 * A small Markdown renderer for READMEs: headings, paragraphs, lists, quotes, code blocks, tables, and inline code,
 * bold, italics and links. It builds React elements (never raw HTML), so a README can't inject markup or scripts.
 * Images and raw HTML are skipped.
 */
export function Markdown({ source, linkBase }: { source: string; linkBase: string }) {
  return <div className="md">{blocks(source.replace(/\r\n?/g, "\n"), linkBase)}</div>;
}

function safeHref(href: string, base: string): string | null {
  if (href.startsWith("#")) return null;
  try {
    const url = new URL(href, base);
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function inline(text: string, base: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  // code | image (dropped) | link | bold | italic
  const re = /`([^`]+)`|!\[[^\]]*\]\([^)]*\)|\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\s][^*]*)\*|<[^>]+>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${i++}`;
    if (m[1] !== undefined) out.push(<code key={key}>{m[1]}</code>);
    else if (m[2] !== undefined) {
      const href = safeHref(m[3], base);
      out.push(
        href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer">
            {inline(m[2], base, key)}
          </a>
        ) : (
          <span key={key}>{inline(m[2], base, key)}</span>
        ),
      );
    } else if (m[4] !== undefined || m[5] !== undefined) out.push(<strong key={key}>{inline(m[4] ?? m[5], base, key)}</strong>);
    else if (m[6] !== undefined) out.push(<em key={key}>{m[6]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

function blocks(src: string, base: string): ReactNode[] {
  const lines = src.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => `b${k++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || /^<\/?[a-z][^>]*>\s*$/i.test(line.trim()) || /^!\[/.test(line.trim())) {
      i++;
      continue;
    }

    const fence = line.match(/^\s*(```|~~~)/);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i++]);
      i++;
      out.push(
        <pre key={key()}>
          <code>{body.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*$/);
    if (heading) {
      const level = heading[1].length;
      const content = inline(heading[2], base, key());
      out.push(level <= 1 ? <h3 key={key()}>{content}</h3> : level === 2 ? <h4 key={key()}>{content}</h4> : <h5 key={key()}>{content}</h5>);
      i++;
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(cells(lines[i++]));
      out.push(
        <div className="md-table" key={key()}>
          <table>
            <thead>
              <tr>{head.map((h, j) => <th key={j}>{inline(h, base, `th${j}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, base, `td${ri}-${j}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
        let item = lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, "");
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) item += ` ${lines[i++].trim()}`;
        items.push(item.replace(/^\[[ xX]\]\s*/, ""));
      }
      const children = items.map((it, j) => <li key={j}>{inline(it, base, `li${k}-${j}`)}</li>);
      out.push(ordered ? <ol key={key()}>{children}</ol> : <ul key={key()}>{children}</ul>);
      continue;
    }

    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++].replace(/^>\s?/, ""));
      out.push(<blockquote key={key()}>{inline(quote.join(" "), base, key())}</blockquote>);
      continue;
    }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      out.push(<hr key={key()} />);
      i++;
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|~~~|>|\s*([-*+]|\d+[.)])\s+)/.test(lines[i])) para.push(lines[i++].trim());
    if (para.length) out.push(<p key={key()}>{inline(para.join(" "), base, key())}</p>);
    else i++;
  }
  return out;
}
