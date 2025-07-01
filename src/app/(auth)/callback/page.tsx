import { onAuthenticateUser } from '@/actions/User'
import { redirect } from 'next/navigation'

async function page() {
    const auth = await onAuthenticateUser()
    if(auth?.status=== 200 || auth?.status === 201) {
        redirect('/dashboard')
    } else if (auth?.status === 403 || auth?.status === 400 || auth?.status === 500) {
        redirect('/sign-in')
    }
}

export default page
