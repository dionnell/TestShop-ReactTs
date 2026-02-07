import { RouterProvider } from "react-router"
import { appRouter } from "./app.router"


export const TestShopApp = () => {
  return (
    <RouterProvider router={appRouter} />
  )
}
