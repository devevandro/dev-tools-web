import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Calculator,
  GitCompare,
  FileText,
  FileSearch,
  FileJson,
  KeyRound,
  Lock,
  Code,
  Database,
  Braces,
  CreditCard,
  Building2,
  Terminal,
  Pipette,
  CheckCircle,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] w-full p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-[#089455] mb-6">
        <span className="font-peralta text-4xl">Develop Tools</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Utilize nossas ferramentas para análise e manipulação de texto.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Calculator className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Contador de Caracteres</h2>
          <p className="text-gray-600 mb-4">Conte caracteres, palavras e linhas em qualquer texto.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/contador">Acessar Contador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <GitCompare className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Comparador de .env</h2>
          <p className="text-gray-600 mb-4">Compare dois arquivos .env e identifique diferenças entre eles.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/comparador">Acessar Comparador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <FileText className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Comparador de Textos</h2>
          <p className="text-gray-600 mb-4">Compare dois textos e visualize as diferenças entre eles.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/comparador-textos">Acessar Comparador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <FileSearch className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Localizar e Substituir</h2>
          <p className="text-gray-600 mb-4">Encontre e substitua trechos específicos em qualquer texto.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/localizar-substituir">Acessar Ferramenta</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <FileJson className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">.env para JSON</h2>
          <p className="text-gray-600 mb-4">Converta arquivos .env para o formato JSON.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/env-to-json">Acessar Conversor</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <FileJson className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">JSON para .env</h2>
          <p className="text-gray-600 mb-4">Converta arquivos JSON para o formato .env.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/json-to-env">Acessar Conversor</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <KeyRound className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Hash de Senhas</h2>
          <p className="text-gray-600 mb-4">Gere e verifique hashes de senhas com o algoritmo Apache MD5.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/hash-senha">Acessar Ferramenta</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Lock className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Gerador de Senhas</h2>
          <p className="text-gray-600 mb-4">Crie senhas fortes e seguras com diversos critérios.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/gerador-senha">Acessar Gerador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Terminal className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Senhas OpenSSL</h2>
          <p className="text-gray-600 mb-4">Gere senhas seguras usando o método OpenSSL.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/openssl-senha">Acessar Gerador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Code className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Comparador de JavaScript</h2>
          <p className="text-gray-600 mb-4">Compare códigos JavaScript e verifique se são equivalentes.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/comparador-javascript">Acessar Comparador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Database className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Extrator de IDs MongoDB</h2>
          <p className="text-gray-600 mb-4">Extraia IDs de uma coleção MongoDB para uso em consultas.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/mongo-ids">Acessar Extrator</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Braces className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Formatador de JSON</h2>
          <p className="text-gray-600 mb-4">Formate e visualize JSON com syntax highlighting.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/json-formatter">Acessar Formatador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <CreditCard className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Gerador de CPF</h2>
          <p className="text-gray-600 mb-4">Gere números de CPF válidos para testes e desenvolvimento.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/gerador-cpf">Acessar Gerador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Building2 className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Gerador de CNPJ</h2>
          <p className="text-gray-600 mb-4">Gere números de CNPJ válidos para testes e desenvolvimento.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/gerador-cnpj">Acessar Gerador</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <Pipette className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Coletor de Cores</h2>
          <p className="text-gray-600 mb-4">Capture e analise cores de imagens ou crie sua própria paleta.</p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/coletor-cores">Acessar Coletor</Link>
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
          <CheckCircle className="h-12 w-12 text-[#089455] mb-4" />
          <h2 className="text-xl font-semibold text-[#089455] mb-2">Validador CPF/CNPJ</h2>
          <p className="text-gray-600 mb-4">
            Verifique se um CPF ou CNPJ é válido de acordo com os algoritmos oficiais.
          </p>
          <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
            <Link href="/validador-cpf-cnpj">Acessar Validador</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
