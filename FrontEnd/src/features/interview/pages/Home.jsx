import React, { useState, useRef } from 'react';
import { Briefcase, User, UploadCloud, Info, Sparkles, FileText } from 'lucide-react';
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import '../style/home.scss';

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const navigate = useNavigate();

  // Form State
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');

  // File Upload State & Reference
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    const data = await generateReport({ jobDescription, selfDescription, resumeFile: selectedFile });
    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>
          Create Your Custom <span className="gradient-text">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </header>

      <main className="page-card">
        <div className="card-grid">

          {/* Left Column */}
          <section className="card-panel">
            <div className="panel-heading">
              <div className="panel-title">
                <div className="circle-icon red">
                  <Briefcase size={14} />
                </div>
                <h2>Target Job Description</h2>
              </div>
              <span className="badge">REQUIRED</span>
            </div>

            <div className="textarea-wrap">
              <textarea
                placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
              />
              <span className="char-count">{jobDescription.length} / 5000 chars</span>
            </div>
          </section>

          {/* Right Column */}
          <section className="card-panel">
            <div className="panel-heading">
              <div className="panel-title">
                <div className="circle-icon blue">
                  <User size={14} />
                </div>
                <h2>Your Profile</h2>
              </div>
            </div>

            <div className="field-group">
              <label>
                Upload Resume <span>*</span>
              </label>

              {/* HIDDEN NATIVE FILE INPUT */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                style={{ display: 'none' }}
              />

              {/* TRIGGER BUTTON */}
              <button
                type="button"
                className="upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <>
                    <div className="icon-ring" style={{ background: 'rgba(96, 165, 250, 0.12)', color: '#60a5fa' }}>
                      <FileText size={18} />
                    </div>
                    <p style={{ color: '#60a5fa' }}>{selectedFile.name}</p>
                    <small>Click to change file</small>
                  </>
                ) : (
                  <>
                    <div className="icon-ring">
                      <UploadCloud size={18} />
                    </div>
                    <p>Click to upload or drag & drop</p>
                    <small>PDF or DOCX (Max 5MB)</small>
                  </>
                )}
              </button>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="field-group">
              <label>
                Self Description <span>*</span>
              </label>
              <textarea
                className="short-textarea"
                placeholder="Briefly describe your experience, key skills, and years of experience..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            <div className="info-box">
              <Info size={16} />
              <p>
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
              </p>
            </div>
          </section>
        </div>

        {/* Card Footer */}
        <div className="card-footer">
          <div className="status-row">
            <span className="status-dot" />
            <p>AI-Powered Strategy Generation • Approx 30s</p>
          </div>
          <button type="button" className="action-btn" onClick={handleGenerateReport}>
            <Sparkles size={16} />
            Generate My Interview Strategy
          </button>
        </div>
      </main>

      {/* Recent Reports Section */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || 'Untitled Position'}</h3>
                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page Footer */}
      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default Home;