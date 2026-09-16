"use client";

import { useId, useRef, useState } from "react";

export type FieldSpec = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "select" | "toggle" | "color" | "range" | "image";
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  wide?: boolean;
};

type AnyRecord = Record<string, unknown>;

export function FieldInput({ spec, value, onChange, error }: { spec: FieldSpec; value: unknown; onChange: (v: unknown) => void; error?: string }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const describedBy = spec.hint || error ? hintId : undefined;
  const className = `field field-${spec.type}${spec.wide || spec.type === "textarea" || spec.type === "image" ? " wide" : ""}${error ? " has-error" : ""}`;

  let control: React.ReactNode;
  switch (spec.type) {
    case "textarea":
      control = (
        <textarea id={id} rows={3} value={String(value ?? "")} placeholder={spec.placeholder} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} />
      );
      break;
    case "select":
      control = (
        <select id={id} value={String(value ?? "")} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)}>
          {spec.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "toggle":
      return (
        <div className={className}>
          <label className="switch" htmlFor={id}>
            <input id={id} type="checkbox" checked={Boolean(value)} aria-describedby={describedBy} onChange={(e) => onChange(e.target.checked)} />
            <span className="track" aria-hidden="true" />
            <span className="switch-label">{spec.label}</span>
          </label>
          {(error || spec.hint) && (
            <p id={hintId} className={error ? "field-error" : "hint"}>
              {error || spec.hint}
            </p>
          )}
        </div>
      );
    case "color":
      control = (
        <div className="color-row">
          <input type="color" aria-label={`${spec.label} picker`} value={String(value ?? "#000000")} onChange={(e) => onChange(e.target.value)} />
          <input id={id} type="text" value={String(value ?? "")} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
        </div>
      );
      break;
    case "range":
      control = (
        <div className="range-row">
          <input id={id} type="range" min={spec.min ?? 0} max={spec.max ?? 100} value={Number(value ?? 0)} aria-describedby={describedBy} onChange={(e) => onChange(Number(e.target.value))} />
          <output htmlFor={id}>{Number(value ?? 0)}</output>
        </div>
      );
      break;
    case "image":
      control = <ImageInput id={id} value={String(value ?? "")} onChange={onChange} describedBy={describedBy} />;
      break;
    default:
      control = (
        <input
          id={id}
          type={spec.type === "url" ? "text" : "text"}
          inputMode={spec.type === "url" ? "url" : undefined}
          value={String(value ?? "")}
          placeholder={spec.placeholder}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={spec.type !== "url"}
        />
      );
  }

  return (
    <div className={className}>
      <label htmlFor={id}>{spec.label}</label>
      {control}
      {(error || spec.hint) && (
        <p id={hintId} className={error ? "field-error" : "hint"}>
          {error || spec.hint}
        </p>
      )}
    </div>
  );
}

