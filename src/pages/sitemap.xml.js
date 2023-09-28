import { repository as repo } from 'server/diContainer'

const URL = 'https://deagwon.com'

function generateSiteMap(postTitleList) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <!--We manually set the two URLs we know already-->
    <url>
      <loc>${URL}</loc>
    </url>
    <url>
      <loc>${URL}/main</loc>
    </url>
    ${postTitleList
      .map((title) => {
        const url = `${URL}/post/${title}`
          .replace('&', '&amp;')
          .replace('?', '?amp;')
        return `
          <url>
              <loc>${url}</loc>
          </url>
        `
      })
      .join('')}
  </urlset>
`
}

export const getServerSideProps = async (context) => {
  const postTitleList = await repo.postRepo.getPostTitleList()

  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap(postTitleList)

  context.res.setHeader('Content-Type', 'text/xml')
  // Send the XML to the browser
  context.res.write(sitemap)
  context.res.end()

  return {
    props: {}
  }
}

export default function SiteMap() {}
