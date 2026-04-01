import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Sobre mí — Cristian Crovato',
  description: 'Escultor autodidacta cordobés especializado en personajes de comics y fantasía. Conocé mi historia, proceso y materiales.',
}

export default function SobreMiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      {/* Hero */}
      <div className="mb-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">Sobre mí</p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-text leading-tight mb-4">
          El artesano<br />de las fantasías
        </h1>
        <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
          De la ficción a la realidad, a través de la mente y la destreza de las manos.
        </p>
      </div>

      {/* Profile + bio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-accent/40 shrink-0">
            <Image
              src="/cristian-profile.jpg"
              alt="Cristian Crovato"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <div className="text-center lg:text-left">
            <p className="font-body text-xs uppercase tracking-[0.25em] text-accent mb-1">Escultor</p>
            <p className="font-heading text-xl font-semibold text-text">Cristian Crovato</p>
            <p className="font-body text-xs text-muted mt-1 flex items-center justify-center lg:justify-start gap-1.5">
              <span className="text-accent">◉</span> Córdoba, Argentina
            </p>
          </div>
          {/* Quick facts */}
          <div className="border-t border-border pt-4 w-full space-y-3 text-sm font-body">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-0.5">Autodidacta desde</p>
              <p className="text-text">Los 12 años · sin clases</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-0.5">Materiales</p>
              <p className="text-text">Plastilina, epóxico, arcilla</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-0.5">Tiempo por pieza</p>
              <p className="text-text">2 días — 6 meses</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-0.5">Exhibiciones</p>
              <p className="text-text">ComicCon BA · Feria del Libro Cba</p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="lg:col-span-2 space-y-5 font-body text-muted leading-relaxed">
          <p>
            Desde muy chico supe que quería crear con mis manos. Siendo fanático de los comics,
            las películas y los videojuegos, pasaba horas copiando personajes: Looney Tunes,
            Batman, Venom, Ryu, Freddy Krueger. Llegué al punto de pintar toda la pared de mi
            pieza con un mural de mis héroes favoritos.
          </p>
          <p>
            A los 12 años compré mi primera arcilla común y corriente y empecé a modelar solo,
            sin clases ni manual. La escultura fue el único lenguaje que me permitió hacer lo
            que el dibujo ya no podía: dar volumen, profundidad, textura.
          </p>
          <p>
            El punto de inflexión fue ver en televisión a{' '}
            <span className="text-text">Martín Canale</span>, el gran escultor argentino de
            Sideshow Collectibles. Ahí entendí que existía un camino de mejora continua, que
            cada figura podía ser mejor que la anterior. Me propuse aprender sus técnicas,
            sus métodos, y aplicarlos para llegar a mejores resultados.
          </p>
          <p>
            Hoy, desde Córdoba, las piezas viajan a todo el país —Buenos Aires, La Rioja,
            Rosario, Corrientes, Ushuaia— y también al exterior. Participé en la{' '}
            <span className="text-text">ComicCon de Buenos Aires</span> (Costa Salguero),
            la <span className="text-text">Feria del Libro de Córdoba</span> y en{' '}
            <span className="text-text">Twisted Factory</span>, el evento de figuras de
            colección más importante del país.
          </p>
          <p>
            Me defino como escultor. En todo caso, artesano. Lo más fascinante de este trabajo
            es crear la primera figura: ese momento en el que algo imaginario se vuelve real y
            tridimensional. Soy muy perfeccionista — no entrego nada con lo que no esté conforme.
          </p>
        </div>
      </div>

      {/* Portfolio overview banner */}
      <div className="border-t border-border pt-16 mb-20">
        <div className="relative w-full overflow-hidden bg-surface aspect-[4/5] sm:aspect-[4/3]">
          <Image
            src="/newphoto1.jpeg"
            alt="Selección de esculturas de Cristian Crovato"
            fill
            className="object-cover object-top"
            sizes="(max-width: 896px) 100vw, 896px"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="font-body text-xs uppercase tracking-widest text-accent/80">Una selección del trabajo</p>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="border-t border-border pt-16 mb-20">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">El proceso</p>
        <h2 className="font-heading text-3xl font-semibold text-text mb-2">Cómo trabajo</h2>
        <p className="font-body text-muted text-sm mb-10 max-w-xl">
          Cada pieza pasa por estas cinco etapas — ninguna se saltea, ninguna se apresura.
        </p>

        {/* Process image strip */}
        <div className="relative aspect-[16/5] w-full overflow-hidden mb-10 bg-surface">
          <Image
            src="/newphoto4.jpeg"
            alt="Esculturas de Cristian Crovato exhibidas — Old Man Logan, Batman y The Punisher"
            fill
            className="object-cover object-top"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="font-body text-xs uppercase tracking-widest text-accent/80">Exhibición · Argentina</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              n: '01',
              title: 'Materiales',
              desc: 'Plastilina mezclada con parafina y cera de abejas, epóxico, alambre y herramientas de modelado.',
              img: '/proceso-materiales.jpg',
              alt: 'Materiales: plastilina y herramientas',
            },
            {
              n: '02',
              title: 'Modelado',
              desc: 'El personaje toma forma sobre un esqueleto de alambre, capa por capa, hasta lograr cada detalle.',
              img: '/proceso-modelado.jpg',
              alt: 'Escultura en proceso de modelado, sin pintar',
            },
            {
              n: '03',
              title: 'Molde',
              desc: 'Se hace un molde de silicona de la pieza original para poder reproducirla fielmente.',
              img: '/proceso-molde.jpg',
              alt: 'Molde de silicona con resina vertida',
            },
            {
              n: '04',
              title: 'Copias',
              desc: 'Cada copia se vierte en resina y se desmolda. Todas pasan por control de calidad antes de pintarse.',
              img: '/proceso-copias.jpg',
              alt: 'Múltiples esculturas sin pintar recién desmoldadas',
            },
            {
              n: '05',
              title: 'Pintado',
              desc: 'Pintado a mano con acrílicos, aerógrafo y técnicas de sombreado. Cada pieza es única.',
              img: '/proceso-pintado.jpg',
              alt: 'Escultura de Batman siendo pintada a mano',
            },
          ].map(({ n, title, desc, img, alt }) => (
            <div key={n} className="flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-surface mb-3">
                <Image
                  src={img}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  unoptimized
                />
              </div>
              <p className="font-heading text-2xl font-semibold text-accent/40 mb-1">{n}</p>
              <h3 className="font-body text-sm uppercase tracking-wider text-text mb-1">{title}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Press */}
      <div className="border-t border-border pt-16 mb-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">En los medios</p>
        <h2 className="font-heading text-3xl font-semibold text-text mb-10">Lo que dijeron</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { src: '/articulo-1.jpg', caption: 'Expresión Norte — Febrero 2015', label: '"El señor de las esculturas (fantásticas)"' },
            { src: '/articulo-3.jpg', caption: 'La Rioja / Nueva Rioja — Agosto 2015', label: '"El artesano de las fantasías"' },
            { src: '/articulo-2.jpg', caption: 'La Rioja / Nueva Rioja — Agosto 2015', label: 'Nuevos horizontes — continuación' },
          ].map(({ src, caption, label }) => (
            <div key={src} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-surface border border-border">
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <p className="font-body text-xs text-accent mt-2">{caption}</p>
              <p className="font-body text-xs text-muted italic">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-heading text-2xl font-semibold text-text">¿Te interesa una pieza?</p>
          <p className="font-body text-sm text-muted mt-1">Hablemos por WhatsApp y lo resolvemos.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/obras"
            className="font-body text-sm uppercase tracking-wider text-muted hover:text-accent transition-colors border border-border px-5 py-3"
          >
            Ver obras
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-bold text-sm uppercase tracking-widest bg-accent hover:bg-accent-hover text-bg px-5 py-3 transition-colors"
          >
            Consultar
          </a>
        </div>
      </div>

    </div>
  )
}
