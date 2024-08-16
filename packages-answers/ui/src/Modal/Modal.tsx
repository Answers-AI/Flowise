'use client'
import ShareModal from '../ShareModal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const Modal = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const modal = searchParams?.get('modal')
    const handleClose = () => {
        if (pathname) router.push(pathname)
    }

    if (modal === 'share') {
        return <ShareModal onClose={handleClose} />
    }

    return null
}
export default Modal