"use client"

import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <div className="bg-primary">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
          <span className="block">Ready to streamline your workflow?</span>
          <span className="block mt-2">Start your free trial today.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-primary-foreground/90">
          Join thousands of satisfied customers who have transformed their business with StreamLine.
        </p>
        <div>
          <Button size="lg" variant="secondary" className="mt-8 bg-background text-primary hover:bg-secondary/90">
            Get started for free
          </Button>
        </div>
      </div>
    </div>
  )
}

