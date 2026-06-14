import React, { useRef } from 'react'
import './styles/hero.scss'
import Button from '../buttons/Button'
import { useTextReveal } from '../../hooks/useTextReveal'
import Card from '../cards/Card'
import useAppNavigate from '../../hooks/navigator'
import { useOpacityReveal } from '../../hooks/useOpacityReveal'

const HeroSection = () => {
  const goTo = useAppNavigate();

  const headerRef = useTextReveal({trigger:"load", type:"chars", y:200, stagger:0.05});
  const headerRef2 = useTextReveal({trigger:"load", type:"chars", y:200, stagger:0.05});

  const secHeaderRef = useTextReveal({trigger:"load", type:"chars", y:200, stagger:0.05});
  const secHeaderRef2 = useTextReveal({trigger:"load", type:"chars", y:200, stagger:0.05});
  const secHeaderRef3 = useTextReveal({trigger:"load", type:"chars", y:200,  stagger:0.05});

  const trigger = window.innerWidth <= 1000 ? "load":"scroll";

  const paraRef = useTextReveal({trigger:trigger, type:"lines", stagger:0.08});

  const presets1 = {
    isBorder: window.innerWidth <= 1000 ? false : true,
    borderValue: window.innerWidth <= 1000 ? 1 : 2,
    fontSize: window.innerWidth <= 1000 ? "14px": "1rem",
  }

  const presets2 = {
    isBorder: true,
    borderValue: window.innerWidth <= 1000 ? 0 : 2,
    fontSize: window.innerWidth <= 1000 ? "14px": "1rem",
  }

  return (
    <div className='hero-section'>
        <div className="protocal-container">
            <Button text='The Protocal'
             color='#000' 
             bg="#fff" 
             isBorder={true} 
             borderValue = {0}
             />
        </div>
        <div className="hero-header">
                <h1 className='flex-col'>
                   <span className='char' ref={headerRef}>Stop Ghosting</span>
                   <span className='char' ref={headerRef2}> yourSelf.</span>
                </h1>

                <h1 className='flex-col'>
                   <span ref={secHeaderRef} className='char' >Match.</span>
                   <span ref={secHeaderRef2} className='char' >Update.</span> 
                   <span ref={secHeaderRef3} className='char' >Win.</span>
                </h1>
        </div>
        <div className='hero-content'>
            <p ref={paraRef}>
              our Ai dissects job descriptions so you don't have to guess
              why you ar't getting called back. Fixed Roadmaps, real questions, 
              zero fluff.
            </p>
        </div>
        <div  className="btn-container">

          <Button text='Analyze Resume' color='#fff' 
          fontSize={presets1.fontSize} isBorder={presets1.isBorder} 
          borderValue={presets1.borderValue} clickHandler={()=>goTo("/app")}/>

          <Button text='View Demo' bg='#fff' color='#000' 
          fontSize={presets2.fontSize} specialClass='black-border' 
          isBorder={presets2.fontSize} 
          borderValue={presets2.borderValue}
          />

        </div>
        <div  className="card-container">
          <Card />
        </div>
    </div>
  )
}

export default HeroSection