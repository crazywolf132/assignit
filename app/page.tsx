import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Zap, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Assign stories with confidence
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Streamline your agile planning with AI-powered story point assignment. Balance workloads automatically and keep your team productive.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/app"
                className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4 inline-block" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Faster Planning</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need for efficient story assignment
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Stop struggling with manual story assignments. Our intelligent system helps you distribute work fairly and efficiently.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-white">
                <Sparkles className="h-5 w-5 flex-none text-indigo-400" />
                AI-Powered OCR
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-300">
                <p className="flex-auto">
                  Upload images of your stories and let our AI extract and format them automatically. No more manual entry.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-white">
                <Users className="h-5 w-5 flex-none text-indigo-400" />
                Smart Workload Balancing
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-300">
                <p className="flex-auto">
                  Automatically balance story points across team members while respecting individual capacity limits.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-white">
                <Zap className="h-5 w-5 flex-none text-indigo-400" />
                Drag & Drop Interface
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-300">
                <p className="flex-auto">
                  Intuitive drag and drop interface for quick adjustments. Fine-tune assignments with ease.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 border-t border-zinc-800">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by agile teams everywhere
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">
              Streamline your planning sessions and keep your team focused on what matters.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-3 bg-white/5">
            <div className="flex flex-col p-8">
              <dt className="text-sm font-semibold leading-6 text-zinc-300">Stories processed</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white">100k+</dd>
            </div>
            <div className="flex flex-col p-8">
              <dt className="text-sm font-semibold leading-6 text-zinc-300">Time saved</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white">1000+ hours</dd>
            </div>
            <div className="flex flex-col p-8">
              <dt className="text-sm font-semibold leading-6 text-zinc-300">Team satisfaction</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white">99%</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 border-t border-zinc-800">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to streamline your planning?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Start assigning stories more efficiently today. No credit card required.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Link
              href="/app"
              className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
            >
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-t border-zinc-800">
        <div className="text-center">
          <p className="text-sm leading-6 text-zinc-400">
            &copy; 2024 Assign-it. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
