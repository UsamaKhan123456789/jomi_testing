// Vercel Serverless Function for Deep Link Redirect
// Path: /api/article/[articleId].js

export default function handler(req, res) {
  // Handle both pubId and publd (typo) for backward compatibility
  const { articleId, pubId, publd, slug } = req.query;
  const publicationId = pubId || publd;
  
  // Get user agent to detect mobile devices
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Validate articleId
  if (!articleId || articleId.trim() === '') {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body><h1>Article ID is required</h1></body>
      </html>
    `);
  }
  
  // Build web URL: https://jomi.com/article/{publicationId}/{slug}
  const webUrl = (publicationId && slug) 
    ? `https://jomi.com/article/${publicationId}/${slug}`
    : null;
  
  // App deep link: jomi://article/{articleId}
  const appDeepLink = `jomi://article/${articleId}`;
  
  if (isMobile) {
    // Mobile device: Try to open app, fallback to web if app not installed
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Opening Article in Jomi App...</title>
        ${webUrl ? `<meta http-equiv="refresh" content="2;url=${webUrl}">` : ''}
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 400px;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 15px 30px;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>Opening in Jomi App...</h1>
          <p>If the app doesn't open, you'll be redirected to the website...</p>
          ${webUrl ? `<a href="${webUrl}" class="button">Continue to Website</a>` : ''}
        </div>
        <script>
          (function() {
            let appOpened = false;
            const appLink = "${appDeepLink}";
            ${webUrl ? `const webUrl = "${webUrl}";` : ''}
            
            // Try to open app using iframe (works better on mobile)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = appLink;
            document.body.appendChild(iframe);
            
            // Also try direct location change
            setTimeout(function() {
              if (!appOpened) {
                window.location.href = appLink;
              }
            }, 100);
            
            // Detect if app opened
            let startTime = Date.now();
            
            // Method 1: Visibility change
            document.addEventListener('visibilitychange', function() {
              if (document.hidden) {
                appOpened = true;
              }
            });
            
            // Method 2: Blur event
            window.addEventListener('blur', function() {
              appOpened = true;
            });
            
            // Method 3: Pagehide (iOS)
            window.addEventListener('pagehide', function() {
              appOpened = true;
            });
            
            // Redirect to web if app doesn't open within 1.5 seconds
            ${webUrl ? `setTimeout(function() {
              if (!appOpened) {
                window.location.replace(webUrl);
              }
            }, 1500);` : ''}
            
            // Final safety redirect after 3 seconds
            ${webUrl ? `setTimeout(function() {
              if (document.visibilityState === 'visible') {
                window.location.replace(webUrl);
              }
            }, 3000);` : ''}
          })();
        </script>
      </body>
      </html>
    `);
  } else {
    // Desktop: Redirect directly to web URL if available
    if (webUrl) {
      res.writeHead(302, { 'Location': webUrl });
      return res.end();
    }
    
    // Fallback: Show "Open in App" page
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Open Article in Jomi App</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 500px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
          }
          .button {
            display: inline-block;
            padding: 15px 40px;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 18px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📱 Open in Jomi App</h1>
          <p>Scan this page with your mobile device to open the article in the Jomi app.</p>
          <a href="${appDeepLink}" class="button">Open in App</a>
        </div>
      </body>
      </html>
    `);
  }
}
