import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export async function logAdminAuditEvent(input: {
  accessToken: string;
  actorProfileId: string;
  actorEmail?: string | null;
  action: string;
  targetTable?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    await supabase.from("admin_audit_log").insert({
      actor_profile_id: input.actorProfileId,
      actor_email: input.actorEmail || null,
      action: input.action,
      target_table: input.targetTable || null,
      target_id: input.targetId || null,
      metadata: input.metadata || {}
    });
  } catch {
    // Audit logging must not block the operational admin action.
  }
}
