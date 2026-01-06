export default function handler(req, res) {
  const { articleId, pubId, publd, slug } = req.query;
  const publicationId = pubId || publd;
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  if (!articleId || articleId.trim() === '') {
    return res.status(400).json({ error: 'Article ID is required' });
  }
  
  const webUrl = (publicationId && slug) ? `https://jomi.com/article/${publicationId}/${slug}` : null;
  const appDeepLink = `jomi://article/${articleId}`;
  
  if (isMobile) {
    return res.status(200).send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Opening Article...</title>${webUrl ? `<meta http-equiv="refresh" content="2;url=${webUrl}">` : ''}<style>body{font-family:system-ui;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;padding:20px}.container{max-width:400px}.spinner{border:4px solid rgba(255,255,255,0.3);border-top:4px solid white;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite;margin:0 auto 20px}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.button{display:inline-block;margin-top:20px;padding:15px 30px;background:white;color:#667eea;text-decoration:none;border-radius:8px;font-weight:600}</style></head><body><div class="container"><div class="spinner"></div><h1>Opening in Jomi App...</h1><p>${webUrl ? 'If the app doesn\'t open, you\'ll be redirected...' : 'Opening the app...'}</p>${webUrl ? `<a href="${webUrl}" class="button">Continue to Website</a>` : `<a href="${appDeepLink}" class="button">Open in App</a>`}</div><script>(function(){let appOpened=false;const appLink="${appDeepLink}";${webUrl ? `const webUrl="${webUrl}";` : ''}const iframe=document.createElement('iframe');iframe.style.display='none';iframe.src=appLink;document.body.appendChild(iframe);setTimeout(()=>{if(!appOpened)window.location.href=appLink},100);document.addEventListener('visibilitychange',()=>{if(document.hidden)appOpened=true});window.addEventListener('blur',()=>{appOpened=true});window.addEventListener('pagehide',()=>{appOpened=true});${webUrl ? `setTimeout(()=>{if(!appOpened)window.location.replace(webUrl)},1500);` : ''}${webUrl ? `setTimeout(()=>{if(document.visibilityState==='visible')window.location.replace(webUrl)},3000);` : ''}})();</script></body></html>`);
  } else {
    if (webUrl) {
      res.writeHead(302, { 'Location': webUrl });
      return res.end();
    }
    return res.status(200).send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Open in App</title><style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center}.button{padding:15px 40px;background:white;color:#667eea;text-decoration:none;border-radius:10px;font-weight:600}</style></head><body><div><h1>📱 Open in Jomi App</h1><p>Scan with your mobile device</p><a href="${appDeepLink}" class="button">Open in App</a></div></body></html>`);
  }
}
