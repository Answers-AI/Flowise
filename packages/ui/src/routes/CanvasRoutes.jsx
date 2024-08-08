import { lazy } from 'react'

// project imports
import Loadable from '@/ui-component/loading/Loadable'
import MinimalLayout from '@/layout/MinimalLayout'

// canvas routing
const Canvas = Loadable(lazy(() => import('@/views/canvas')))
const MarketplaceCanvas = Loadable(lazy(() => import('@/views/marketplaces/MarketplaceCanvas')))

// ==============================|| CANVAS ROUTING ||============================== //

const CanvasRoutes = {
    path: '/sidekick-studio',
    element: <MinimalLayout />,
    children: [
        {
            path: '/sidekick-studio/canvas',
            element: <Canvas />
        },
        {
            path: '/sidekick-studio/canvas/:id',
            element: <Canvas />
        },
        {
            path: '/sidekick-studio/agentcanvas',
            element: <Canvas />
        },
        {
            path: '/sidekick-studio/agentcanvas/:id',
            element: <Canvas />
        },
        {
            path: '/sidekick-studio/marketplace/:id',
            element: <MarketplaceCanvas />
        }
    ]
}

export default CanvasRoutes
