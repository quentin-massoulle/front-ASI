import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "@/App";
import { HomePage } from "@/features/home/HomePage";
import { ParcoursPage } from "@/features/parcours/ParcoursPage";
import { UePage } from "@/features/ue/UePage";
import { EtudiantPage } from "@/features/etudiant/EtudiantPage";

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
      {
        path: "Etudiant",
        element: <EtudiantPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
