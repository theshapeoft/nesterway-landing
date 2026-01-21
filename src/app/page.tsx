import Link from "next/link";
import { Compass, QrCode, MapPin } from "lucide-react";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground">Travelama</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="accent" size="sm">
              Sign up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Compass className="h-10 w-10" />
        </div>

        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
          Travelama
        </h1>

        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          Digital house manuals and destination guides for short-term rental
          guests
        </p>

        {/* Demo Property Link */}
        <Link href="/stay/sliema-sanctuary">
          <Button variant="accent" size="lg">
            View Demo Property
          </Button>
        </Link>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              Scan & Access
            </h3>
            <p className="text-sm text-muted-foreground">
              Guests scan a QR code to instantly access property information and
              local recommendations.
            </p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              Local Guides
            </h3>
            <p className="text-sm text-muted-foreground">
              Curated destination content with restaurant, activity, and
              transport recommendations.
            </p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              Offline Ready
            </h3>
            <p className="text-sm text-muted-foreground">
              Critical property information is cached for offline access when
              guests need it most.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Built for short-term rental hosts and their guests
        </p>
      </footer>
    </div>
  );
}
