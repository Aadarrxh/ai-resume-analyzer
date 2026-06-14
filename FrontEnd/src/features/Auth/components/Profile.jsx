import React from 'react'
import './styles/profile.scss'
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { LiaUserGraduateSolid } from "react-icons/lia";
import { MdOutlineTerminal } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import Button from '../../ui/components/buttons/Button';
import { useAuth } from '../hooks/useAuth'

const acems = [
  {
    heading: 'COMPUTER SCIENCE',
    subHeading: 'Galgotias University',
    duration: '2015 - 2019'
  },
  {
    heading: 'INTER',
    subHeading: 'Sf Dav Public School',
    duration: '2014 - 2015'
  }, 
]

const tech = [
  'REACT 18',
  'PYTHON',
  'GO LANG',
  'TAILWIND CSS',
  'NODE JS',
  'MONGO DB',
  'JAVA',
  'JAVA SCRIPT',
]

const Profile = () => {
  //const user = useAuth();

  return (
    <section>
      <div className="grid">
        <div className="top">
            <div className="top-card offset-blue">
              <div className="top-card-left">
                <div className='wrapper-class'>
                  <img src="/img-placeholder-2.jpg" alt="profile-placeholder" />
                </div>
                <div className="info-header">
                  <h1>
                    {'Alex Morgan'}
                  </h1>
                  <h2>
                    Senior Software Developer
                  </h2>
                  <div className="contacts">
                    <div className="flex-info">
                        <CiLocationOn />
                        <p>Galgotias University</p>
                    </div>
                    <div className="flex-info">
                      <MdOutlineEmail />
                      <p>alexstdio564@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="readiness-score offset-black" style={{"--progress":91}}>
                  <h1>
                    91%
                  </h1>
                  <h4>
                    READINESS SCORE
                  </h4>
              </div>
            </div>
        </div>
        <div className="bottom">
             <div className="bio offset-black">
                <div className="bio-top">
                  <h1>EXECUTIVE BIO</h1>
                  <CgNotes color={`var(--blue)`} cursor={'pointer'}/>
                </div>
                <hr />
                <div className="description">
                  <p>
                    Senior Software Developer with 8+ years of experience building scalable web applications and cloud-native solutions. 
                    Skilled in React, Node.js, Java, and modern cloud platforms. Proven track record of delivering high-performance software, 
                    leading development teams, and optimizing system architecture. Passionate about clean code, performance, and mentoring engineers to build reliable, 
                    impactful products.
                  </p>
                </div>
             </div>
             <div className="acadmics offset-black">
                <div className="acm-top">
                  <h1>ACADMICS</h1>
                  <LiaUserGraduateSolid color={`var(--blue)`} size={22} cursor={'pointer'}/>
                </div>
                <hr />
                <div className="acms">
                  {
                    acems.map((acm,i)=>(
                      <div key={i} className='acm'>
                        <h3>{acm.heading}</h3>
                        <h4>{acm.subHeading}</h4>
                        <p>{acm.duration}</p>
                      </div>
                    ))
                  }
                </div>
                
             </div>
             <div className="stack offset-black">
                <div className="stack-top">
                  <h1>TECHNICAL KNOWLEDGE</h1>
                  <MdOutlineTerminal color={`var(--blue)`} size={22} cursor={'pointer'}/>
                </div>
                <hr />
                <div className="stacks">
                  {
                    tech.map((tg, t)=>(
                      <p key={t} style={{padding:".4em", display:"inline-block"}}>
                        <Button text={tg} color={'#fff'} isBorder={true} borderValue={2}/>
                      </p>
                    ))
                  }
                </div>
             </div>
             <div className="audit offset-black">
                <div className="audit-top">
                  <h1>PROTOCAL AUDIT</h1>
                  <HiDocumentReport color={`var(--blue)`} size={22} cursor={'pointer'}/>
                </div>
                <hr />
                <div className="audit-result">
                  <p>Ats compatibility</p>
                  <p>High</p>
                </div>
                <div style={{width:`${91}%`, height:"10px", backgroundColor:"var(--blue)", borderRadius:"6px"}}></div>
                <div className='result-btn' style={{width:"100%"}}>
                  <button style={{width:"100%", border:"0", outline:"none",
                    padding:"1em 2em", backgroundColor:"#000", color:"#fff",
                    cursor:"pointer", fontWeight:"600", textTransform:"uppercase"
                  }}>Generate Report</button>
                </div>
             </div>
        </div>
      </div>
    </section>
  )
}

export default Profile;