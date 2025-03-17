import Link from "next/link";
import { ArrowLeft, Cloud, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FaCloud } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-16">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-2 items-center text-xl font-medium">
            <Link href="/" className="flex items-center gap-2">
              <FaCloud className="h-6 w-6 text-primary" />
              <span>Betterflare</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="relative">
                <div className="text-[10rem] font-bold text-primary">404</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Page not found
            </h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved. Even
              our cloud storage couldn't find this one.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/docs" className="text-primary hover:underline">
              Check our documentation
            </Link>{" "}
            or{" "}
            <Link
              href="https://github.com/betterflare/dashboard/issues"
              className="text-primary hover:underline"
            >
              report an issue
            </Link>
            .
          </div>
        </div>
      </main>
    </div>
  );
}
