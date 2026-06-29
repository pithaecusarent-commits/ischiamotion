import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type AdminAuditLogItem = {
  id: string;
  actor_email: string | null;
  action: string;
  target_table: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

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

export async function getAdminAuditEventsForTarget(input: {
  accessToken: string;
  targetTable: string;
  targetId: string;
  actions?: string[];
  limit?: number;
}): Promise<{ events: AdminAuditLogItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    let query = supabase
      .from("admin_audit_log")
      .select("id, actor_email, action, target_table, target_id, metadata, created_at")
      .eq("target_table", input.targetTable)
      .eq("target_id", input.targetId)
      .order("created_at", { ascending: false })
      .limit(input.limit || 20);

    if (input.actions?.length) {
      query = query.in("action", input.actions);
    }

    const { data, error } = await query;

    if (error) {
      return { events: [], error: error.message };
    }

    return { events: (data || []) as AdminAuditLogItem[], error: null };
  } catch (error) {
    return {
      events: [],
      error: error instanceof Error ? error.message : "Unable to load audit log."
    };
  }
}
