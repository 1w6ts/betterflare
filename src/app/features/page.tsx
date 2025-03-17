import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Database,
  FileText,
  FolderOpen,
  Globe,
  History,
  Image,
  Lock,
  Search,
  Share2,
  Shield,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-2 items-center text-xl font-medium">
            <Link href="/" className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              <span>Betterflare</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/features"
                className="text-sm font-medium text-foreground"
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
                href="https://github.com/betterflare/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Open Source
              </Link>
            </nav>
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Features
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need for R2 management
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Betterflare provides a complete set of tools to manage your
                  Cloudflare R2 storage without the headaches.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 space-y-24">
            {/* Bucket Management */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Bucket Management
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Create, configure, and manage your R2 buckets with an
                  intuitive interface that actually makes sense.
                </p>
                <ul className="space-y-3 mt-6">
                  {[
                    "Create new buckets with just a few clicks",
                    "Configure CORS settings with a visual editor",
                    "Set up lifecycle policies without cryptic JSON",
                    "View detailed bucket analytics and usage stats",
                    "Manage bucket permissions with a simple interface",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
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
                          className="h-3 w-3 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-xl border bg-background p-2 shadow-lg">
                <div className="absolute top-0 w-full h-12 bg-muted/30 flex items-center px-4 gap-1.5 rounded-t-lg">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="pt-12 p-4 h-[400px] overflow-hidden">
                  <div className="flex flex-col h-full rounded-md overflow-hidden border border-border/30">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary/70" />
                        <div className="font-medium">Buckets</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <span>Create Bucket</span>
                        <span className="sr-only">Create new bucket</span>
                      </Button>
                    </div>
                    <div className="flex-1 p-4 space-y-3">
                      {[
                        {
                          name: "assets-production",
                          files: "1,245",
                          size: "32.4 GB",
                        },
                        {
                          name: "user-uploads",
                          files: "8,901",
                          size: "156.7 GB",
                        },
                        { name: "backups", files: "42", size: "8.9 GB" },
                        {
                          name: "static-website",
                          files: "312",
                          size: "5.2 GB",
                        },
                        { name: "logs", files: "10,567", size: "4.1 GB" },
                      ].map((bucket, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-md border border-border/30 hover:border-primary/30 hover:bg-muted/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-primary/70" />
                              <span className="font-medium">{bucket.name}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">
                                Open bucket settings
                              </span>
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
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                              </svg>
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div>{bucket.files} files</div>
                            <div>{bucket.size}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* File Operations */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 relative rounded-xl border bg-background p-2 shadow-lg">
                <div className="absolute top-0 w-full h-12 bg-muted/30 flex items-center px-4 gap-1.5 rounded-t-lg">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="pt-12 p-4 h-[400px] overflow-hidden">
                  <div className="flex flex-col h-full rounded-md overflow-hidden border border-border/30">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-primary/70" />
                        <div className="font-medium">user-uploads</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <input
                            type="search"
                            placeholder="Search files..."
                            className="h-9 rounded-md border border-input bg-background px-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <Button size="sm" variant="outline">
                          Upload
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="border border-border/30 rounded-md overflow-hidden">
                        <div className="grid grid-cols-12 text-sm font-medium p-3 bg-muted/10 border-b border-border/30">
                          <div className="col-span-6">Name</div>
                          <div className="col-span-2">Size</div>
                          <div className="col-span-3">Last Modified</div>
                          <div className="col-span-1"></div>
                        </div>
                        <div className="divide-y divide-border/30">
                          {[
                            {
                              name: "profile-image-01.jpg",
                              type: "image",
                              size: "1.2 MB",
                              date: "2 hours ago",
                            },
                            {
                              name: "document.pdf",
                              type: "document",
                              size: "3.5 MB",
                              date: "Yesterday",
                            },
                            {
                              name: "presentation.pptx",
                              type: "document",
                              size: "8.7 MB",
                              date: "3 days ago",
                            },
                            {
                              name: "data-export.csv",
                              type: "document",
                              size: "512 KB",
                              date: "1 week ago",
                            },
                            {
                              name: "video-clip.mp4",
                              type: "video",
                              size: "24.8 MB",
                              date: "2 weeks ago",
                            },
                          ].map((file, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-12 items-center p-3 text-sm hover:bg-muted/5"
                            >
                              <div className="col-span-6 flex items-center gap-2">
                                {file.type === "image" ? (
                                  <Image className="h-4 w-4 text-blue-500" />
                                ) : file.type === "video" ? (
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
                                    className="h-4 w-4 text-purple-500"
                                  >
                                    <path d="m22 8-6 4 6 4V8Z" />
                                    <rect
                                      width="14"
                                      height="12"
                                      x="2"
                                      y="6"
                                      rx="2"
                                      ry="2"
                                    />
                                  </svg>
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-500" />
                                )}
                                <span>{file.name}</span>
                              </div>
                              <div className="col-span-2">{file.size}</div>
                              <div className="col-span-3 text-muted-foreground">
                                {file.date}
                              </div>
                              <div className="col-span-1 flex justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">File options</span>
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
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  File Operations
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Upload, download, and manage your files with a fast, reliable
                  interface that just works.
                </p>
                <ul className="space-y-3 mt-6">
                  {[
                    "Drag and drop multiple files for batch uploads",
                    "Preview images, videos, and documents directly in the browser",
                    "Organize files with folders and tags",
                    "Powerful search to find what you need quickly",
                    "Bulk operations: move, copy, delete, and download",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
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
                          className="h-3 w-3 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Access Control */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Access Control
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Manage permissions and access to your R2 storage with a
                  simple, intuitive interface.
                </p>
                <ul className="space-y-3 mt-6">
                  {[
                    "Generate pre-signed URLs with expiration dates",
                    "Set up public access for specific files or folders",
                    "Create and manage API tokens with granular permissions",
                    "Configure CORS policies with a visual editor",
                    "Set up IP restrictions and geo-blocking",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
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
                          className="h-3 w-3 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-xl border bg-background p-2 shadow-lg">
                <div className="absolute top-0 w-full h-12 bg-muted/30 flex items-center px-4 gap-1.5 rounded-t-lg">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="pt-12 p-4 h-[400px] overflow-hidden">
                  <div className="flex flex-col h-full rounded-md overflow-hidden border border-border/30">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary/70" />
                        <div className="font-medium">Access Control</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Create Token
                      </Button>
                    </div>
                    <div className="flex-1 p-4 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Shared Links</h3>
                        <div className="border border-border/30 rounded-md overflow-hidden">
                          <div className="grid grid-cols-12 text-sm font-medium p-3 bg-muted/10 border-b border-border/30">
                            <div className="col-span-5">File</div>
                            <div className="col-span-3">Expires</div>
                            <div className="col-span-3">Created</div>
                            <div className="col-span-1"></div>
                          </div>
                          <div className="divide-y divide-border/30">
                            {[
                              {
                                file: "presentation.pptx",
                                expires: "24 hours",
                                created: "Just now",
                              },
                              {
                                file: "report-2023.pdf",
                                expires: "7 days",
                                created: "Yesterday",
                              },
                              {
                                file: "product-demo.mp4",
                                expires: "30 days",
                                created: "Last week",
                              },
                            ].map((link, i) => (
                              <div
                                key={i}
                                className="grid grid-cols-12 items-center p-3 text-sm hover:bg-muted/5"
                              >
                                <div className="col-span-5 flex items-center gap-2">
                                  <Share2 className="h-4 w-4 text-primary/70" />
                                  <span>{link.file}</span>
                                </div>
                                <div className="col-span-3">{link.expires}</div>
                                <div className="col-span-3 text-muted-foreground">
                                  {link.created}
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">
                                      Link options
                                    </span>
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
                                      className="h-4 w-4"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="19" cy="12" r="1" />
                                      <circle cx="5" cy="12" r="1" />
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">API Tokens</h3>
                        <div className="border border-border/30 rounded-md overflow-hidden">
                          <div className="grid grid-cols-12 text-sm font-medium p-3 bg-muted/10 border-b border-border/30">
                            <div className="col-span-5">Name</div>
                            <div className="col-span-3">Permissions</div>
                            <div className="col-span-3">Created</div>
                            <div className="col-span-1"></div>
                          </div>
                          <div className="divide-y divide-border/30">
                            {[
                              {
                                name: "Upload Token",
                                permissions: "Write",
                                created: "2 days ago",
                              },
                              {
                                name: "Read-only Token",
                                permissions: "Read",
                                created: "1 week ago",
                              },
                              {
                                name: "Admin Token",
                                permissions: "Full Access",
                                created: "1 month ago",
                              },
                            ].map((token, i) => (
                              <div
                                key={i}
                                className="grid grid-cols-12 items-center p-3 text-sm hover:bg-muted/5"
                              >
                                <div className="col-span-5 flex items-center gap-2">
                                  <Key className="h-4 w-4 text-primary/70" />
                                  <span>{token.name}</span>
                                </div>
                                <div className="col-span-3">
                                  {token.permissions}
                                </div>
                                <div className="col-span-3 text-muted-foreground">
                                  {token.created}
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">
                                      Token options
                                    </span>
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
                                      className="h-4 w-4"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="19" cy="12" r="1" />
                                      <circle cx="5" cy="12" r="1" />
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Additional Features
                </h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
                  Betterflare comes packed with everything you need to make R2
                  management a breeze.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: Globe,
                    title: "Custom Domains",
                    description:
                      "Connect your own domains to serve content directly from your R2 buckets.",
                  },
                  {
                    icon: History,
                    title: "Version History",
                    description:
                      "Track changes to your files with automatic versioning and easy rollbacks.",
                  },
                  {
                    icon: Search,
                    title: "Advanced Search",
                    description:
                      "Find files quickly with powerful search capabilities including metadata and content.",
                  },
                  {
                    icon: Image,
                    title: "Image Optimization",
                    description:
                      "Automatically optimize and transform images on the fly with simple URL parameters.",
                  },
                  {
                    icon: Shield,
                    title: "Security Policies",
                    description:
                      "Set up comprehensive security policies to protect your data from unauthorized access.",
                  },
                  {
                    icon: FileText,
                    title: "Detailed Analytics",
                    description:
                      "Track usage, bandwidth, and storage metrics with beautiful, actionable dashboards.",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to simplify your R2 management?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started with Betterflare today and experience a better way
                  to manage your Cloudflare R2 storage.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/get-started">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/docs">Read the Docs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

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

function Key(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
