import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Evento ${params.slug} - Paz Animal`,
    description: 'Evento de la Fundación Paz Animal',
    openGraph: {
      title: `Evento ${params.slug} - Paz Animal`,
      description: 'Evento de la Fundación Paz Animal',
      type: 'article',
    },
  }
}

export default function EventoPage({ params }: PageProps) {
  // Por ahora redirigimos a la página de eventos principal
  notFound()
}
