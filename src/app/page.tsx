import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Image
        src="/logo-black.svg"
        alt="Nesterway"
        width={280}
        height={108}
        priority
        className="w-[200px] md:w-[280px] h-auto"
      />

      {/* Divider */}
      <div className="w-12 h-px bg-nw-border my-8 md:my-10" />

      {/* Coming Soon */}
      <h1 className="text-nw-heading text-2xl md:text-3xl font-light tracking-wide">
        Coming Soon
      </h1>

      {/* Tagline */}
      <p className="mt-4 text-nw-body text-sm md:text-base font-light tracking-wide text-center max-w-md">
        Digital property guides that delight your guests.
      </p>
    </div>
  );
}
