import { auth } from '../auth'
import { User } from '../types/user'
import { create } from 'zustand'


interface UserState {
  user: User|null
//   increase: (by: number) => void
}
const session = await auth()
 


const useUserStore = create<UserState>()((set) => ({
    // Check if user is logged in using auth.js: getCurrentUser() returns a User or null.
    user: !session?.user ? null : session.user as User,
    // increase: (by: number) =>
    //     set((state) => ({
    //         // Placeholder: update as needed; currently the user state isn't numeric.
    //         user: state.user,
    //     })),
}))

export default useUserStore;