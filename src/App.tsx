import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import router from "./routes"
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="shopverse-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
