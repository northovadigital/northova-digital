import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDatabase(): CloudflareEnv["fk_boutique_db"] {
  const { env } = getCloudflareContext();

  return env.fk_boutique_db;
}

export async function getDatabaseAsync(): Promise<
  CloudflareEnv["fk_boutique_db"]
> {
  const { env } = await getCloudflareContext({
    async: true,
  });

  return env.fk_boutique_db;
}
