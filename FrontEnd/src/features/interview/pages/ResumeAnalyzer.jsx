import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, User, UploadCloud, Info, Sparkles, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useInterview } from '../hooks/useInterview';
import { useNotification } from '../../ui/context/Notification.context';
import styles from '../style/ResumeAnalyzer.module.scss';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB Multer limit
const MAX_JOB_CHARS = 5000;

const ResumeAnalyzer = () => {
  const { generateReport, reports } = useInterview();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Form State
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Interaction States
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef(null);

  // Helpers
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const validateFile = (file) => {
    setSubmitError('');
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      const msg = 'Only PDF documents (.pdf) are supported.';
      setErrors((prev) => ({ ...prev, file: msg }));
      addNotification?.({ title: 'Invalid File', message: msg, type: 'error' });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const msg = `File exceeds 3 MB limit (${formatFileSize(file.size)}).`;
      setErrors((prev) => ({ ...prev, file: msg }));
      addNotification?.({ title: 'File Too Large', message: msg, type: 'error' });
      return;
    }

    setSelectedFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });

    addNotification?.({
      title: 'Resume Attached',
      message: `${file.name} (${formatFileSize(file.size)}) ready for analysis.`,
      type: 'info',
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) validateFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step ticker during generation
  useEffect(() => {
    let t1, t2, t3;
    if (isSubmitting) {
      setLoadingStep(0);
      t1 = setTimeout(() => setLoadingStep(1), 3500);
      t2 = setTimeout(() => setLoadingStep(2), 8500);
      t3 = setTimeout(() => setLoadingStep(3), 14000);
    } else {
      setLoadingStep(0);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isSubmitting]);

  // Form Submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitError('');

    const newErrors = {};

    if (!selectedFile) {
      newErrors.file = 'A resume PDF is required.';
    }

    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Target Job Description is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addNotification?.({
        title: 'Missing Required Fields',
        message: 'Please provide both your resume PDF and the target job description.',
        type: 'error',
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const data = await generateReport({
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resumeFile: selectedFile,
      });

      if (data && data._id) {
        addNotification?.({
          title: 'Plan Generated!',
          message: 'Redirecting to your custom interview roadmap...',
          type: 'success',
        });
        navigate(`/interview/${data._id}`);
      } else {
        throw new Error('Interview report was not returned by the server.');
      }
    } catch (err) {
      console.error('Error generating strategy:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to generate interview strategy. Please verify your connection.';
      setSubmitError(message);
      addNotification?.({
        title: 'Generation Failed',
        message,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* ── Page Header ────────────────────────────────────── */}
      <div className={styles.headerSection}>
        <h1>
          Create Your Custom <span className={styles.gradientText}>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </div>

      {/* ── Form Card ──────────────────────────────────────── */}
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.cardGrid}>
            {/* ── Left Column: Target Job Description ───────── */}
            <div className={styles.columnPanel}>
              <div className={styles.panelHeading}>
                <div className={styles.panelTitle}>
                  <div className={`${styles.iconBox} ${styles.iconRed}`}>
                    <Briefcase size={16} />
                  </div>
                  <h2>Target Job Description</h2>
                </div>
                <span className={styles.requiredBadge}>REQUIRED</span>
              </div>

              <div className={styles.jobTextareaWrap}>
                <textarea
                  placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (errors.jobDescription) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.jobDescription;
                        return next;
                      });
                    }
                  }}
                  maxLength={MAX_JOB_CHARS}
                  className={errors.jobDescription ? styles.hasError : ''}
                />
                <span className={styles.charCounter}>
                  {jobDescription.length} / {MAX_JOB_CHARS} chars
                </span>
              </div>

              {errors.jobDescription && (
                <div className={styles.errorMsg}>
                  <AlertCircle size={14} />
                  <span>{errors.jobDescription}</span>
                </div>
              )}
            </div>

            {/* ── Right Column: Your Profile ────────────────── */}
            <div className={styles.columnPanel}>
              <div className={styles.panelHeading}>
                <div className={styles.panelTitle}>
                  <div className={`${styles.iconBox} ${styles.iconBlue}`}>
                    <User size={16} />
                  </div>
                  <h2>Your Profile</h2>
                </div>
              </div>

              {/* Upload Resume Area */}
              <div className={styles.fieldGroup}>
                <label>
                  Upload Resume <span className={styles.star}>*</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf,.pdf"
                  style={{ display: 'none' }}
                />

                <div
                  className={`
                    ${styles.uploadBox}
                    ${isDragging ? styles.uploadBoxDragging : ''}
                    ${selectedFile ? styles.uploadBoxHasFile : ''}
                    ${errors.file ? styles.uploadBoxHasError : ''}
                  `}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                  }}
                >
                  {selectedFile ? (
                    <>
                      <div className={`${styles.iconRing} ${styles.iconRingBlue}`}>
                        <FileText size={20} />
                      </div>
                      <p className={styles.uploadPrompt} style={{ color: '#60a5fa' }}>
                        {selectedFile.name}
                      </p>
                      <div className={styles.fileStatusRow}>
                        <small className={styles.uploadSub}>
                          {formatFileSize(selectedFile.size)} • Click to change
                        </small>
                        <button
                          type="button"
                          className={styles.clearFileBtn}
                          onClick={handleClearFile}
                        >
                          Clear
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.iconRing}>
                        <UploadCloud size={20} />
                      </div>
                      <p className={styles.uploadPrompt}>Click to upload or drag & drop</p>
                      <small className={styles.uploadSub}>PDF format (Max 3MB)</small>
                    </>
                  )}
                </div>

                {errors.file && (
                  <div className={styles.errorMsg}>
                    <AlertCircle size={14} />
                    <span>{errors.file}</span>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className={styles.divider}>
                <span>OR</span>
              </div>

              {/* Self Description */}
              <div className={styles.fieldGroup}>
                <label>Self Description</label>
                <textarea
                  className={styles.selfTextarea}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  maxLength={1000}
                />
              </div>

              {/* Info Box */}
              <div className={styles.infoBox}>
                <Info size={16} />
                <p>
                  Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Form Error Banner */}
          {submitError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          {/* ── Card Footer ─────────────────────────────────── */}
          <div className={styles.cardFooter}>
            <div className={styles.statusRow}>
              <span className={styles.statusDot} />
              <span>AI-Powered Strategy Generation • Approx 30s</span>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  <span>Generating Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate My Interview Strategy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Recent Reports ─────────────────────────────────── */}
      {reports && reports.length > 0 && (
        <div className={styles.recentSection}>
          <h2>My Recent Interview Plans</h2>
          <ul className={styles.reportsList}>
            {reports.map((report) => (
              <li
                key={report._id}
                className={styles.reportItem}
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || 'Untitled Position'}</h3>
                <p>
                  Generated on {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recently'}
                </p>
                <span
                  className={`
                    ${styles.scorePill}
                    ${
                      report.matchScore >= 80
                        ? styles.scoreHigh
                        : report.matchScore >= 60
                        ? styles.scoreMid
                        : styles.scoreLow
                    }
                  `}
                >
                  Match Score: {report.matchScore}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Page Footer ────────────────────────────────────── */}
      <footer className={styles.pageFooter}>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#help">Help Center</a>
      </footer>

      {/* ── Loading Overlay Modal ──────────────────────────── */}
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingModalCard}>
            <div className={styles.loadingPulseRing}>
              <Sparkles size={28} />
            </div>
            <h2>Analyzing Profile & Job Description</h2>
            <p>Our AI is cross-referencing requirements to build your personalized strategy plan.</p>

            <div className={styles.stepList}>
              <div className={`${styles.stepItem} ${loadingStep === 0 ? styles.stepActive : loadingStep > 0 ? styles.stepDone : ''}`}>
                <span className={styles.stepBadge}>{loadingStep > 0 ? '✓' : '1'}</span>
                <span>Extracting credentials and resume text...</span>
              </div>
              <div className={`${styles.stepItem} ${loadingStep === 1 ? styles.stepActive : loadingStep > 1 ? styles.stepDone : ''}`}>
                <span className={styles.stepBadge}>{loadingStep > 1 ? '✓' : '2'}</span>
                <span>Analyzing skill gaps & role requirements...</span>
              </div>
              <div className={`${styles.stepItem} ${loadingStep === 2 ? styles.stepActive : loadingStep > 2 ? styles.stepDone : ''}`}>
                <span className={styles.stepBadge}>{loadingStep > 2 ? '✓' : '3'}</span>
                <span>Generating technical & behavioral question banks...</span>
              </div>
              <div className={`${styles.stepItem} ${loadingStep === 3 ? styles.stepActive : ''}`}>
                <span className={styles.stepBadge}>4</span>
                <span>Finalizing 10-day preparation roadmap...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
