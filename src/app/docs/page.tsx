import Link from "next/link";
import {
  ArrowRight,
  Book,
  Cloud,
  Code,
  Command,
  FileText,
  Github,
  Lightbulb,
  Settings,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaCloud, FaGithub } from "react-icons/fa";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur transition-all duration-200
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex gap-2 items-center text-xl font-medium">
            <FaCloud className="h-6 w-6 text-primary" />
            <span>Betterflare</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/github"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Open Source
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Link
                  href="https://github.com/1w6ts/betterflare"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <FaGithub className="mr-1 h-4 w-4" />
                  <span>GitHub</span>
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8 py-8">
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Getting Started</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#introduction"
                    className="text-sm text-primary hover:underline"
                  >
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link
                    href="#installation"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#quickstart"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Quick Start
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Core Concepts</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#buckets"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Buckets
                  </Link>
                </li>
                <li>
                  <Link
                    href="#objects"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Objects
                  </Link>
                </li>
                <li>
                  <Link
                    href="#permissions"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Permissions
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Guides</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#uploading"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Uploading Files
                  </Link>
                </li>
                <li>
                  <Link
                    href="#sharing"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Sharing & Access
                  </Link>
                </li>
                <li>
                  <Link
                    href="#api"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    API Integration
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Reference</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#api-reference"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="#cli"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    CLI Commands
                  </Link>
                </li>
                <li>
                  <Link
                    href="#configuration"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Configuration
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        <main className="space-y-12">
          <section id="introduction" className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Betterflare Documentation
              </h1>
              <p className="text-muted-foreground text-lg">
                Welcome to the Betterflare documentation. Learn how to use
                Betterflare to manage your Cloudflare R2 storage.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Book className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Getting Started</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn the basics of Betterflare and get up and running
                  quickly.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="#quickstart">Read Guide</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">API Reference</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed documentation for the Betterflare API.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="#api-reference">View Reference</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Examples</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore examples and use cases for Betterflare.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="#examples">View Examples</Link>
                </Button>
              </div>
            </div>
          </section>

          <section id="installation" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Installation
              </h2>
              <p className="text-muted-foreground">
                Get Betterflare up and running in your environment.
              </p>
            </div>
            <div className="space-y-4">
              <Tabs defaultValue="hosted">
                <TabsList>
                  <TabsTrigger value="hosted">Hosted Version</TabsTrigger>
                  <TabsTrigger value="docker">Docker</TabsTrigger>
                  <TabsTrigger value="npm">NPM</TabsTrigger>
                </TabsList>
                <TabsContent value="hosted" className="space-y-4 mt-4">
                  <div className="rounded-lg border bg-card p-6 space-y-4">
                    <h3 className="font-medium">Use Our Hosted Version</h3>
                    <p className="text-sm text-muted-foreground">
                      The easiest way to get started with Betterflare is to use
                      our hosted version. No installation required!
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        1. Sign up for a free account at betterflare.io
                      </p>
                      <p className="text-sm">
                        2. Connect your Cloudflare account
                      </p>
                      <p className="text-sm">
                        3. Start managing your R2 storage
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="https://app.betterflare.io/signup">
                        Sign Up for Free <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="docker" className="space-y-4 mt-4">
                  <div className="rounded-lg border bg-card p-6 space-y-4">
                    <h3 className="font-medium">Docker Installation</h3>
                    <p className="text-sm text-muted-foreground">
                      Run Betterflare in a Docker container for easy deployment
                      and management.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>
                          docker pull betterflare/dashboard:latest{"\n"}
                          docker run -p 3000:3000 -e
                          CLOUDFLARE_API_TOKEN=your_token
                          betterflare/dashboard:latest
                        </code>
                      </pre>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Visit{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        http://localhost:3000
                      </code>{" "}
                      to access your Betterflare dashboard.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="npm" className="space-y-4 mt-4">
                  <div className="rounded-lg border bg-card p-6 space-y-4">
                    <h3 className="font-medium">NPM Installation</h3>
                    <p className="text-sm text-muted-foreground">
                      Install Betterflare using npm for a customizable setup.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>
                          npm install -g @betterflare/cli{"\n"}
                          betterflare init{"\n"}
                          betterflare start
                        </code>
                      </pre>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The setup wizard will guide you through the configuration
                      process.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          <section id="quickstart" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Quick Start</h2>
              <p className="text-muted-foreground">
                Get up and running with Betterflare in minutes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-medium">
                  1. Connect Your Cloudflare Account
                </h3>
                <p className="text-sm text-muted-foreground">
                  First, you'll need to connect Betterflare to your Cloudflare
                  account using an API token.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    1. Log in to your Cloudflare dashboard
                  </p>
                  <p className="text-sm">
                    2. Navigate to <strong>My Profile</strong> &gt;{" "}
                    <strong>API Tokens</strong>
                  </p>
                  <p className="text-sm">
                    3. Create a new token with the following permissions:
                  </p>
                  <ul className="list-disc list-inside text-sm pl-4 space-y-1">
                    <li>Account.R2: Read</li>
                    <li>Account.R2 Storage: Edit</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-medium">2. Configure Betterflare</h3>
                <p className="text-sm text-muted-foreground">
                  Once you have your API token, you can configure Betterflare.
                </p>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      # Set your Cloudflare API token{"\n"}
                      export CLOUDFLARE_API_TOKEN=your_token{"\n\n"}# Start
                      Betterflare{"\n"}
                      betterflare start
                    </code>
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alternatively, you can use the web interface to enter your API
                  token.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-medium">
                  3. Start Managing Your R2 Storage
                </h3>
                <p className="text-sm text-muted-foreground">
                  Once connected, you'll see all your R2 buckets and can start
                  managing them.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">• Create new buckets</p>
                  <p className="text-sm">• Upload and organize files</p>
                  <p className="text-sm">• Configure access permissions</p>
                  <p className="text-sm">• Generate shareable links</p>
                </div>
                <Button asChild>
                  <Link href="/dashboard">
                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section id="api-reference" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                API Reference
              </h2>
              <p className="text-muted-foreground">
                Integrate Betterflare with your applications using our API.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-medium">Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  All API requests require authentication using an API token.
                </p>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      curl -X GET https://api.betterflare.io/v1/buckets \{"\n"}
                      {"  "}-H "Authorization: Bearer YOUR_API_TOKEN"
                    </code>
                  </pre>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-medium">Endpoints</h3>
                <p className="text-sm text-muted-foreground">
                  Here are some of the key endpoints available in the
                  Betterflare API.
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">List Buckets</h4>
                    <p className="text-xs text-muted-foreground">
                      GET /v1/buckets
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Create Bucket</h4>
                    <p className="text-xs text-muted-foreground">
                      POST /v1/buckets
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">List Objects</h4>
                    <p className="text-xs text-muted-foreground">
                      GET /v1/buckets/{"{bucket_name}"}/objects
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Upload Object</h4>
                    <p className="text-xs text-muted-foreground">
                      POST /v1/buckets/{"{bucket_name}"}/objects
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      Generate Presigned URL
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      POST /v1/buckets/{"{bucket_name}"}/objects/
                      {"{object_key}"}/presign
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/api-docs">View Full API Documentation</Link>
                </Button>
              </div>
            </div>
          </section>

          <section id="cli" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                CLI Reference
              </h2>
              <p className="text-muted-foreground">
                Manage your R2 storage from the command line with the
                Betterflare CLI.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-medium">Installation</h3>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>npm install -g @betterflare/cli</code>
                  </pre>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-medium">Commands</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Authentication</h4>
                    <div className="rounded-md bg-muted p-4 mt-2">
                      <pre className="text-sm overflow-x-auto">
                        <code>betterflare login</code>
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">List Buckets</h4>
                    <div className="rounded-md bg-muted p-4 mt-2">
                      <pre className="text-sm overflow-x-auto">
                        <code>betterflare buckets list</code>
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Upload File</h4>
                    <div className="rounded-md bg-muted p-4 mt-2">
                      <pre className="text-sm overflow-x-auto">
                        <code>
                          betterflare upload my-bucket ./local-file.jpg
                        </code>
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Download File</h4>
                    <div className="rounded-md bg-muted p-4 mt-2">
                      <pre className="text-sm overflow-x-auto">
                        <code>
                          betterflare download my-bucket remote-file.jpg
                          ./local-file.jpg
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/cli-docs">View Full CLI Documentation</Link>
                </Button>
              </div>
            </div>
          </section>

          <section id="examples" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Examples</h2>
              <p className="text-muted-foreground">
                Explore examples and use cases for Betterflare.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Automated Backups</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn how to set up automated backups to R2 using Betterflare.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/examples/backups">View Example</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Command className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">CI/CD Integration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Integrate Betterflare with your CI/CD pipeline for automated
                  deployments.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/examples/ci-cd">View Example</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Custom Domain Setup</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure a custom domain to serve content directly from your
                  R2 bucket.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/examples/custom-domain">View Example</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Content Delivery</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use R2 and Betterflare for efficient content delivery.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/examples/content-delivery">View Example</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Community & Support
              </h2>
              <p className="text-muted-foreground">
                Get help and connect with the Betterflare community.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">GitHub</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contribute to Betterflare, report issues, or explore the
                  source code.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href="https://github.com/betterflare/dashboard"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit GitHub
                  </Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary"
                  >
                    <path d="M22 8.01v-.96a3 3 0 0 0-3-3.04H5a3 3 0 0 0-3 3.04v.96" />
                    <path d="M22 12v4a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-4" />
                    <path d="M2 12h20" />
                    <path d="M7 16h.01" />
                    <path d="M11 16h.01" />
                    <path d="M15 16h.01" />
                  </svg>
                  <h3 className="font-medium">Discord</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Join our Discord community to chat with other users and get
                  help.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href="https://discord.gg/betterflare"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join Discord
                  </Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <h3 className="font-medium">Contact</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Need help? Contact our support team for assistance.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="mailto:support@betterflare.io">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <Cloud className="h-4 w-4 text-primary" />
            <p>© 2025 Betterflare. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/betterflare/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
