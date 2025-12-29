import React from 'react';
import { FileText, Download, Circle } from 'lucide-react';
import './PDFViewer.css';

const PDFViewer = ({ beforeUrl, afterUrl, onDownload }) => {
    // Construct full URLs for PDF viewing
    const API_BASE = 'http://localhost:8000';
    const fullBeforeUrl = beforeUrl ? `${API_BASE}${beforeUrl}` : null;
    const fullAfterUrl = afterUrl ? `${API_BASE}${afterUrl}` : null;

    return (
        <div className="pdf-viewer-container">
            <div className="viewer-title">
                <FileText className="w-6 h-6" />
                <h2>Highlighted PDFs</h2>
            </div>

            <div className="highlight-info">
                <div className="info-badge red-badge">
                    <Circle className="w-4 h-4" fill="currentColor" />
                    <span>Red = Removed/Changed (BEFORE)</span>
                </div>
                <div className="info-badge green-badge">
                    <Circle className="w-4 h-4" fill="currentColor" />
                    <span>Green = Added/New (AFTER)</span>
                </div>
            </div>

            <div className="pdf-viewers">
                <div className="pdf-viewer-section">
                    <div className="viewer-header">
                        <div className="header-title">
                            <FileText className="w-5 h-5 text-danger-500" />
                            <h3>Document A (BEFORE)</h3>
                        </div>
                        {beforeUrl && (
                            <button
                                className="download-btn"
                                onClick={() => onDownload(fullBeforeUrl, 'before')}
                            >
                                <Download className="w-5 h-5" />
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
                        <div className="header-title">
                            <FileText className="w-5 h-5 text-success-500" />
                            <h3>Document B (AFTER)</h3>
                        </div>
                        {afterUrl && (
                            <button
                                className="download-btn"
                                onClick={() => onDownload(fullAfterUrl, 'after')}
                            >
                                <Download className="w-5 h-5" />
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
