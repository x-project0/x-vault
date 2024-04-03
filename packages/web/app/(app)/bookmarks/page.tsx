import Image from "next/image";
import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="container relative">
      {/* hello world */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-30 blur-2xl"></div>
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-full max-w-5xl">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <h1 className="text-6xl font-bold tracking-tight text-primary-foreground sm:text-7xl">
                X-Vault
              </h1>
              <p className="text-xl text-muted-foreground sm:text-2xl">
                Save your bookmarked tweets and analyze them with X-Vault.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center">
          <Link href="/docs">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
