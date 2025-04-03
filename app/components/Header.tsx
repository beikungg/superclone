"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: '首页', href: '/' },
  { name: '功能特点', href: '#features' },
  { name: 'SUPERCLONE', href: '/superclone' },
]

export default function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              SUPERCLONE
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:inline-flex">
              登录
            </Button>
            <Button>注册</Button>
          </div>
        </div>
      </div>
    </header>
  )
}

