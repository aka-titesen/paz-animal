import { prisma } from '@/lib/prisma'
import { formatDate } from '@/utils/date'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for all published posts
export async function generateStaticParams() {
  const posts = await prisma.publicacion.findMany({
    where: { publicada: true },
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.publicacion.findUnique({
    where: { slug: params.slug, publicada: true },
    select: {
      titulo: true,
      resumen: true,
      metaTitulo: true,
      metaDescripcion: true,
      palabrasClave: true,
      imagenDestacada: true,
      fechaPublicacion: true,
    }
  })

  if (!post) {
    return {
      title: 'Artículo no encontrado',
    }
  }

  return {
    title: post.metaTitulo || `${post.titulo} | Blog Paz Animal`,
    description: post.metaDescripcion || post.resumen || 'Artículo del blog de Fundación Paz Animal',
    keywords: post.palabrasClave,
    openGraph: {
      title: post.titulo,
      description: post.resumen || 'Artículo del blog de Fundación Paz Animal',
      type: 'article',
      publishedTime: post.fechaPublicacion?.toISOString(),
      images: post.imagenDestacada ? [post.imagenDestacada] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.publicacion.findUnique({
    where: {
      slug: params.slug,
      publicada: true
    },
    include: {
      autor: {
        select: { name: true, image: true }
      },
      categoria: {
        select: { nombre: true, slug: true, color: true }
      }
    }
  })

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await prisma.publicacion.findMany({
    where: {
      publicada: true,
      id: { not: post.id },
      categoriaId: post.categoriaId,
    },
    include: {
      categoria: {
        select: { nombre: true, color: true }
      }
    },
    take: 3,
    orderBy: { fechaPublicacion: 'desc' }
  })

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative">
        {post.imagenDestacada && (
          <div className="relative h-64 md:h-96 lg:h-[500px]">
            <Image
              src={post.imagenDestacada}
              alt={post.altImagen || post.titulo}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-6 md:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  {post.categoria && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
                      style={{ backgroundColor: post.categoria.color || '#10B981' }}
                    >
                      {post.categoria.nombre}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {post.titulo}
                  </h1>
                  {post.resumen && (
                    <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-3xl">
                      {post.resumen}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Meta */}
        <div className={`${post.imagenDestacada ? '' : 'pt-20'} bg-white border-b`}>
          <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
            {!post.imagenDestacada && (
              <>
                {post.categoria && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
                    style={{ backgroundColor: post.categoria.color || '#10B981' }}
                  >
                    {post.categoria.nombre}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {post.titulo}
                </h1>
                {post.resumen && (
                  <p className="text-lg md:text-xl text-gray-600 mb-6">
                    {post.resumen}
                  </p>
                )}
              </>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {post.autor.image && (
                <Image
                  src={post.autor.image}
                  alt={post.autor.name || 'Autor'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{post.autor.name}</div>
                <div className="flex items-center gap-2">
                  <time dateTime={post.fechaPublicacion?.toISOString()}>
                    {formatDate(post.fechaPublicacion)}
                  </time>
                  <span>•</span>
                  <span>{Math.ceil(post.contenido.length / 1000)} min de lectura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          {/* Render markdown content */}
          <div dangerouslySetInnerHTML={{ __html: post.contenido.replace(/\n/g, '<br />') }} />
        </div>
      </main>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Artículos Relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedPost.imagenDestacada && (
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.imagenDestacada}
                        alt={relatedPost.altImagen || relatedPost.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {relatedPost.categoria && (
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white mb-3"
                        style={{ backgroundColor: relatedPost.categoria.color || '#10B981' }}
                      >
                        {relatedPost.categoria.nombre}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {relatedPost.titulo}
                      </Link>
                    </h3>
                    {relatedPost.resumen && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {relatedPost.resumen}
                      </p>
                    )}
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Leer más →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Te gustó este artículo?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Ayúdanos a seguir rescatando y protegiendo animales con tu donación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donar"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Hacer una Donación
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-primary-700 transition-colors"
            >
              Ver más artículos
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
