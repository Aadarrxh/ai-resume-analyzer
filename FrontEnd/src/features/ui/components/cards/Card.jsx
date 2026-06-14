import React from 'react'
import './styles/heroCard.scss'
import { useOpacityReveal } from '../../hooks/useOpacityReveal'

const Card = () => {
  return (
    <div  className='card offset-black'>
        <div className="card-header">
            <p>AI_INTELLIGENCE_WIDGET</p>
            <p> <span>.</span> Processing</p>
        </div>
        <hr />
        <div className="card-content">
            <div className="card-content-left">
                <p>MATCH SCORE</p>
                <h2>
                    82%
                </h2>
            </div>
            <div className="card-content-right">
                <p>READINESS</p>
                <h4>MEDIUM</h4>
            </div>
        </div>
        <div className="card-footer">
            <div className="upper">
                <h4>MISSING SKILLS</h4>
                <div className="missing-skills">
                    <p>DOCKER</p>
                    <p>SYSTEM DESIGN</p>
                </div>
            </div>
            <div className="lower">
                <h4>SUGGESTED FOCUS</h4>
                <p>BACKEND ARCHITECHTURE</p>
            </div>
        </div>
    </div>
  )
}

export default Card