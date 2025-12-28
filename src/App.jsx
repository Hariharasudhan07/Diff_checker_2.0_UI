import { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import ComparisonResults from './components/ComparisonResults';
import PDFViewer from './components/PDFViewer';
import LoadingSpinner from './components/LoadingSpinner';
import { comparePDFs } from './services/api';

function App() {
    const [fileBefore, setFileBefore] = useState(null);
    const [fileAfter, setFileAfter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleCompare = async () => {
        if (!fileBefore || !fileAfter) {
            setError('Please upload both PDF files');
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const data = await comparePDFs(fileBefore, fileAfter);
            console.log('=== API Response ===');
            console.log('Full response:', data);
            console.log('highlighted_before_url:', data.highlighted_before_url);
            console.log('highlighted_after_url:', data.highlighted_after_url);
            console.log('Has before URL?', !!data.highlighted_before_url);
            console.log('Has after URL?', !!data.highlighted_after_url);
            console.log('Will show PDF viewer?', !!(data.highlighted_before_url || data.highlighted_after_url));
            setResults(data);
        } catch (err) {
            console.error('Comparison error:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.detail || 'Failed to compare PDFs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (url, type) => {
        window.open(url, '_blank');
    };

    const handleReset = () => {
        setFileBefore(null);
        setFileAfter(null);
        setResults(null);
        setError(null);
    };

    return (
        <div className="app">
            <div className="gradient-bg">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="container">
                <header className="app-header">
                    <h1 className="app-title">
                        <span className="title-gradient">Diff-Checker 2.0</span>
                    </h1>
                    <p className="app-subtitle">
                        AI-Powered Technical PDF Comparison
                    </p>
                </header>

                <div className="upload-section">
                    <div className="uploaders-grid">
                        <FileUploader
                            label="📄 Document A (BEFORE / Baseline)"
                            onFileSelect={setFileBefore}
                            selectedFile={fileBefore}
                            type="before"
                        />
                        <FileUploader
                            label="📄 Document B (AFTER / Modified)"
                            onFileSelect={setFileAfter}
                            selectedFile={fileAfter}
                            type="after"
                        />
                    </div>

                    <div className="action-buttons">
                        <button
                            className="compare-btn"
                            onClick={handleCompare}
                            disabled={!fileBefore || !fileAfter || loading}
                        >
                            {loading ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    Comparing...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                    Compare Documents
                                </>
                            )}
                        </button>

                        {(fileBefore || fileAfter || results) && (
                            <button className="reset-btn" onClick={handleReset}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="1 4 1 10 7 10"></polyline>
                                    <polyline points="23 20 23 14 17 14"></polyline>
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                                </svg>
                                Reset
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}
                </div>

                {loading && (
                    <LoadingSpinner message="🔄 Extracting structured data and comparing with AI..." />
                )}

                {!loading && results && (
                    <div className="results-section">
                        <ComparisonResults results={results} />

                        <PDFViewer
                            beforeUrl={results.highlighted_before_url}
                            afterUrl={results.highlighted_after_url}
                            onDownload={handleDownload}
                        />

                        {/* Debug info */}
                        {!results.highlighted_before_url && !results.highlighted_after_url && (
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(255, 165, 0, 0.1)',
                                border: '1px solid rgba(255, 165, 0, 0.3)',
                                borderRadius: '8px',
                                color: '#ffa500',
                                marginTop: '1rem'
                            }}>
                                ⚠️ Debug: No highlighted PDF URLs found in response. Check browser console for details.
                            </div>
                        )}
                    </div>
                )}

                {!loading && !results && !error && (
                    <div className="instructions">
                        <h3>📋 How it works:</h3>
                        <ol>
                            <li><strong>Upload</strong> two PDF documents (BEFORE and AFTER)</li>
                            <li><strong>Click</strong> "Compare Documents" to analyze differences</li>
                            <li><strong>View</strong> highlighted PDFs with color-coded changes:
                                <ul>
                                    <li><span className="highlight-red">Red highlights</span> = Removed or changed content (in BEFORE document)</li>
                                    <li><span className="highlight-green">Green highlights</span> = Added or new content (in AFTER document)</li>
                                </ul>
                            </li>
                            <li><strong>Review</strong> the concise summary of all changes</li>
                            <li><strong>Download</strong> highlighted PDFs for offline review</li>
                        </ol>
                    </div>
                )}

                <footer className="app-footer">
                    <p>Powered by AI • FastAPI • React</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
