import React, { useState } from 'react'
import styles from '../style/InterviewReport.module.css'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions' },
    { id: 'behavioral', label: 'Behavioral Questions' },
    { id: 'roadmap', label: 'Preparation Roadmap' },
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <article className={styles.questionCard}>
            <button
                type="button"
                className={styles.questionToggle}
                onClick={() => setOpen(value => !value)}
                aria-expanded={open}
            >
                <span className={styles.questionIndex}>Q{index + 1}</span>
                <span className={styles.questionText}>{item.question}</span>
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {open && (
                <div className={styles.questionBody}>
                    <section className={styles.answerSection}>
                        <span className={styles.answerLabel}>Intention</span>
                        <p className={styles.answerText}>{item.intention || 'No intention provided.'}</p>
                    </section>
                    <section className={styles.answerSection}>
                        <span className={styles.answerLabel}>Model Answer</span>
                        <p className={styles.answerText}>{item.answer || 'No model answer provided.'}</p>
                    </section>
                </div>
            )}
        </article>
    )
}

const RoadMapDay = ({ day }) => (
    <article className={styles.roadmapDay}>
        <div className={styles.roadmapDayHeading}>
            <span className={styles.dayBadge}>Day {day.day}</span>
            <h3 className={styles.dayFocus}>{day.focus}</h3>
        </div>
        {Array.isArray(day.tasks) && day.tasks.length > 0 && (
            <ul className={styles.dayTasks}>
                {day.tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                ))}
            </ul>
        )}
    </article>
)

const Interview = () => {
    const [activeTab, setActiveTab] = useState('technical')
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    // The useInterview hook already loads the report for the current route.
    // Keep the existing report visible while a resume PDF is being generated.
    if (!report) {
        return (
            <main className={styles.loadingScreen}>
                <div className={styles.loadingContent}>
                    <span className={styles.loadingDot} />
                    <h1>{loading ? 'Loading your interview report...' : 'Preparing your interview report...'}</h1>
                </div>
            </main>
        )
    }

    const technicalQuestions = Array.isArray(report.technicalQuestions) ? report.technicalQuestions : []
    const behavioralQuestions = Array.isArray(report.behavioralQuestions) ? report.behavioralQuestions : []
    const preparationPlan = Array.isArray(report.preparationPlan) ? report.preparationPlan : []
    const skillGaps = Array.isArray(report.skillGaps) ? report.skillGaps : []
    const matchScore = Number(report.matchScore) || 0
    const scoreTone = matchScore >= 80 ? styles.scoreHigh : matchScore >= 60 ? styles.scoreMid : styles.scoreLow

    const activeCount = activeTab === 'technical'
        ? technicalQuestions.length
        : activeTab === 'behavioral'
            ? behavioralQuestions.length
            : preparationPlan.length

    return (
        <main className={styles.interviewPage} aria-labelledby="interview-report-title">
            <div className={styles.pageShell}>
                <header className={styles.reportHeader}>
                    <div className={styles.headerCopy}>
                        <span className={styles.reportEyebrow}>Your preparation workspace</span>
                        <h1 id="interview-report-title" className={styles.reportTitle}>
                            {report.title || 'Interview Preparation Report'}
                        </h1>
                        <p className={styles.reportSubtitle}>
                            Your questions, suggested answers and focused preparation plan in one place.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => getResumePdf(interviewId)}
                        className={styles.downloadButton}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Resume
                    </button>
                </header>

                <section className={styles.overviewGrid} aria-label="Interview report overview">
                    <div className={styles.scoreCard}>
                        <div className={`${styles.scoreRing} ${scoreTone}`}>
                            <span className={styles.scoreNumber}>{matchScore}</span>
                            <span className={styles.scorePercent}>%</span>
                        </div>
                        <div className={styles.scoreCopy}>
                            <h2>Resume match</h2>
                            <p>Alignment with the job description</p>
                        </div>
                    </div>

                    <div className={styles.skillCard}>
                        <div className={styles.skillCardHeading}>
                            <div>
                                <h2>Skill gaps to focus on</h2>
                                <p>{skillGaps.length ? 'Prioritise these areas during preparation.' : 'No skill gaps were listed in this report.'}</p>
                            </div>
                            <span className={styles.skillCount}>{skillGaps.length}</span>
                        </div>
                        {skillGaps.length > 0 && (
                            <div className={styles.skillChips}>
                                {skillGaps.map((gap, index) => {
                                    const severity = String(gap.severity || 'medium').toLowerCase()
                                    const severityClass = severity === 'high' ? styles.chipHigh : severity === 'low' ? styles.chipLow : styles.chipMedium
                                    return (
                                        <span key={index} className={`${styles.skillChip} ${severityClass}`}>
                                            {gap.skill}
                                        </span>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <nav className={styles.reportTabs} aria-label="Report sections" role="tablist">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === item.id}
                            className={`${styles.tabButton} ${activeTab === item.id ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <section className={styles.reportContent} role="tabpanel">
                    <div className={styles.contentHeading}>
                        <div>
                            <span className={styles.contentEyebrow}>Interview preparation</span>
                            <h2>
                                {activeTab === 'technical'
                                    ? 'Technical questions'
                                    : activeTab === 'behavioral'
                                        ? 'Behavioral questions'
                                        : 'Your preparation roadmap'}
                            </h2>
                        </div>
                        <span className={styles.itemCount}>
                            {activeTab === 'roadmap'
                                ? `${activeCount} days`
                                : `${activeCount} questions`}
                        </span>
                    </div>

                    {activeTab === 'technical' && (
                        <div className={styles.questionList}>
                            {technicalQuestions.length > 0
                                ? technicalQuestions.map((question, index) => (
                                    <QuestionCard key={question._id || index} item={question} index={index} />
                                ))
                                : <p className={styles.emptyState}>No technical questions are available in this report.</p>}
                        </div>
                    )}

                    {activeTab === 'behavioral' && (
                        <div className={styles.questionList}>
                            {behavioralQuestions.length > 0
                                ? behavioralQuestions.map((question, index) => (
                                    <QuestionCard key={question._id || index} item={question} index={index} />
                                ))
                                : <p className={styles.emptyState}>No behavioral questions are available in this report.</p>}
                        </div>
                    )}

                    {activeTab === 'roadmap' && (
                        <div className={styles.roadmapList}>
                            {preparationPlan.length > 0
                                ? preparationPlan.map((day, index) => (
                                    <RoadMapDay key={day.day || index} day={day} />
                                ))
                                : <p className={styles.emptyState}>No preparation roadmap is available in this report.</p>}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Interview
