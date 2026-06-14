import React from 'react'
import { VscGraph } from "react-icons/vsc";
import { BiSolidReport } from "react-icons/bi";
import './styles/overview.scss';
import { Pointer } from 'lucide-react';
import { MdTipsAndUpdates } from "react-icons/md";
import Button from '../../ui/components/buttons/Button';
import RoadmapCalendar from './Calender';

const Overview = () => {
  const compitancies = [
    {
      tag:"FullStack",
      val:92
    },
    {
      tag:"Gen Ai",
      val:88
    },
    {
      tag:"Data Analyst",
      val:80
    }
  ];

  const reports = [
  {
    id: 1,
    name: "Sarah Koenig",
    fileName: "resume_senior_v4.pdf",
    uploadedAgo: "2m ago",
    matchScore: 94,
    avatar: "/img-placeholder-2.jpg",
  },
  {
    id: 2,
    name: "James Miller",
    fileName: "james_miller_portfolio.pdf",
    uploadedAgo: "15m ago",
    matchScore: 88,
    avatar: "/img-placeholder-2.jpg",
  },
  {
    id: 3,
    name: "Elena Lopez",
    fileName: "Lopez_CV_Final.pdf",
    uploadedAgo: "45m ago",
    matchScore: 91,
    avatar: "/img-placeholder-2.jpg",
  },
  ];

  return (
    <section>
      <div className="insights">
        <div className="insights-top">
          <VscGraph size={26} color='var(--blue)'/>
          <h2>INTELLIGENCE OVERVIEW</h2>
        </div>
        <div className="insights-bottom">
          <div className="card-c offset-black">
            <p>Total Scans</p>
            <h2>1,248 <sub style={{fontSize:"16px", color:"green"}}>+12%</sub></h2>
            <div className="scan-line"></div>
          </div>
          <div className="card-c offset-black">
            <p>Average Score</p>
            <h2>84 <span className='light-text'>/100</span></h2>
            <div className="scan-blocks">
              {Array.from({length:4}).map((_,i)=>(
                <div className="block"></div>
              ))}
            </div>
          </div>
          <div className="card-c offset-black">
            <p>Top Compitancies</p>
            <div className="compitancies">
              {
                compitancies.map((c,i)=>(
                  <div className="compitancy">
                    <p>{c.tag}</p>
                    <p>{c.val} %</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <div className="insights-activity">
        <div className="recent-Activity">
         <div className="recent-activity-header">
          <h2>RECENT ACTIVITY</h2>
          <p>view all</p>
         </div>
         <div className="recent-activity-reports">
          {
            reports.map((r,i)=>(
              <div key={r.id} className="card-f offset-black">
                <div className="file-img-wrapper">
                  <img src={r.avatar} alt="avatar-img" />
                </div>
                <div className="file-info">
                  <h4>{r.name}</h4>
                  <p>{r.fileName+"     "+"."}<span>{r.uploadedAgo}</span></p>
                </div>
                <div className="file-score">
                  <p>{r.matchScore}%</p>
                  <BiSolidReport size={24} cursor="pointer"/>
                </div>
              </div>
            ))
          }
          <RoadmapCalendar />
         </div>
        </div>
        <div className="optimization">
          <h2>OPTIMIZATIONS</h2>
          <div className="card-o offset-blue">
            <p className='red'>Critical</p>
            <h4>Enhance Semantic Keywords</h4>
            <p>
              System has detected a gap in infrastructure-related testimonlogy.
              Bridge this to increase the ATS ranking by 14%.
            </p>
            <Button text='apply Strategy' color='#000' bg='var(--blue)'/>
          </div>
          <div className="card-o card-o-2 offset-black">
            <p><MdTipsAndUpdates /> Analysis tip</p>
            <h4>Bullet Point Impact</h4>
            <p>
              Resume using Action verbs at the start of bullet points shows
              a 22% higher engagement rate with recuiters.
            </p>
            <Button text='Learn More' color='#000' bg='#fff' isBorder={true} borderValue={0}/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Overview;