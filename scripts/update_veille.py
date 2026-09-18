"""Fetch curated public RSS feeds into a safe, static, attributed news index."""
import concurrent.futures
import datetime as dt
import email.utils
import json
import pathlib
import re
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
DESTINATION = ROOT / 'src/data/veille.json'
SOURCES = [
    {'id': 'mdn', 'name': 'MDN Web Docs', 'category': 'Développement web', 'url': 'https://developer.mozilla.org/en-US/blog/rss.xml', 'host': 'developer.mozilla.org', 'context': 'Standards du Web, CSS, JavaScript et pratiques de développement.'},
    {'id': 'github', 'name': 'GitHub Blog', 'category': 'Outils & IA', 'url': 'https://github.blog/feed/', 'host': 'github.blog', 'context': 'Outils de développement, collaboration et intelligence artificielle.'},
    {'id': 'cloudflare', 'name': 'Cloudflare Blog', 'category': 'Cloud & sécurité', 'url': 'https://blog.cloudflare.com/rss/', 'host': 'blog.cloudflare.com', 'context': 'Infrastructure, performance du Web et sécurité des applications.'},
]

def parse_feed(xml, source):
    root = ET.fromstring(xml)
    articles = []
    for entry in root.findall('.//item') + root.findall('.//{http://www.w3.org/2005/Atom}entry'):
        def text(name):
            element = entry.find(name)
            if element is None:
                element = entry.find('{http://www.w3.org/2005/Atom}' + name)
            return ''.join(element.itertext()).strip() if element is not None else ''
        title = re.sub(r'\s+', ' ', text('title')).strip()[:220]
        link = text('link')
        if not link:
            for element in entry.findall('{http://www.w3.org/2005/Atom}link'):
                if element.attrib.get('rel', 'alternate') == 'alternate':
                    link = element.attrib.get('href', '')
                    break
        parsed = urllib.parse.urlparse(link)
        if not title or parsed.scheme != 'https' or parsed.hostname != source['host'] or parsed.username:
            continue
        date = text('pubDate') or text('published') or text('updated')
        try:
            try:
                published = email.utils.parsedate_to_datetime(date)
            except (ValueError, TypeError):
                published = dt.datetime.fromisoformat(date.replace('Z', '+00:00'))
            if published.tzinfo is None:
                published = published.replace(tzinfo=dt.timezone.utc)
            published = published.astimezone(dt.timezone.utc)
        except (ValueError, TypeError):
            continue
        if published > dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=24):
            continue
        articles.append({'title': title, 'url': link, 'publishedAt': published.isoformat(), 'source': source['name'], 'sourceId': source['id'], 'category': source['category'], 'context': source['context']})
    return sorted(articles, key=lambda item: item['publishedAt'], reverse=True)[:8]

def fetch_source(source):
    request = urllib.request.Request(source['url'], headers={'User-Agent': 'LucasAvelinePortfolio/2026 RSS reader', 'Accept': 'application/rss+xml, application/xml, text/xml'})
    with urllib.request.urlopen(request, timeout=25) as response:
        content = response.read(4_000_001)
    if len(content) > 4_000_000:
        raise ValueError('Flux trop volumineux')
    articles = parse_feed(content, source)
    if not articles:
        raise ValueError('Aucun article valide')
    return articles

def update():
    try:
        previous = json.loads(DESTINATION.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        previous = {'articles': [], 'sources': []}
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    articles, statuses = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        jobs = {executor.submit(fetch_source, source): source for source in SOURCES}
        for job in concurrent.futures.as_completed(jobs):
            source = jobs[job]
            old = next((item for item in previous['sources'] if item['id'] == source['id']), {})
            try:
                entries = job.result()
                status = 'ok'
                fetched = now
            except Exception as error:
                entries = [item for item in previous['articles'] if item['sourceId'] == source['id']]
                status = 'cached' if entries else 'unavailable'
                fetched = old.get('lastSuccessAt')
                print(f"{source['name']}: {status} ({type(error).__name__})")
            articles.extend(entries)
            statuses.append({'id': source['id'], 'name': source['name'], 'url': source['url'], 'status': status, 'lastSuccessAt': fetched})
    unique = {item['url']: item for item in articles}
    result = {'checkedAt': now, 'sources': sorted(statuses, key=lambda item: item['id']), 'articles': sorted(unique.values(), key=lambda item: item['publishedAt'], reverse=True)}
    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    temporary = DESTINATION.with_suffix('.tmp')
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(DESTINATION)
    print(f"Veille : {len(result['articles'])} articles, {sum(item['status']=='ok' for item in statuses)}/3 sources actualisées.")
    if not result['articles']:
        raise SystemExit(1)

if __name__ == '__main__':
    update()
