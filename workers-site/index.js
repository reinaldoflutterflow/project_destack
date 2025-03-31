import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    
    // Tenta servir o arquivo solicitado do KV
    const page = await getAssetFromKV(event, options)

    // allow headers to be altered
    const response = new Response(page.body, page)

    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'unsafe-url')
    response.headers.set('Feature-Policy', 'none')

    return response

  } catch (e) {
    // Se o arquivo não for encontrado, tenta servir o index.html
    // Isso é útil para SPAs que usam rotas do lado do cliente
    if (e.status === 404 && url.pathname !== '/') {
      try {
        // Serve o index.html para qualquer rota não encontrada
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        })

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 200, // Retorna 200 em vez de 404
        })
      } catch (e) {
        // Se ainda assim falhar, retorna um erro 404
        return new Response('Página não encontrada', { status: 404 })
      }
    }

    // Caso contrário, retorna o erro original
    return new Response(e.message || e.toString(), { status: 500 })
  }
}
