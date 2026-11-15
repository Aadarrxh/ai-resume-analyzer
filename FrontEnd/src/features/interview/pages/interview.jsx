import React, { useState, useEffect } from 'react'
import styles from '../style/InterviewReport.module.css'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader} onClick={() => setOpen(o => !o)}>
                <span className={styles.questionIndex}>Q{index + 1}</span>
                <div className={styles.questionContent}>
                    <p className={styles.questionText}>{item.question}</p>
                </div>
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className={styles.questionBody}>
                    <div className={styles.questionSection}>
                        <span className={styles.tagIntention}>Intention</span>
                        <p className={styles.answerContent}>{item.intention}</p>
                    </div>
                    <div className={styles.questionSection}>
                        <span className={styles.tagAnswer}>Model Answer</span>
                        <p className={styles.answerContent}>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className={styles.roadmapDay}>
        <div className={styles.roadmapDayHeader}>
            <span className={styles.dayBadge}>Day {day.day}</span>
            <h3 className={styles.dayFocus}>{day.focus}</h3>
        </div>
        <ul className={styles.dayTasks}>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className={styles.taskBullet} />
                    <span className={styles.taskText}>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    // Ensure route body has solid dark background without leaking global grid background
    useEffect(() => {
        const prevBg = document.body.style.backgroundColor;
        const prevBgImg = document.body.style.backgroundImage;
        document.body.style.backgroundColor = '#0B1020';
        document.body.style.backgroundImage = 'none';
        return () => {
            document.body.style.backgroundColor = prevBg;
            document.body.style.backgroundImage = prevBgImg;
        };
    }, []);

    if (loading || !report) {
        return (
            <main className={styles.loadingScreen}>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColorClass =
        report.matchScore >= 80 ? styles.scoreHigh :
            report.matchScore >= 60 ? styles.scoreMid : styles.scoreLow

    return (
        <div className={styles.interviewPage}>
            <div className={styles.interviewLayout}>
                {/* ── SectionSidebar (Sticky below navbar, natural height, no scrollbar) ── */}
                <aside className={styles.sectionSidebar}>
                    <div className={styles.sidebarNav}>
                        <p className={styles.sidebarLabel}>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${activeNav === item.id ? styles.navItemActive : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className={styles.downloadResumeBtn}
                    >
                        <span className={styles.navIcon}>
                            <svg height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        </span>
                        Download Resume
                    </button>
                </aside>

                {/* ── MainContent (Normal document flow) ── */}
                <main className={styles.mainContent}>
                    {/* ── ReportCard (Encloses all content, grows naturally) ── */}
                    <div className={styles.reportCard}>
                        {/* ── ReportHeader ── */}
                        <div className={styles.reportHeader}>
                            <div className={styles.reportHeaderTop}>
                                <span className={styles.reportBadge}>Interview Report</span>
                            </div>
                            <h1 className={styles.reportTitle}>{report.title || 'Interview Preparation Strategy'}</h1>
                            <p className={styles.reportSubtitle}>AI-generated interview preparation report & performance analytics</p>
                        </div>

                        {/* ── ReportGrid (Shared 2-column layout for all 3 tabs) ── */}
                        <div className={styles.reportGrid}>
                            {/* ── PrimaryContent ── */}
                            <div className={styles.primaryContent}>
                                {activeNav === 'technical' && (
                                    <section className={styles.tabSection}>
                                        <div className={styles.sectionHeader}>
                                            <h2>Technical Questions</h2>
                                            <span className={styles.countBadge}>{report.technicalQuestions?.length || 0} questions</span>
                                        </div>
                                        <div className={styles.questionList}>
                                            {report.technicalQuestions?.map((q, i) => (
                                                <QuestionCard key={i} item={q} index={i} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {activeNav === 'behavioral' && (
                                    <section className={styles.tabSection}>
                                        <div className={styles.sectionHeader}>
                                            <h2>Behavioral Questions</h2>
                                            <span className={styles.countBadge}>{report.behavioralQuestions?.length || 0} questions</span>
                                        </div>
                                        <div className={styles.questionList}>
                                            {report.behavioralQuestions?.map((q, i) => (
                                                <QuestionCard key={i} item={q} index={i} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {activeNav === 'roadmap' && (
                                    <section className={styles.tabSection}>
                                        <div className={styles.sectionHeader}>
                                            <h2>Preparation Road Map</h2>
                                            <span className={styles.countBadge}>{report.preparationPlan?.length || 0}-day plan</span>
                                        </div>
                                        <div className={styles.roadmapList}>
                                            {report.preparationPlan?.map((day) => (
                                                <RoadMapDay key={day.day} day={day} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* ── RightPanel (Match Score & Skill Gaps) ── */}
                            <aside className={styles.rightPanel}>
                                {/* Match Score */}
                                <div className={styles.matchScoreCard}>
                                    <p className={styles.panelHeading}>Match Score</p>
                                    <div className={`${styles.scoreRing} ${scoreColorClass}`}>
                                        <span className={styles.scoreNumber}>{report.matchScore}</span>
                                        <span className={styles.scorePercent}>%</span>
                                    </div>
                                </div>

                                <div className={styles.panelDivider} />

                                {/* Skill Gaps */}
                                <div className={styles.skillGapsCard}>
                                    <p className={styles.panelHeading}>Skill Gaps</p>
                                    <div className={styles.gapsChips}>
                                        {report.skillGaps?.map((gap, i) => (
                                            <span
                                                key={i}
                                                className={`${styles.gapChip} ${styles[`chip_${gap.severity}`] || styles.chip_medium}`}
                                            >
                                                {gap.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Interview
