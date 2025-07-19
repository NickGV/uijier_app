"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import UjierApp from "@/components/ujier-app"

export default function Page() {
  return (
    <ErrorBoundary>
      <UjierApp />
    </ErrorBoundary>
  )
}
