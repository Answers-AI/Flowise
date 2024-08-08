import { lazy } from 'react'

// project imports
import Loadable from '@/ui-component/loading/Loadable'
import MinimalLayout from '@/layout/MinimalLayout'

// canvas routing
const ChatbotFull = Loadable(lazy(() => import('@/views/chatbot')))

// ==============================|| CANVAS ROUTING ||============================== //

const ChatbotRoutes = {
    path: '/sidekick-studio',
    element: <MinimalLayout />,
    children: [
        {
            path: '/sidekick-studio/chatbot/:id',
            element: <ChatbotFull />
        }
    ]
}

export default ChatbotRoutes
