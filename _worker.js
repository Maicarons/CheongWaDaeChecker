export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get('url')

    if (!target) {
      return new Response('Missing ?url= query parameter', { status: 400 })
    }

    try {
      const response = await fetch(target, {
        headers: {
          // 继承原请求的 headers 可选
          'User-Agent': request.headers.get('User-Agent') || ''
        }
      })

      const headers = new Headers(response.headers)
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Access-Control-Allow-Headers', '*')
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

      const body = await response.arrayBuffer()

      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers
      })
    } catch (err) {
      return new Response(`Proxy fetch failed: ${err}`, { status: 502 })
    }
  }
}
