import { prisma } from '@/lib/prisma'
import { formatDate } from '@/utils/date'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | Fundación Paz Animal',
  description: 'Últimas noticias, historias de rescate y artículos sobre protección animal. Mantente informado sobre nuestras actividades y campañas.',
  keywords: 'blog paz animal, noticias rescate, historias animales, protección animal',
  openGraph: {
    title: 'Blog | Fundación Paz Animal',
    description: 'Últimas noticias y historias de rescate animal',
    type: 'website',
  },
}

// Static generation - revalidate every hour
export const revalidate = 3600

async function getPublications() {
  try {
    const publications = await prisma.publicacion.findMany({
      where: { publicada: true },
      include: {
        autor: {
          select: { name: true }
        },
        categoria: {
          select: { nombre: true, slug: true, color: true }
        }
      },
      orderBy: { fechaPublicacion: 'desc' },
      take: 12,
    })

    const categories = await prisma.categoriaPublicacion.findMany({
      include: {
        _count: {
          select: { publicaciones: { where: { publicada: true } } }
        }
      },
      orderBy: { nombre: 'asc' }
    })

    return { publications, categories }
  } catch (error) {
    console.error('Error fetching publications:', error)
    return { publications: [], categories: [] }
  }
}

export default async function BlogPage() {
  const { publications, categories } = await getPublications()

  const featuredPost = publications.find(p => p.destacada) || publications[0]
  const otherPosts = publications.filter(p => p.id !== featuredPost?.id)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nuestro Blog
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Historias de rescate, noticias y todo sobre protección animal
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && (
              <article className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden">
                {featuredPost.imagenDestacada && (
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={featuredPost.imagenDestacada}
                      alt={featuredPost.altImagen || featuredPost.titulo}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      {featuredPost.categoria && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: featuredPost.categoria.color || '#10B981' }}
                        >
                          {featuredPost.categoria.nombre}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>{featuredPost.autor.name}</span>
                    <span>•</span>
                    <time dateTime={featuredPost.fechaPublicacion?.toISOString()}>
                      {formatDate(featuredPost.fechaPublicacion)}
                    </time>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {featuredPost.titulo}
                    </Link>
                  </h2>
                  {featuredPost.resumen && (
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.resumen}
                    </p>
                  )}
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Leer más
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            )}

            {/* Other Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {otherPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {post.imagenDestacada && (
                    <div className="relative h-48">
                      <Image
                        src={post.imagenDestacada}
                        alt={post.altImagen || post.titulo}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        {post.categoria && (
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: post.categoria.color || '#10B981' }}
                          >
                            {post.categoria.nombre}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{post.autor.name}</span>
                      <span>•</span>
                      <time dateTime={post.fechaPublicacion?.toISOString()}>
                        {formatDate(post.fechaPublicacion)}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {post.titulo}
                      </Link>
                    </h3>
                    {post.resumen && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.resumen}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Leer más →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/categoria/${category.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || '#10B981' }}
                      />
                      <span className="text-gray-700">{category.nombre}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {category._count.publicaciones}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">¿Quieres ayudar?</h3>
              <p className="text-gray-600 mb-4">
                Tu donación nos ayuda a seguir rescatando y cuidando animales en situación de vulnerabilidad.
              </p>
              <Link
                href="/donar"
                className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
              >
                Donar Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
