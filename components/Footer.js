export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <div className="font-semibold">Nova Escola Politécnica do Huambo</div>
            <div className="text-xs mt-1">Rua Exemplo 123, Huambo — Angola</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Contactos</div>
            <div className="text-xs mt-1">Telefone: +244 912 345 678 · Email: geral@escolahuambo.ao</div>
          </div>
          <div className="text-right">
            <div className="font-medium">© {year} Nova Escola Politécnica do Huambo</div>
            <div className="text-xs mt-1">Entidade certificada — Ensino privado. Todos os direitos reservados.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
