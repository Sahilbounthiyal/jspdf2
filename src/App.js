import React from 'react'
import Options from './Options'
import {  Route,Routes } from 'react-router-dom'
import Imagetopdf from './Imagetopdf'
import Exceltopdf from './Exceltopdf'
import Wordtopdf from './Wordtopdf'
import Mergepdf from './Mergepdf'
import Addpagenumbers from './Addpagenumbers'
import Logincomponent from './Logincomponent'
import Register from './Registr'
import { getDatabase,ref,set } from 'firebase/database'
import {app} from './Firebase'

const db=getDatabase(app);

export default function App() {
  return (
    <>
        <Routes>
        <Route path='/' element={<Options/>}/>
          <Route path='/Register' element={<Register/>}/>
          <Route path='/Logincomponent' element={<Logincomponent/>} />
          
          <Route path='/Imagetopdf' element={<Imagetopdf/>}/>
          <Route path='/Exceltopdf' element={<Exceltopdf/>}/>
          <Route path='/Wordtopdf'  element={<Wordtopdf/>}/>
          <Route path='/Mergepdf' element={<Mergepdf/>}/>
          <Route path='/Addpagenumbers' element={<Addpagenumbers/>}/>
        </Routes>
    </>
  )
}
  