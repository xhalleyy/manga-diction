import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import PostsComponent from '../components/PostsComponent'
import CardComponent from '../components/CardComponent'

const page = () => {
  return (
    <div>

        <NavbarComponent/>

        <PostsComponent/>

        <CardComponent/>
      
    </div>
  )
}

export default page
