// src/composables/useGoogleAuth.js
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "@/firebase"
import { useUserStore } from "@/stores/user"

export function useGoogleAuth() {
  const userStore = useUserStore()
  const router = useRouter()
  const firebaseUser = ref(null)

  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Utilisateur connecté → on met à jour Pinia
        const profile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: user.providerData[0]?.providerId || "google"
        }
        userStore.setProfile(profile)
        firebaseUser.value = user
      } else {
        // Utilisateur déconnecté → on clear Pinia
        userStore.clearProfile()
        firebaseUser.value = null
      }
    })
  })

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider)
      // Le onAuthStateChanged() fera le reste
    } catch (err) {
      console.error("Erreur lors de signInWithGoogle :", err)
      throw err
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      // Le onAuthStateChanged() détecte user===null et fait clearProfile()
      router.push({ name: "Home" })
    } catch (err) {
      console.error("Erreur lors du logout :", err)
    }
  }

  return {
    firebaseUser,
    signInWithGoogle,
    logout
  }
}
