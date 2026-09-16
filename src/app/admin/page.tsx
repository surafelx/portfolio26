import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { siteSchema } from "@/lib/schema";
import { readContent, storageMode } from "@/lib/storage";
import { LoginForm } from "@/components/admin/LoginForm";
import { Editor } from "@/components/admin/Editor";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Site settings", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <LoginForm configured={adminConfigured()} />;
  }
  const parsed = siteSchema.safeParse(await readContent());
  if (!parsed.success) {
    return (
      <main className="admin-login">
        <div className="login-card">
          <h1>Content file needs fixing</h1>
          <p>content/site.json doesn&apos;t match the expected shape. The first problem is:</p>
          <pre>{parsed.error.issues[0]?.path.join(".")}: {parsed.error.issues[0]?.message}</pre>
        </div>
      </main>
    );
  }
  return <Editor initial={parsed.data} mode={storageMode()} />;
}
