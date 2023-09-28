import { repository as repo } from 'server/diContainer'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

function generateSiteMap(postTitleList: string[]) {
  const URL = 'https://deagwon.com'
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
       <!-- Add the static URLs manually -->
       <url>
         <loc>${URL}</loc>
       </url>
        <url>
         <loc>${URL}/post</loc>
       </url>
       ${postTitleList
         .map((title) => {
           return `
             <url>
                 <loc>${`${URL}/post/${title}`}</loc>
             </url>
           `
         })
         .join('')}
     </urlset>
   `
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
