import metascraper from 'metascraper'
import metascraperTitle from 'metascraper-title'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperUrl from 'metascraper-url'
import metascraperAuthor from 'metascraper-author'
import metascraperDate from 'metascraper-date'
import metascraperPublisher from 'metascraper-publisher'
import metascraperLogo from 'metascraper-logo'
import metascraperYoutube from 'metascraper-youtube'
import metascraperTwitter from 'metascraper-twitter'
import metascraperSpotify from 'metascraper-spotify'
import htmlGet from 'html-get'

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
  metascraperUrl(),
  metascraperAuthor(),
  metascraperDate(),
  metascraperPublisher(),
  metascraperLogo(),
  metascraperYoutube(),
  metascraperTwitter(),
  metascraperSpotify()
])

export async function scrape(link, getBrowserless){
  try {
    const { html, url } = await htmlGet(link, { getBrowserless, headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    } })
    const metadata = await scraper({ html, url })

    if(!metadata.logo){
      const domain = new URL(url).hostname
      metadata.logo = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    }
    return { success: true, metadata }
  } catch (error) {
    console.log(error)
    return { success: false, error: error.message, url: link }
  }
}