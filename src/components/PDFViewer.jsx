import React from 'react';
import './PDFViewer.css';

const PDFViewer = ({ beforeUrl, afterUrl, onDownload }) => {
    // Construct full URLs for PDF viewing
    const API_BASE = 'http://localhost:8000';
    const fullBeforeUrl = beforeUrl ? `${API_BASE}${beforeUrl}` : null;
    const fullAfterUrl = afterUrl ? `${API_BASE}${afterUrl}` : null;

    return (
        <div className="pdf-viewer-container">
            <h2 className="viewer-title">📄 Highlighted PDFs</h2>

            <div className="highlight-info">
                <div className="info-badge red-badge">🔴 Red = Removed/Changed (BEFORE)</div>
                <div className="info-badge green-badge">🟢 Green = Added/New (AFTER)</div>
            </div>

            <div className="pdf-viewers">
                <div className="pdf-viewer-section">
                    <div className="viewer-header">
                        <h3>📕 Document A (BEFORE)</h3>
                        {beforeUrl && (
                            <button
                                className="download-btn"
                                onClick={() => onDownload(fullBeforeUrl, 'before')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download
                            </button>
                        )}
                    </div>
                    <div className="pdf-frame-container">
                        {fullBeforeUrl ? (
                            <iframe
                                src={fullBeforeUrl}
                                className="pdf-frame"
                                title="Before PDF with red highlights for removed/changed content"
                            />
                        ) : (
                            <div className="no-pdf">
                                <p>No PDF available</p>
                            </div>
                        )}
                    </div>
                    <div className="pdf-description">
                        Red highlights show content that was removed or changed
                    </div>
                </div>

                <div className="pdf-viewer-section">
                    <div className="viewer-header">
                        <h3>📗 Document B (AFTER)</h3>
                        {afterUrl && (
                            <button
                                className="download-btn"
                                onClick={() => onDownload(fullAfterUrl, 'after')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download
                            </button>
                        )}
                    </div>
                    <div className="pdf-frame-container">
                        {fullAfterUrl ? (
                            <iframe
                                src={fullAfterUrl}
                                className="pdf-frame"
                                title="After PDF with green highlights for added/new content"
                            />
                        ) : (
                            <div className="no-pdf">
                                <p>No PDF available</p>
                            </div>
                        )}
                    </div>
                    <div className="pdf-description">
                        Green highlights show content that was added or is new
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
