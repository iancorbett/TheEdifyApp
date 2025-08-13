import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { About } from './components/About'
import { SignUp } from './pages/SignUp'
import { LogIn } from './pages/LogIn'
import { AddStudentPage } from './pages/AddStudentPage'
import { WelcomePage } from './pages/WelcomePage'
import { Students } from './pages/Students'
import { FormPage } from './pages/FormPage'
import { ContactForm } from './components/ContactForm'
import { StudentDashboard } from './pages/StudentDashboard'
import { ObservationsPage } from './pages/ObservationsPage'
import { ObservationData } from './pages/ObservationData'

function App() {

  return (
    
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/formpage" element={<FormPage />}/> 
        <Route path="/about" element={<About />}/>
        <Route path="/signup" element={<SignUp />}/> 
        <Route path="/login" element={<LogIn />}/>
        <Route path="/addstudent" element={<AddStudentPage />}/> 
        <Route path="/welcome" element={<WelcomePage />}/>
        <Route path="/students" element={<Students />}/>  
        <Route path="/contact" element={<ContactForm />}/>
        <Route path="/students/:id" element={<StudentDashboard />} />
        <Route path="/observations/:studentId" element={<ObservationsPage />} />  
        <Route path="/observation-data/:studentId" element={<ObservationData />} />
      </Routes>
    
  )
  
}

export default App