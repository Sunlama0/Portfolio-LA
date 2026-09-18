import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
const root=resolve('.');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf'};
let refreshing=false;
function refresh(){if(refreshing)return;refreshing=true;const child=spawn(process.platform==='win32'?'python':'python3',['scripts/update_veille.py'],{stdio:'inherit'});child.on('error',()=>{refreshing=false;});child.on('close',code=>{refreshing=false;if(code!==0)console.log('Veille : utilisation du cache.');});}
createServer(async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}const file=(await stat(path)).isDirectory()?resolve(path,'index.html'):path;res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));}catch{try{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(resolve(root,'404.html')));}catch{res.end('Page introuvable');}}}).listen(4173,'127.0.0.1',()=>{console.log('Portfolio : http://127.0.0.1:4173');refresh();});
setInterval(refresh,6*60*60*1000).unref();
