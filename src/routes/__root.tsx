import { HeadContent, Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient } from '@tanstack/react-query'
import Header from '../components/Header'
import { useHeaderHeight } from '@/hooks/header/useHeaderHeight'

type RouterContext = {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    title: 'CareerCare AI — Resume Analyzer & AI Interview',
    meta: [
      // Main SEO
      { name: 'description', content: 'Analyze resumes, generate cover letters, and practice AI interviews with CareerCare AI.' },
      { name: 'keywords', content: 'AI resume analyzer, cover letter generator, job application tracker, AI interview practice, CareerCare AI' },

      // Open Graph (Facebook, LinkedIn, Messenger)
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'CareerCare AI — Resume Analyzer & AI Interview' },
      { property: 'og:description', content: 'AI-powered platform for resumes, cover letters, and interviews.' },
      { property: 'og:image', content: 'https://career-care-ai.vercel.app/og-image.png' },
      { property: 'og:url', content: 'https://career-care-ai.vercel.app/' },

      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'CareerCare AI — Resume Analyzer & AI Interview' },
      { name: 'twitter:description', content: 'AI-powered platform for resumes, cover letters, and interviews.' },
      { name: 'twitter:image', content: 'https://career-care-ai.vercel.app/og-image.png' },

      // PWA / mobile hints
      { name: 'theme-color', content: '#4f46e5' },
    ],
    //  structured data
    scripts: [
      {
        tagName: 'script',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "CareerCare AI",
          "url": "https://career-care-ai.vercel.app/",
          "description": "Analyze resumes, generate cover letters, track job applications, and practice AI interviews via text or voice."
        })
      }
    ]
  }),

  component: RootLayout,
  notFoundComponent: NotFound, //notFoundComponent: NotFound, for not found page
})

function RootLayout () {
  useHeaderHeight();
  return (
    <div className='flex flex-col'>
      <HeadContent/>
      <Header/>
      <main className="flex justify-center ">
        <div className="w-full max-w-full rounded-2xl">
          <Outlet />
        </div>
      </main>

      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  )
}

function NotFound() { //for not found page
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800">
        404
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Ooops! The page you are looking for does not exist
      </p>
      <div className='mb-6'>
        <img     
        src="/tent.svg" 
        alt="Tent illustration" 
        className="max-w-xs md:max-w-sm lg:max-w-md mx-auto"/>
      </div>


      <Link to='/' className='px-6 py-2 bg-blue-600 text-white rounded-md 
        hover:bg-blue-700 transition'>
        Go Back Home
        </Link>
    </div>
  )
}
