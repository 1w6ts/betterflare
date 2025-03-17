"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Cloud,
  Database,
  Lock,
  Zap,
  ArrowRight,
  ExternalLink,
  Command,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FaCloud, FaGithub } from "react-icons/fa";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90 items-center">
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur transition-all duration-200 ${
          scrolled ? "border-b bg-background/80" : "bg-background/0"
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

      <main className="flex-1">
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                <span className="text-xs font-medium">
                  100% Free & Open Source
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                R2 management that{" "}
                <span className="text-primary">doesn't hurt</span> your soul
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Let's face it — Cloudflare's dashboard... sucks. Betterflare is
                our free, open source love letter to everyone who's ever
                rage-quit the Cloudflare dashboard and wished for something
                better.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <Button asChild size="lg" className="h-12 px-8 font-medium">
                  <Link href="/get-started">
                    Rescue Me Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-12 px-8 font-medium"
                >
                  <Link
                    href="https://github.com/betterflare/dashboard"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaGithub className="mr-2 h-4 w-4" />
                    Star on GitHub
                  </Link>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Free forever. No premium tier. No usage limits. Just open source
                goodness.
              </div>
            </motion.div>

            <motion.div
              className="mt-16 md:mt-24 relative"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary-foreground/20 rounded-xl blur-xl opacity-50"></div>
              <div className="relative overflow-hidden rounded-xl border bg-background/80 shadow-xl">
                <div className="absolute top-0 w-full h-12 bg-muted/30 flex items-center px-4 gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                  <div className="ml-4 h-6 w-[60%] rounded-md bg-muted/30"></div>
                </div>
                <div className="pt-12 p-4 h-[720px] overflow-hidden">
                  <div className="flex h-full rounded-md overflow-hidden border border-border/30">
                    {/* Sidebar */}
                    <div className="w-56 bg-muted/30 border-r border-border/30 flex flex-col">
                      <div className="p-4 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/20"></div>
                          <div className="h-4 w-24 bg-muted rounded-md"></div>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-md flex items-center gap-2 ${
                              i === 0 ? "bg-primary/10" : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-md bg-primary/20"></div>
                            <div className="h-3 w-20 bg-muted rounded-md"></div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto p-3 border-t border-border/30">
                        <div className="p-2 rounded-md flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-muted"></div>
                          <div className="h-3 w-16 bg-muted rounded-md"></div>
                        </div>
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 bg-background flex flex-col">
                      {/* Header */}
                      <div className="p-4 border-b border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-40 bg-muted/30 rounded-md"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted/30"></div>
                          <div className="h-8 w-24 bg-primary/10 rounded-md"></div>
                        </div>
                      </div>

                      {/* Dashboard content */}
                      <div className="p-6 overflow-auto flex-1">
                        <div className="mb-6">
                          <div className="h-8 w-64 bg-muted/30 rounded-md mb-2"></div>
                          <div className="h-4 w-96 bg-muted/20 rounded-md"></div>
                        </div>

                        {/* Stats cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="border border-border/30 rounded-lg p-4 bg-card"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="h-4 w-24 bg-muted/30 rounded-md"></div>
                                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                                  <div className="w-4 h-4 rounded-sm bg-primary/30"></div>
                                </div>
                              </div>
                              <div className="h-8 w-20 bg-foreground/5 rounded-md mb-2"></div>
                              <div className="h-3 w-32 bg-muted/20 rounded-md"></div>
                            </div>
                          ))}
                        </div>

                        {/* Table */}
                        <div className="border border-border/30 rounded-lg overflow-hidden">
                          <div className="bg-muted/10 p-4 border-b border-border/30 flex items-center justify-between">
                            <div className="h-5 w-40 bg-muted/30 rounded-md"></div>
                            <div className="flex gap-2">
                              <div className="h-8 w-20 bg-muted/20 rounded-md"></div>
                              <div className="h-8 w-8 rounded-md bg-primary/10"></div>
                            </div>
                          </div>
                          <div className="divide-y divide-border/30">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="p-4 flex items-center gap-4 hover:bg-muted/5"
                              >
                                <div className="w-6 h-6 rounded-md bg-muted/30"></div>
                                <div className="h-4 w-48 bg-muted/20 rounded-md"></div>
                                <div className="h-4 w-24 bg-muted/10 rounded-md ml-auto"></div>
                                <div className="h-4 w-20 bg-muted/10 rounded-md"></div>
                                <div className="h-7 w-7 rounded-md bg-muted/20"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"></div>
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  The Good Stuff
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  All the things you wish Cloudflare had built
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                  We've taken everything painful about the Cloudflare R2
                  experience and fixed it. You're welcome.
                </p>
              </motion.div>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  icon: Database,
                  title: "Buckets That Make Sense",
                  description:
                    "Create and manage buckets without the endless loading screens and cryptic error messages. Yes, we'll actually tell you why something failed.",
                  delay: 0,
                },
                {
                  icon: Zap,
                  title: "Uploads That Actually Work",
                  description:
                    "Drag, drop, and you're done. No more failed uploads with zero explanation. Bulk operations that don't time out when you look at them funny.",
                  delay: 0.1,
                },
                {
                  icon: Lock,
                  title: "Permissions Without Tears",
                  description:
                    "Set up access controls without needing a PhD in Cloudflare-ology. Generate shareable links that your grandma could understand.",
                  delay: 0.2,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                >
                  <div className="absolute -inset-px bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity"></div>
                  <div className="relative space-y-4 rounded-lg border p-6 hover:shadow-md transition-shadow">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/features"
                        className="inline-flex items-center text-sm font-medium text-primary"
                      >
                        Learn more <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  The Magic Behind the Curtain
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Dead simple setup, surprisingly powerful, completely free
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  We connect to your Cloudflare account with the bare minimum
                  permissions needed. No sketchy access requests, no "we need
                  your firstborn child" permissions.
                </p>
                <ul className="space-y-4 mt-6">
                  {[
                    "Connect with a token that doesn't require your entire Cloudflare kingdom",
                    "See all your buckets instantly—no 'something went wrong' messages here",
                    "Manage files with an interface designed by people who actually use R2",
                    "Set up policies without hunting through seventeen different menus",
                    "Enjoy all features for free—no premium tier, no usage limits, no surprises",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
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
                    </motion.li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </div>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    width={1280}
                    height={720}
                    alt="Dashboard interface"
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="order-2 lg:order-1 relative mt-8 lg:mt-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    width={1280}
                    height={720}
                    alt="GitHub repository"
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Free & Open Source
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  No catches, no hidden fees, no nonsense
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Betterflare is 100% free and open source. We built this
                  because we needed it ourselves, and we're sharing it with you
                  because everyone deserves better tools.
                </p>
                <ul className="space-y-4 mt-6">
                  {[
                    "MIT licensed—use it however you want",
                    "No premium features hidden behind paywalls",
                    "Self-host it or use our hosted version, both free",
                    "Contribute back if you want, or just enjoy using it",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
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
                    </motion.li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="https://github.com/1w6ts/betterflare">
                      <FaGithub className="mr-2 h-4 w-4" />
                      View on GitHub
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to stop hating your R2 experience?
                </h2>
                <p className="text-muted-foreground md:text-lg max-w-[600px] mx-auto">
                  Life's too short for bad dashboards. Join us in the promised
                  land of free, open source R2 management that doesn't make you
                  question your career choices.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="h-12 px-8 font-medium">
                  <Link href="/dashboard">
                    Show Me the Better Way{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-12 px-8 font-medium"
                >
                  <Link href="/docs" target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Read the Docs
                  </Link>
                </Button>
              </div>
              <div className="pt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/50"></div>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
