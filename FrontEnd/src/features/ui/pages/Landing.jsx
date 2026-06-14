import React from 'react'
import { useTextReveal } from '../hooks/useTextReveal'
import './styles/landing.scss';
import { useLenis } from '../hooks/useLenis';
import Nav from '../components/nav/Nav';
import HeroSection from '../components/sections/HeroSection';

const Landing = () => {
  return (
    <>
      <main>
         <Nav />
         <HeroSection />
      </main>
    </>
  )
}

export default Landing