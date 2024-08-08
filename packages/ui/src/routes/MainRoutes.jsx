import { lazy } from 'react'

// project imports
import MainLayout from '@/layout/MainLayout'
import Loadable from '@/ui-component/loading/Loadable'

// chatflows routing
const Chatflows = Loadable(lazy(() => import('@/views/chatflows')))

// agents routing
const Agentflows = Loadable(lazy(() => import('@/views/agentflows')))

// marketplaces routing
const Marketplaces = Loadable(lazy(() => import('@/views/marketplaces')))

// apikey routing
const APIKey = Loadable(lazy(() => import('@/views/apikey')))

// tools routing
const Tools = Loadable(lazy(() => import('@/views/tools')))

// assistants routing
const Assistants = Loadable(lazy(() => import('@/views/assistants')))

// credentials routing
const Credentials = Loadable(lazy(() => import('@/views/credentials')))

// variables routing
const Variables = Loadable(lazy(() => import('@/views/variables')))

// documents routing
const Documents = Loadable(lazy(() => import('@/views/docstore')))
const DocumentStoreDetail = Loadable(lazy(() => import('@/views/docstore/DocumentStoreDetail')))
const ShowStoredChunks = Loadable(lazy(() => import('@/views/docstore/ShowStoredChunks')))
const LoaderConfigPreviewChunks = Loadable(lazy(() => import('@/views/docstore/LoaderConfigPreviewChunks')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/sidekick-studio',
    element: <MainLayout />,
    children: [
        {
            path: '/sidekick-studio',
            element: <Chatflows />
        },
        {
            path: '/sidekick-studio/chatflows',
            element: <Chatflows />
        },
        {
            path: '/sidekick-studio/agentflows',
            element: <Agentflows />
        },
        {
            path: '/sidekick-studio/marketplaces',
            element: <Marketplaces />
        },
        {
            path: '/sidekick-studio/apikey',
            element: <APIKey />
        },
        {
            path: '/sidekick-studio/tools',
            element: <Tools />
        },
        {
            path: '/sidekick-studio/assistants',
            element: <Assistants />
        },
        {
            path: '/sidekick-studio/credentials',
            element: <Credentials />
        },
        {
            path: '/sidekick-studio/variables',
            element: <Variables />
        },
        {
            path: '/sidekick-studio/document-stores',
            element: <Documents />
        },
        {
            path: '/sidekick-studio/document-stores/:id',
            element: <DocumentStoreDetail />
        },
        {
            path: '/sidekick-studio/document-stores/chunks/:id/:id',
            element: <ShowStoredChunks />
        },
        {
            path: '/sidekick-studio/document-stores/:id/:name',
            element: <LoaderConfigPreviewChunks />
        }
    ]
}

export default MainRoutes
