import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard.jsx';
import Login from './components/ui/login.jsx';
import Portfolio from './pages/Portfolio.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './routes/PrivateRoutes.jsx';
import Profile from './pages/admin/profilie/Profile.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageSkills from './pages/admin/skills/ManageSkills.jsx';
import Layout from './layouts/Layout.jsx';
import Projects from './pages/admin/projects/Projects.jsx';
import ContactPage from './pages/admin/contact/ContactPage.jsx';
import ProfifleProvider from './context/ProfileContext.jsx';
import AllProjects from './components/ui/projects/AllProjects.jsx';
import ProjectDetails from './components/ui/projects/ProjectDetails.jsx';
import VerifyEmail from './components/ui/VerifyEmail.jsx';

const App = () => {
  return (
    <div className='min-h-screen bg-[#121212] '>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <ProfifleProvider>
                <Layout>
                  <Portfolio />
                </Layout>
              </ProfifleProvider>
            } />

            {/* Admin only */}
            <Route path='/prashant/login' element={<Login />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <ProfifleProvider>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProfifleProvider>
              </PrivateRoute>
             } />

             <Route path='/admin/profile' element={
              <PrivateRoute>
                <ProfifleProvider>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProfifleProvider>
              </PrivateRoute>
             } />

             <Route path='/admin/skills' element={
              <PrivateRoute>
                <ProfifleProvider>
                  <Layout>
                   <ManageSkills />
                  </Layout>
                </ProfifleProvider>
              </PrivateRoute>
             } />

            <Route path='/admin/projects' element={
              <PrivateRoute>
                <ProfifleProvider>
                  <Layout>
                   <Projects />
                  </Layout>
                </ProfifleProvider>
              </PrivateRoute>
             } />

             <Route path='/admin/contact' element={
              <PrivateRoute>
                <ProfifleProvider>
                  <Layout>
                   <ContactPage />
                  </Layout>
                </ProfifleProvider>
              </PrivateRoute>
             } />

             {/* Public Users */}
             <Route path="/projects" element={
              <ProfifleProvider>
                <Layout>
                  <AllProjects />
                </Layout>
              </ProfifleProvider>
             } />

             <Route path='/project/:id' element={
              <ProfifleProvider>
                <Layout>
                  <ProjectDetails />
                </Layout>
              </ProfifleProvider>
             } />

             <Route path="/verify-email" element={
              <ProfifleProvider>
                <Layout>
                  <VerifyEmail />
                </Layout>
              </ProfifleProvider>
             } />

          </Routes>
        </BrowserRouter>
        
        {/* Toast Container */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </div>
  );
}

export default App;
