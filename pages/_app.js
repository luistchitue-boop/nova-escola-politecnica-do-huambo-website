import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />

        <link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#08263a" />

        {/* Open Graph defaults */}
        <meta property="og:locale" content="pt_PT" />
        <meta property="og:site_name" content="Nova Escola Politécnica do Huambo" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.svg" />

        {/* JSON-LD Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "School",
          "name": "Nova Escola Politécnica do Huambo",
          "url": "https://example.org",
          "logo": "https://example.org/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua Exemplo 123",
            "addressLocality": "Huambo",
            "addressCountry": "AO"
          },
          "telephone": "+244912345678"
        }) }} />
      </Head>
      <a href="#main-content" className="skip-link">Saltar para o conteúdo</a>
      <Component {...pageProps} />
    </>
  )
}
