import DashboardLayout from "./layout/dasboard-layout";
import Dashboard from "./pages/dashboard";
import Candidates from "./pages/candidates";
import Kanban from "./pages/Kanban";
import Error from "./pages/error";
import { withCondition } from "./routes/protectedRoute";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import CandidatesApplicationForm from "./pages/candidatesApplicationForm";
import Topics from "./pages/topics";
import Projects from "./pages/projects";
import ProjectsCreate from "./pages/projectsCreate.tsx";
import Interns from "./pages/interns";
import Staff from "./pages/staff";
import TopicCreate from "./pages/topicCreate";
import ProjectDetail from "./pages/ProjectDetail";
import Settings from "./pages/settings.tsx"
import Portfolio from "./pages/portfolio.tsx";
import Products from "./pages/products.tsx";
import Programs from "./pages/programs.tsx";
import ProductCreate from "./pages/ProductCreate.tsx";
import ProgramCreate from "./pages/programCreate.tsx";
import ProgramDetail from "./pages/programDetail.tsx";
import ProductDetail from "./pages/productDetail.tsx";
import TopicsDetail from "./pages/topicsDetail.tsx";
import InternDetail from "./pages/internDetail.tsx";

function App() {
    const ErrorRoute = withCondition(Error, true, "/error");

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
        },
        {
            path: "/error",
            element: <ErrorRoute />,
        },
        {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
                {
                    index: true,
                    element: <Dashboard />,
                },
                {
                    path: "staff",
                    element: <Staff />,
                },
                {
                    path: "interns",
                    element: <Interns />,
                },
                {
                    path: "interns/:id",
                    element: <InternDetail />,
                },
                {
                    path: "projects",
                    element: <Projects />,
                },
                {
                    path: "projects/create",
                    element: <ProjectsCreate />,
                },
                {
                    path: "projects/detail/:id",
                    element: <ProjectDetail />,
                },
                {
                    path: "topics",
                    element: <Topics />,
                },
                {
                    path: "candidates",
                    element: <Candidates />,
                },
                {
                    path: "candidates/:id",
                    element: <CandidatesApplicationForm />,
                },
                {
                    path: "topics/create",
                    element: <TopicCreate />,
                },
                {
                    path: "topics/detail/:id",
                    element: <TopicsDetail />,
                },
                {
                    path: "chat",
                    element: <div></div>,
                },
                {
                    path: "kanban",
                    element: <Kanban />,
                },
                {
                    path: "Settings",
                    element: <Settings/>,
                },
                {
                    path: "portfolio",
                    element: <Portfolio/>,
                },
                {
                    path: "products",
                    element: <Products/>,
                },
                {
                    path: "products/create",
                    element: <ProductCreate/>,
                },
                {
                    path: "products/detail/:id",
                    element: <ProductDetail/>,
                },
                {
                    path: "programs",
                    element: <Programs/>,
                },
                {
                    path: "programs/create",
                    element: <ProgramCreate/>,
                },
                {
                    path: "programs/detail/:id",
                    element: <ProgramDetail/>,
                },
                
            ],
        }, 
    ]);
    return (
        <RouterProvider router={router} />
        // /* Method: Using a higher-order component */
        // <Router>
        //   <Routes>
        //     <Route path="/" element={<JobApplicationRoute />} />
        //   </Routes>
        //   <Routes>
        //     <Route path="/values" element={<ValuesRoute />} />
        //   </Routes>
        //   <Routes>
        //     <Route path="/error" element={<ErrorRoute />} />
        //   </Routes>
        //   <Routes>
        //     <Route path="/dashboard" element={<DashboardRoute />} />
        //   </Routes>
        // </Router>
    );
}

export default App;
