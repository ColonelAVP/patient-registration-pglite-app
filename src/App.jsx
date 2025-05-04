import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/index.css';
import RegisterPatientForm from "./components/RegisterPatientForm";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="text-2xl text-blue-600 font-bold">
        <RegisterPatientForm />
      </div>
    </>
  )
}

export default App
