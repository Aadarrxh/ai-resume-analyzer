import React, { useState, useEffect } from 'react'
import styles from '../style/InterviewReport.module.css'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
]

// ── Sub-components ────────────────────────────────────────────────────────────

const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader} onClick={() => setOpen(prev => !prev)}>
                <span className={styles.questionIndex}>Q{index + 1}</span>
                <p className={styles.questionText}>{item.question}</p>
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

            {open && (
                <div className={styles.questionBody}>
                    {item.intention && (
                        <div className={styles.questionSection}>
                            <span className={styles.tagIntention}>Intention</span>
                            <p className={styles.answerText}>{item.intention}</p>
                        </div>
                    )}
                    {item.answer && (
                        <div className={styles.questionSection}>
                            <span className={styles.tagAnswer}>Model Answer</span>
                            <p className={styles.answerText}>{item.answer}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const RoadMapCard = ({ day }) => (
    <div className={styles.roadmapCard}>
        <div className={styles.roadmapHeader}>
            <span className={styles.dayBadge}>Day {day.day}</span>
            <h3 className={styles.dayFocus}>{day.focus}</h3>
        </div>
        {day.tasks && day.tasks.length > 0 && (
            <ul className={styles.taskList}>
                {day.tasks.map((task, idx) => (
                    <li key={idx} className={styles.taskItem}>
                        <span className={styles.taskBullet} />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────

const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ isDownloadingPdf, setIsDownloadingPdf ] = useState(false)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId, getReportById ])

    // Maintain solid dark background on document body for this route
    useEffect(() => {
        const prevBg = document.body.style.backgroundColor
        const prevBgImg = document.body.style.backgroundImage
        document.body.style.backgroundColor = '#0b0f19'
        document.body.style.backgroundImage = 'none'
        return () => {
            document.body.style.backgroundColor = prevBg
            document.body.style.backgroundImage = prevBgImg
        }
    }, [])

    const handleDownloadResume = async () => {
        if (!interviewId || isDownloadingPdf) return
        try {
            setIsDownloadingPdf(true)
            await getResumePdf(interviewId)
        } catch (err) {
            console.error('Failed to download resume PDF:', err)
        } finally {
            setIsDownloadingPdf(false)
        }
    }

    if (loading && !report) {
        return (
            <main className={styles.loadingScreen}>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    if (!report) {
        return (
            <main className={styles.loadingScreen}>
                <h1>Report not found</h1>
            </main>
        )
    }

    const matchScore = report.matchScore ?? 0

    const scoreRingClass =
        matchScore >= 80 ? styles.scoreHigh :
            matchScore >= 60 ? styles.scoreMid : styles.scoreLow

    const scoreTextColorClass =
        matchScore >= 80 ? styles.textHigh :
            matchScore >= 60 ? styles.textMid : styles.textLow

    const scoreSubtitleText =
        matchScore >= 80 ? 'Strong match for this role' :
            matchScore >= 60 ? 'Moderate match for this role' : 'Needs preparation for this role'

    return (
        <div className={styles.interviewPage}>
            <div className={styles.layoutContainer}>
                {/* ── Left Sidebar (Sections + Download Resume) ── */}
                <aside className={styles.leftSidebar}>
                    <div className={styles.sidebarTop}>
                        <p className={styles.sectionLabel}>Sections</p>
                        <div className={styles.navList} role="navigation" aria-label="Sections">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`${styles.navButton} ${activeNav === item.id ? styles.navButtonActive : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className={styles.navIcon}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sidebarBottom}>
                        <button
                            type="button"
                            onClick={handleDownloadResume}
                            className={styles.downloadButton}
                            disabled={isDownloadingPdf}
                        >
                            <span className={styles.downloadIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
                                </svg>
                            </span>
                            <span>{isDownloadingPdf ? 'Downloading...' : 'Download Resume'}</span>
                        </button>
                    </div>
                </aside>

                {/* ── Center Content Column ── */}
                <main className={styles.centerContent}>
                    {activeNav === 'technical' && (
                        <>
                            <div className={styles.headerRow}>
                                <h1 className={styles.headerTitle}>Technical Questions</h1>
                                <span className={styles.countBadge}>
                                    {report.technicalQuestions?.length || 0} questions
                                </span>
                            </div>
                            <div className={styles.dividerLine} />
                            <div className={styles.questionList}>
                                {report.technicalQuestions && report.technicalQuestions.length > 0 ? (
                                    report.technicalQuestions.map((q, idx) => (
                                        <QuestionCard key={idx} item={q} index={idx} />
                                    ))
                                ) : (
                                    <p style={{ color: '#7e8b9f', fontSize: '14px' }}>No technical questions available.</p>
                                )}
                            </div>
                        </>
                    )}

                    {activeNav === 'behavioral' && (
                        <>
                            <div className={styles.headerRow}>
                                <h1 className={styles.headerTitle}>Behavioral Questions</h1>
                                <span className={styles.countBadge}>
                                    {report.behavioralQuestions?.length || 0} questions
                                </span>
                            </div>
                            <div className={styles.dividerLine} />
                            <div className={styles.questionList}>
                                {report.behavioralQuestions && report.behavioralQuestions.length > 0 ? (
                                    report.behavioralQuestions.map((q, idx) => (
                                        <QuestionCard key={idx} item={q} index={idx} />
                                    ))
                                ) : (
                                    <p style={{ color: '#7e8b9f', fontSize: '14px' }}>No behavioral questions available.</p>
                                )}
                            </div>
                        </>
                    )}

                    {activeNav === 'roadmap' && (
                        <>
                            <div className={styles.headerRow}>
                                <h1 className={styles.headerTitle}>Preparation Road Map</h1>
                                <span className={styles.countBadge}>
                                    {report.preparationPlan?.length || 0}-day plan
                                </span>
                            </div>
                            <div className={styles.dividerLine} />
                            <div className={styles.roadmapList}>
                                {report.preparationPlan && report.preparationPlan.length > 0 ? (
                                    report.preparationPlan.map((day) => (
                                        <RoadMapCard key={day.day} day={day} />
                                    ))
                                ) : (
                                    <p style={{ color: '#7e8b9f', fontSize: '14px' }}>No preparation roadmap available.</p>
                                )}
                            </div>
                        </>
                    )}
                </main>

                {/* ── Right Sidebar (Match Score + Skill Gaps) ── */}
                <aside className={styles.rightSidebar}>
                    {/* Match Score */}
                    <div className={styles.rightPanelSection}>
                        <p className={styles.panelHeading}>MATCH SCORE</p>
                        <div className={styles.scoreWrapper}>
                            <div className={`${styles.scoreCircle} ${scoreRingClass}`}>
                                <span className={styles.scoreNumber}>{matchScore}</span>
                                <span className={styles.scorePercent}>%</span>
                            </div>
                            <p className={`${styles.scoreSubtitle} ${scoreTextColorClass}`}>
                                {scoreSubtitleText}
                            </p>
                        </div>
                    </div>

                    <div className={styles.rightDivider} />

                    {/* Skill Gaps */}
                    <div className={styles.rightPanelSection}>
                        <p className={styles.panelHeading}>SKILL GAPS</p>
                        <div className={styles.gapsList}>
                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                report.skillGaps.map((gap, idx) => {
                                    const severityClass =
                                        gap.severity === 'high' ? styles.gapHigh :
                                            gap.severity === 'medium' ? styles.gapMedium : styles.gapLow

                                    return (
                                        <div key={idx} className={`${styles.gapCard} ${severityClass}`}>
                                            {gap.skill}
                                        </div>
                                    )
                                })
                            ) : (
                                <p style={{ color: '#7e8b9f', fontSize: '12px' }}>No skill gaps identified.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview
