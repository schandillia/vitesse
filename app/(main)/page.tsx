import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      {/* ── Typography ── */}
      <section className="font-bold space-y-4">
        <div className="space-x-4">
          <Link href="/about">About</Link>
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <h1 className="text-pink-500">Nunito Blue Test</h1>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Typography
        </p>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-serif">
          The quick brown fox
        </h1>
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Jumps over the lazy dog
        </h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Section heading, level three
        </h3>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Section heading, level four
        </h4>
        <p className="leading-7 text-base max-w-prose">
          This is body text. It uses your theme's foreground color and Open
          Sans. Long paragraphs should feel comfortable and readable at this
          size and line height.
        </p>
        <p className="text-sm text-muted-foreground max-w-prose">
          Small muted text — useful for captions, helper text, timestamps, and
          secondary descriptions that shouldn't compete with primary content.
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          Monospaced · IBM Plex Mono · xs size · for code, metadata, labels
        </p>
        <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground font-serif text-lg">
          "Design is not just what it looks like and feels like. Design is how
          it works."
        </blockquote>
        <div className="flex flex-wrap gap-2 items-baseline">
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            xs
          </span>
          <span className="text-sm bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            sm
          </span>
          <span className="text-base bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            base
          </span>
          <span className="text-lg bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            lg
          </span>
          <span className="text-xl bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            xl
          </span>
          <span className="text-2xl bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            2xl
          </span>
          <span className="text-3xl bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            3xl
          </span>
        </div>
      </section>

      <hr className="border-border" />

      {/* ── Buttons ── */}
      <section className="space-y-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Buttons
        </p>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Variants</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Sizes</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="icon button">
              ✦
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">States</p>
          <div className="flex flex-wrap gap-3">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* ── Inputs ── */}
      <section className="space-y-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Input
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Default</label>
            <Input placeholder="Enter some text…" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">With value</label>
            <Input defaultValue="amit@example.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" defaultValue="hunter2" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Disabled</label>
            <Input placeholder="Can't touch this" disabled />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium">File</label>
            <Input type="file" />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* ── Textarea ── */}
      <section className="space-y-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Textarea
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Default</label>
            <Textarea placeholder="Write something…" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Disabled</label>
            <Textarea placeholder="Read only" disabled />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium">With value</label>
            <Textarea
              defaultValue="This textarea has some pre-filled content to show how text looks inside the component with your current theme."
              rows={4}
            />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* ── Cards ── */}
      <section className="space-y-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Cards
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basic */}
          <Card>
            <CardHeader>
              <CardTitle>Basic card</CardTitle>
              <CardDescription>
                Just a header and content, no footer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards group related content and actions. They can contain
                anything from text to forms to charts.
              </p>
            </CardContent>
          </Card>

          {/* With footer */}
          <Card>
            <CardHeader>
              <CardTitle>With footer</CardTitle>
              <CardDescription>
                Includes a call to action below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Footer area is great for primary actions or navigation links
                related to the card's content.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get started</Button>
            </CardFooter>
          </Card>

          {/* Stat card */}
          <Card>
            <CardHeader>
              <CardDescription>Monthly revenue</CardDescription>
              <CardTitle className="text-3xl font-bold">$48,295</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                +12.4% compared to last month
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                View report
              </Button>
            </CardFooter>
          </Card>

          {/* Form card */}
          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button className="flex-1">Sign in</Button>
              <Button variant="outline" className="flex-1">
                Create account
              </Button>
            </CardFooter>
          </Card>

          {/* Destructive card */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
              <CardDescription>This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Permanently deletes your account and all associated data.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-full">
                Delete account
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
