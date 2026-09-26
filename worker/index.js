const ACCESS_CODE = "aQdk150EXmnlNnMlHYmvcPHi62ZKQZFruwia0sa5tRY";
export default { 
  async fetch(request, env) { 
    const url = new URL(request.url);
    // Вход по QR-коду
    if (url.pathname === `/access/${ACCESS_CODE}`) {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `catalog_access=${ACCESS_CODE}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
          "Cache-Control": "no-store"
        }
      });
    }

    // Проверяем доступ
    const cookies = request.headers.get("Cookie") || "";

    if (!cookies.includes(`catalog_access=${ACCESS_CODE}`)) {
      return new Response(
        "Доступ закрыт.",
        {
          status: 403,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow, noarchive"
          }
        }
      );
    }

    // Доступ разрешён
    const response = await env.ASSETS.fetch(request);

    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  } 
};
