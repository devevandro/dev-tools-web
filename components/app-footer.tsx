import { appConfig } from "@/lib/config"

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <span className="font-peralta text-xl text-[#089455] mr-2">{appConfig.name}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          © {currentYear} {appConfig.name} v{appConfig.version}
        </div>
      </div>
    </footer>
  )
}
