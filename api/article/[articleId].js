// Vercel Serverless Function for Deep Link Redirect
// Path: /api/article/[articleId].js

export default function handler(req, res) {
  const { articleId, pubId, slug } = req.query;
  
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
  
  // Build web URL if we have publicationId and slug
  const webUrl = (pubId && slug) 
    ? `https://jomi.com/article/${pubId}/${slug}`
    : null;
  
  if (isMobile) {
    // Mobile device: Try to open app, fallback to web if app not installed
    const customSchemeUrl = `jomi://article/${articleId}`;
    
    // Return HTML that tries to open app, then redirects to web after timeout
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
            transition: transform 0.2s;
          }
          .button:hover {
            transform: scale(1.05);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>Opening in Jomi App...</h1>
          <p id="message">${webUrl ? 'If the app doesn\'t open, you\'ll be redirected to the website...' : 'If the app doesn\'t open automatically, tap the button below:'}</p>
          ${webUrl ? `<a href="${webUrl}" id="webLink" style="color: white; text-decoration: underline; margin-top: 20px; display: block;">Or continue to website</a>` : ''}
          ${!webUrl ? `<a href="${customSchemeUrl}" class="button" id="openAppBtn" style="display: none;">Open in App</a>` : ''}
        </div>
        <noscript>
          ${webUrl ? `<meta http-equiv="refresh" content="0;url=${webUrl}">` : ''}
        </noscript>
        <iframe id="hiddenIframe" style="display: none;"></iframe>
        <script>
          (function() {
            let appOpened = false;
            let redirectTimer;
            const customSchemeUrl = "${customSchemeUrl}";
            ${webUrl ? `const webUrl = "${webUrl}";` : ''}
            
            // Method 1: Try using hidden iframe (more reliable on mobile)
            const iframe = document.getElementById('hiddenIframe');
            iframe.src = customSchemeUrl;
            
            // Method 2: Also try direct location change
            setTimeout(function() {
              if (!appOpened) {
                window.location.href = customSchemeUrl;
              }
            }, 100);
            
            // Detect if app opened using multiple methods
            // Method 1: Visibility change (page hidden = app opened)
            document.addEventListener('visibilitychange', function() {
              if (document.hidden) {
                appOpened = true;
                if (redirectTimer) clearTimeout(redirectTimer);
              }
            });
            
            // Method 2: Page blur (user switched apps)
            window.addEventListener('blur', function() {
              appOpened = true;
              if (redirectTimer) clearTimeout(redirectTimer);
            });
            
            // Method 3: Page focus loss (iOS Safari)
            window.addEventListener('pagehide', function() {
              appOpened = true;
              if (redirectTimer) clearTimeout(redirectTimer);
            });
            
            // Fallback: If app doesn't open after 1.5 seconds, redirect to web
            redirectTimer = setTimeout(function() {
              if (!appOpened) {
                ${webUrl 
                  ? `// Force redirect to web URL
                  window.location.replace(webUrl);`
                  : 'document.getElementById("openAppBtn").style.display = "inline-block";'}
              }
            }, 1500);
            
            // Additional safety: If still on page after 3 seconds, force redirect
            ${webUrl ? `setTimeout(function() {
              if (document.visibilityState === 'visible') {
                window.location.replace(webUrl);
              }
            }, 3000);` : ''}
            
            // Show button after 1 second if web URL is not available
            ${!webUrl ? `setTimeout(function() {
              document.getElementById("openAppBtn").style.display = "inline-block";
            }, 1000);` : ''}
          })();
        </script>
      </body>
      </html>
    `);
  } else {
    // Desktop: Redirect to web URL if available, otherwise show "Open in App" page
    if (webUrl) {
      // Redirect directly to web URL
      res.writeHead(302, { 'Location': webUrl });
      return res.end();
    }
    
    // Fallback: Show web page with "Open in App" button
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Open Article in Jomi App</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
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
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          p {
            font-size: 16px;
            margin-bottom: 30px;
            opacity: 0.9;
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
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .link {
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            font-size: 12px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📱 Open in Jomi App</h1>
          <p>Scan this page with your mobile device or use the button below to open the article in the Jomi app.</p>
          <a href="jomi://article/${articleId}" class="button">Open in App</a>
          <div class="link">jomi://article/${articleId}</div>
        </div>
      </body>
      </html>
    `);
  }
}

