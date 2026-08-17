import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa'

const socialLinks = [
  {
    label: 'Instagram',
    href: process.env.INSTAGRAM_URL || 'https://instagram.com',
    icon: <FaInstagram className="h-5 w-5" />,
  },
  {
    label: 'Facebook',
    href: process.env.FACEBOOK_URL || 'https://facebook.com',
    icon: <FaFacebookF className="h-5 w-5" />,
  },
  {
    label: 'LinkedIn',
    href: process.env.LINKEDIN_URL || 'https://linkedin.com',
    icon: <FaLinkedinIn className="h-5 w-5" />,
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="contactos" className="border-t border-slate-200 bg-white/80 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600 dark:text-slate-400 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Contactos</div>
            <div className="mt-2 text-sm leading-7">
              Rua Vicente Ferreira 60-64, Cidade Baixa, Huambo
              <br />
              Telefone: +244 931 841 595
              <br />
              Email: apoio@neph.ao
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-[#f8f4ea] hover:text-[#b98b2d] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="md:text-right">
            <div className="font-semibold text-slate-900 dark:text-white">© {year} Nova Escola Politécnica do Huambo</div>
            <div className="mt-2 text-sm leading-7">Todos os direitos reservados.</div>
            <a href="/direccao" className="mt-4 inline-flex items-center text-sm font-medium text-[#b98b2d] transition hover:text-[#8c6a1d] dark:text-[#f2d79d] dark:hover:text-[#f7dfab]">
              Aceder ao painel da direção
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