function ImageInput({ id, value, onChange, describedBy }: { id: string; value: string; onChange: (v: unknown) => void; describedBy?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  async function upload(file: File) {
    setStatus("Uploading…");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const body = (await res.json()) as { url?: string; error?: string; mode?: string };
      if (!res.ok || !body.url) {
        setStatus(body.error ?? "Upload failed.");
        return;
      }
      onChange(body.url);
      setStatus(body.mode === "github" ? "Uploaded. It appears on the live site after the next rebuild." : "Uploaded.");
    } catch {
      setStatus("Upload failed. Check your connection.");
    }
  }

  return (
    <div className="image-input">
      <div className="thumb">{value ? <img src={value} alt="" /> : <span>No image</span>}</div>
      <div className="image-controls">
        <input id={id} type="text" value={value} placeholder="/projects/name.jpg or https://…" aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
        <div className="row">
          <button type="button" className="btn-quiet" onClick={() => fileRef.current?.click()}>
            Upload image
          </button>
          {value && (
            <button type="button" className="btn-quiet" onClick={() => onChange("")}>
              Remove
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
          {status && <span className="hint" role="status">{status}</span>}
        </div>
      </div>
    </div>
  );
}

export function ObjectForm<T extends AnyRecord>({
  value,
  fields,
  onChange,
  errors,
  errorPrefix,
}: {
  value: T;
  fields: FieldSpec[];
  onChange: (next: T) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}) {
  return (
    <div className="form-grid">
      {fields.map((spec) => (
        <FieldInput
          key={spec.key}
          spec={spec}
          value={value[spec.key]}
          error={errors?.[`${errorPrefix ? errorPrefix + "." : ""}${spec.key}`]}
          onChange={(v) => onChange({ ...value, [spec.key]: v })}
        />
      ))}
    </div>
  );
}

export function ListEditor<T extends AnyRecord>({
  items,
  onChange,
  fields,
  titleOf,
  subtitleOf,
  makeNew,
  addLabel = "Add item",
  max,
  canRemove = true,
  extra,
  errors,
  errorPrefix,
  isHidden,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  fields: FieldSpec[];
  titleOf: (item: T, index: number) => string;
  subtitleOf?: (item: T) => string;
  makeNew?: () => T;
  addLabel?: string;
  max?: number;
  canRemove?: boolean;
  extra?: (item: T, update: (next: T) => void, index: number) => React.ReactNode;
  errors?: Record<string, string>;
  errorPrefix: string;
  isHidden?: (item: T) => boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const update = (index: number, next: T) => onChange(items.map((it, i) => (i === index ? next : it)));
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    if (open === index) setOpen(target);
  };
  const remove = (index: number) => {
    const label = titleOf(items[index], index);
    if (!window.confirm(`Remove "${label}"? You can undo this by not saving.`)) return;
    onChange(items.filter((_, i) => i !== index));
    setOpen(null);
  };
  const errorCountFor = (index: number) => Object.keys(errors ?? {}).filter((k) => k.startsWith(`${errorPrefix}.${index}.`) || k === `${errorPrefix}.${index}`).length;

  return (
    <div className="list">
      {items.map((item, index) => {
        const isOpen = open === index;
        const errs = errorCountFor(index);
        return (
          <div key={index} className={`list-item${isOpen ? " open" : ""}${isHidden?.(item) ? " is-hidden" : ""}`}>
            <div className="list-head">
              <button type="button" className="list-toggle" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)}>
                <span className="chev" aria-hidden="true">›</span>
                <span className="list-title">
                  {titleOf(item, index) || "Untitled"}
                  {subtitleOf && <small>{subtitleOf(item)}</small>}
                </span>
                {isHidden?.(item) && <span className="pill">Hidden</span>}
                {errs > 0 && <span className="pill warn">{errs === 1 ? "1 issue" : `${errs} issues`}</span>}
              </button>
              <div className="list-actions">
                <button type="button" className="icon-btn" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${titleOf(item, index)} up`}>
                  ↑
                </button>
                <button type="button" className="icon-btn" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Move ${titleOf(item, index)} down`}>
                  ↓
                </button>
                {canRemove && (
                  <button type="button" className="icon-btn danger" onClick={() => remove(index)} aria-label={`Remove ${titleOf(item, index)}`}>
                    ×
                  </button>
                )}
              </div>
            </div>
            {isOpen && (
              <div className="list-body">
                <ObjectForm value={item} fields={fields} onChange={(next) => update(index, next)} errors={errors} errorPrefix={`${errorPrefix}.${index}`} />
                {extra?.(item, (next) => update(index, next), index)}
              </div>
            )}
          </div>
        );
      })}
      {makeNew && (max === undefined || items.length < max) && (
        <button
          type="button"
          className="add-btn"
          onClick={() => {
            onChange([...items, makeNew()]);
            setOpen(items.length);
          }}
        >
          + {addLabel}
        </button>
      )}
      {max !== undefined && items.length >= max && <p className="hint">You&apos;ve reached the limit of {max}.</p>}
    </div>
  );
}
