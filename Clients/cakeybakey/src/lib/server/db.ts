import { getCloudflareContext } from "@opennextjs/cloudflare";

<<<<<<< HEAD
export function getDatabase(): CloudflareEnv["cakeybakey_db"] {
  const { env } = getCloudflareContext();

  return env.cakeybakey_db;
}

export async function getDatabaseAsync(): Promise<
  CloudflareEnv["cakeybakey_db"]
=======
export function getDatabase(): CloudflareEnv["fk_boutique_db"] {
  const { env } = getCloudflareContext();

  return env.fk_boutique_db;
}

export async function getDatabaseAsync(): Promise<
  CloudflareEnv["fk_boutique_db"]
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
> {
  const { env } = await getCloudflareContext({
    async: true,
  });

<<<<<<< HEAD
  return env.cakeybakey_db;
=======
  return env.fk_boutique_db;
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
}
