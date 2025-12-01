import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "@/App";
import { HomePage } from "@/features/home/HomePage";
import { ParcoursPage } from "@/features/parcours/ParcoursPage";
import { UePage } from "@/features/ue/UePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "parcours",
        element: <ParcoursPage />,
      },
      {
        path: "UE",
        element: <UePage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
