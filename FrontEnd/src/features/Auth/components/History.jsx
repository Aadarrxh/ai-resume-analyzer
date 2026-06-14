import React from 'react'
import './styles/history.scss'
import Button from '../../ui/components/buttons/Button'
import { GoDownload } from "react-icons/go";
import { IoShareSocialOutline } from "react-icons/io5";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";

const History = () => {
  const strengths = [
    {
      tag:"TECH",
      message:"Distributed Systems & Microservices"
    },
    {
      tag:"LEAD",
      message:"LeaderShip Quotient (9.2/10)"
    },
    {
      tag:"SCALE",
      message:"Multi-region Availability Strategy"
    }
  ];

  const weakness = [
    {
      tag:"RISK",
      message:"Advance Cloud Security Compilance"
    },
    {
      tag:"GAP",
      message:"FinOps / Cost Optimization Strategy"  
    },
    {
      tag:"DOMAIN",
      message:"EdTech Specific Protocals (RTB/DSP)"
    }
  ];

  const reports = [
  {
    id: 1,
    jobTitle: "Principal DevOps Engineer",
    department: "Technical Infrastructure",
    processedDate: "Oct 12, 2023",
    matchScore: 92,
    reportUrl: "/reports/principal-devops-engineer.pdf",
  },
  {
    id: 2,
    jobTitle: "Lead Solutions Architect",
    department: "Enterprise Cloud",
    processedDate: "Sep 28, 2023",
    matchScore: 88,
    reportUrl: "/reports/lead-solutions-architect.pdf",
  },
  {
    id: 3,
    jobTitle: "Infrastructure Lead",
    department: "Distributed Systems",
    processedDate: "Sep 15, 2023",
    matchScore: 95,
    reportUrl: "/reports/infrastructure-lead.pdf",
  },
  {
    id: 4,
    jobTitle: "Senior Staff Engineer",
    department: "Scalability Operations",
    processedDate: "Aug 30, 2023",
    matchScore: 82,
    reportUrl: "/reports/senior-staff-engineer.pdf",
  },
  ];

  return (
    <section>
      <header>
         <div className="left">
           <h5>TECHNICAL ANALYSIS</h5>
           <p>{`REPORT ID ${"#123YET"} // GENERATED_${"2026"}`}</p>
         </div>
         <div className="right">
          <Button icon={GoDownload} flex='flex' text='EXPORT PDF' color='#000' isBorder={true} borderValue={2} bg='#fff'/>
          <Button icon={IoShareSocialOutline} flex='flex' text='SHARE LINK' color='#000' isBorder={true} borderValue={2} bg='#fff' />
         </div>
      </header>
      <br />
      <hr />
      <div className="history-grid">
        <div className="analysis-grid">
          <div className="left">
            <div className="score">
                <p>CANDIDATE SUMMARY</p>
                <div className="readiness-score offset-black" style={{"--progress":91}}>
                  <h1>
                    91%
                  </h1>
                  <h4>
                    MATCHED SCORE
                  </h4>
                </div>
                <p className='prev-anlys'>
                  Highly <br /> Compaitable
                </p>
            </div>
          </div>
          <div className="right">
            <div className="strengths">
                <div className="up">
                  <AiOutlineThunderbolt size={25} color={"var(--blue)"}/>
                  <h4>Core Strengths</h4>
                </div>
                <ul className="list">
                  {
                    strengths.map((st,i)=>(
                      <li key={i} className='li'>
                         <span>{st.tag}</span> &nbsp;
                         {st.message}
                      </li>
                    ))
                  }
                </ul>
            </div>
            <div className="gaps">
              <div className="up">
                <IoWarningOutline size={20}color='var(--red)'/>
                <h4>IDENTIFIED GAPS</h4>
              </div>
                <ul className="list">
                  {
                    weakness.map((st,i)=>(
                      <li key={i} className='li'>
                         <span className='sec-span'>{st.tag}</span> &nbsp;
                         {st.message}
                      </li>
                    ))
                  }
                </ul>
            </div>
          </div>
        </div>
        <div className="report-grid">
          <div className="up">
            <h4>Analysis Archive</h4>
            <h5>TOTAL ENTRIES: {150}</h5>
          </div>
          <table>
            <tr>
              <th>Job Title</th>
              <th>Date Created</th>
              <th>Matched Score</th>
              <th>Reports</th>
            </tr>
            {
              reports.map((r,i)=>(
                <tr>
                  <td>
                    <h4>{r.jobTitle}</h4>
                    <p>{r.department}</p>
                  </td>
                  <td>
                    <p>{r.processedDate}</p>
                  </td>
                  <td className='status'>
                    <div className="status-bar" style={{width:`calc(${r.matchScore}% - 30%)`}}></div>
                    <p>{r.matchScore}%</p>
                  </td>
                  <td className='flex-close'>
                    <div className='report-btn' style={{padding:".5em 1em"}}><GoDownload /></div>
                    <Button text='view Report' isBorder={true} borderValue={0} color='#000' bg='#fff' />
                  </td>
                </tr>
              ))
            }
          </table>
          <div className='down'>
            <h4>Acess Full Archieve Analysis</h4>
          </div>
        </div>
      </div>
    </section>
  )
}

export default History