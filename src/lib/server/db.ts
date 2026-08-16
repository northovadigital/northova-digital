import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDatabase(): CloudflareEnv["fk_boutique_db"] {
  const { env } = getCloudflareContext();

  return env.fk_boutique_db;
}
