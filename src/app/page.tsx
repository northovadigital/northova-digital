import { storeConfig } from "@/config/store";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          {storeConfig.city}, {storeConfig.country}
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
          {storeConfig.name}
        </h1>

        <p className="mt-5 text-base leading-7 text-neutral-600 sm:text-lg">
          {storeConfig.description}
        </p>

        <p className="mt-8 text-sm text-neutral-400">
          Storefront development in progress.
        </p>
      </div>
    </main>
  );
}
