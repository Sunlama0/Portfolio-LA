import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import update_veille as feed

class FeedTests(unittest.TestCase):
    def test_only_official_https_links_are_kept(self):
        xml=b'<rss><channel><item><title>Valid</title><link>https://github.blog/test</link><pubDate>Tue, 01 Sep 2026 10:00:00 GMT</pubDate></item><item><title>Unsafe</title><link>javascript:alert(1)</link><pubDate>Tue, 01 Sep 2026 10:00:00 GMT</pubDate></item><item><title>Other domain</title><link>https://example.com/test</link><pubDate>Tue, 01 Sep 2026 10:00:00 GMT</pubDate></item></channel></rss>'
        articles=feed.parse_feed(xml,feed.SOURCES[1])
        self.assertEqual([a['title'] for a in articles],['Valid'])
    def test_atom_is_supported(self):
        xml=b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Atom</title><link href="https://github.blog/atom"/><updated>2026-09-01T10:00:00Z</updated></entry></feed>'
        self.assertEqual(feed.parse_feed(xml,feed.SOURCES[1])[0]['title'],'Atom')
    def test_outage_preserves_cached_articles(self):
        import json
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'veille.json'
            target.write_text(json.dumps({'articles':[{'title':'Cached','url':'https://github.blog/cache','sourceId':'github','publishedAt':'2026-09-01T10:00:00Z'}],'sources':[{'id':'github','lastSuccessAt':'2026-09-01T10:00:00Z'}]}))
            with patch.object(feed,'DESTINATION',target),patch.object(feed,'fetch_source',side_effect=OSError('offline')):
                feed.update()
            result=json.loads(target.read_text())
            self.assertEqual(result['articles'][0]['title'],'Cached')
            self.assertEqual(next(s for s in result['sources'] if s['id']=='github')['status'],'cached')

if __name__=='__main__':unittest.main()
