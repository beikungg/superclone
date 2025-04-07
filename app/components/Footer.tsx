import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">PRODUCT</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">COMPANY</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">LEGAL</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center border-t border-border pt-8">
          <p className="text-base text-muted-foreground">
            &copy; 2024 SUPERCLONE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

