import { useState } from 'react';
import { Loader, FileText, AlertTriangle, Search, RotateCcw, AlertCircle } from 'lucide-react';
import './App.css';
import Logo from './components/Logo';
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
            <div className="container">
                <header className="app-header">
                    <div className="header-content">
                        <Logo size="medium" />
                        <h1 className="app-title">
                            <span className="title-gradient">Diff-Checker 2.0</span>
                        </h1>
                    </div>
                </header>

                <section className="hero-section">
                    <h2 className="hero-title">AI-Powered PDF Comparison</h2>
                    <p className="hero-subtitle">
                        Compare technical documents with precision. Get highlighted differences and AI-generated summaries.
                    </p>
                </section>

                <div className="upload-section">
                    <div className="section-header">
                        <h2>Upload Documents</h2>
                    </div>
                    <div className="uploaders-grid">
                        <FileUploader
                            label="Document A (BEFORE / Baseline)"
                            onFileSelect={setFileBefore}
                            selectedFile={fileBefore}
                            type="before"
                        />
                        <FileUploader
                            label="Document B (AFTER / Modified)"
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
                                    <Search className="w-5 h-5" />
                                    Compare Documents
                                </>
                            )}
                        </button>

                        {(fileBefore || fileAfter || results) && (
                            <button className="reset-btn" onClick={handleReset}>
                                <RotateCcw className="w-5 h-5" />
                                Reset
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </div>

                {loading && (
                    <LoadingSpinner message="Extracting structured data and comparing with AI..." />
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
                            <div className="debug-warning">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Debug: No highlighted PDF URLs found in response. Check browser console for details.</span>
                            </div>
                        )}
                    </div>
                )}

                {!loading && !results && !error && (
                    <div className="instructions">
                        <div className="instructions-header">
                            <FileText className="w-6 h-6" />
                            <h3>How it works</h3>
                        </div>
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
