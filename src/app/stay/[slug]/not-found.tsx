import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";

export default function PropertyNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Property Not Found
        </h1>

        <p className="mb-6 max-w-md text-muted-foreground">
          This property page is no longer available. Please contact your host
          directly or check your booking confirmation for the correct link.
        </p>

        <Link href="/">
          <Button>Go to Homepage</Button>
        </Link>
      </div>

      <div className="mt-12 border-t border-border pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Looking for a different property? Check your booking confirmation for
          the correct link.
        </p>
      </div>
    </div>
  );
}
