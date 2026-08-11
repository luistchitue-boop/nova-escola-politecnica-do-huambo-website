export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 bg-white/80 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600 dark:text-slate-400 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-base font-semibold text-slate-900 dark:text-white">Nova Escola Politécnica do Huambo</div>
            <div className="mt-2 text-sm leading-7">Rua Exemplo 123, Huambo — Angola</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Contactos</div>
            <div className="mt-2 text-sm leading-7">Telefone: +244 912 345 678<br />Email: geral@escolahuambo.ao</div>
          </div>
          <div className="md:text-right">
            <div className="font-semibold text-slate-900 dark:text-white">© {year} Nova Escola Politécnica do Huambo</div>
            <div className="mt-2 text-sm leading-7">Entidade certificada — Ensino privado. Todos os direitos reservados.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
