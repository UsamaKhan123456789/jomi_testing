// Vercel Serverless Function for Deep Link Redirect
// This file should be at: /api/article/[articleId].js

export default function handler(req, res) {
  const { articleId } = req.query;
  
  // Get user agent to detect mobile devices
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Validate articleId
  if (!articleId || articleId.trim() === '') {
    return res.status(400).json({ error: 'Article ID is required' });
  }
  
  if (isMobile) {
    // Mobile device: Redirect to custom scheme to open app
    const customSchemeUrl = `jomi://article/${articleId}`;
    
    // Return HTML with meta refresh and JavaScript fallback
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Opening Article in Jomi App...</title>
        <meta http-equiv="refresh" content="0;url=${customSchemeUrl}">
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
          .button:active {
            transform: scale(0.95);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>Opening in Jomi App...</h1>
          <p>If the app doesn't open automatically, tap the button below:</p>
          <a href="${customSchemeUrl}" class="button">Open in App</a>
        </div>
        <script>
          // Try to open the app immediately
          window.location.href = "${customSchemeUrl}";
          
          // Fallback: If app doesn't open after 2 seconds, show button
          setTimeout(function() {
            document.querySelector('.button').style.display = 'inline-block';
          }, 2000);
        </script>
      </body>
      </html>
    `);
  } else {
    // Desktop: Show web page with "Open in App" button and QR code option
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
          .qr-section {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
          }
          .qr-text {
            font-size: 14px;
            margin-bottom: 15px;
            opacity: 0.8;
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
          <div class="qr-section">
            <p class="qr-text">Or scan this QR code with your phone:</p>
            <div id="qrcode"></div>
            <div class="link">jomi://article/${articleId}</div>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
        <script>
          // Generate QR code
          new QRCode(document.getElementById("qrcode"), {
            text: "jomi://article/${articleId}",
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        </script>
      </body>
      </html>
    `);
  }
}

