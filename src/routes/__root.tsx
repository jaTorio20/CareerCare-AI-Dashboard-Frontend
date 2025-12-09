import { HeadContent, Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient } from '@tanstack/react-query'
import Header from '../components/Header'

type RouterContext = {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
    {
      name: 'description',
      content: 'AI-powered automation for resumes, cover letters, and job application tracking in one dashboard.'
    },
    {
      title: 'CareerCare AI Dashboard'
    }
  ]
  }),

  component: RootLayout,
  notFoundComponent: NotFound, //notFoundComponent: NotFound, for not found page
})

function RootLayout () {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <HeadContent/>
      <Header/>
      <main className="flex justify-center p-1 md:p-6">
        <div className="w-full max-w-7xl rounded-2xl p-2 md:p-8">
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
