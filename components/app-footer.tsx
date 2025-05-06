export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <span className="font-peralta text-xl text-[#089455] mr-2">Develop Tools</span>
          <span className="text-sm text-muted-foreground">Ferramentas úteis para manipulação de texto</span>
        </div>
        <div className="text-sm text-muted-foreground">© {currentYear} Develop Tools. Todos os direitos reservados.</div>
      </div>
    </footer>
  )
}
