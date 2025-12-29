import React, { useState } from 'react';
import { BarChart3, CheckCircle, XCircle, RefreshCw, Table, Info, ChevronDown } from 'lucide-react';
import './ComparisonResults.css';

const ComparisonResults = ({ results }) => {
    // Auto-expand sections that have data
    const [expandedSections, setExpandedSections] = useState({
        added: true,
        removed: true,
        modified: true,
        table_changes: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderChangesList = (changes, type) => {
        if (!changes || changes.length === 0) return null;

        return (
            <div className={`changes-section ${type}`}>
                <div
                    className="section-header"
                    onClick={() => toggleSection(type)}
                >
                    <div className="section-title">
                        <span className={`icon ${type}`}>
                            {type === 'added' && <CheckCircle className="w-5 h-5" />}
                            {type === 'removed' && <XCircle className="w-5 h-5" />}
                            {type === 'modified' && <RefreshCw className="w-5 h-5" />}
                            {type === 'table_changes' && <Table className="w-5 h-5" />}
                        </span>
                        <h3>
                            {type === 'added' && 'Added'}
                            {type === 'removed' && 'Removed'}
                            {type === 'modified' && 'Modified'}
                            {type === 'table_changes' && 'Table Changes'}
                        </h3>
                        <span className="count-badge">{changes.length}</span>
                    </div>
                    <ChevronDown className={`expand-icon ${expandedSections[type] ? 'expanded' : ''}`} />
                </div>

                {expandedSections[type] && (
                    <div className="changes-list">
                        {changes.map((change, index) => {
                            // Handle both string and object formats
                            const isString = typeof change === 'string';

                            return (
                                <div key={index} className="change-item">
                                    {isString ? (
                                        <div className="change-description">{change}</div>
                                    ) : (
                                        <>
                                            {change.field && (
                                                <div className="change-field">
                                                    <strong>Field:</strong> {change.field}
                                                </div>
                                            )}
                                            {change.description && (
                                                <div className="change-description">{change.description}</div>
                                            )}
                                            {change.old_value !== undefined && (
                                                <div className="change-values">
                                                    <div className="old-value">
                                                        <span className="value-label">Before:</span>
                                                        <span className="value-content">{String(change.old_value)}</span>
                                                    </div>
                                                    {change.new_value !== undefined && (
                                                        <div className="new-value">
                                                            <span className="value-label">After:</span>
                                                            <span className="value-content">{String(change.new_value)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {change.change_type && (
                                                <div className="change-type-badge">{change.change_type}</div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="comparison-results">
            <div className="results-header">
                <div className="results-title">
                    <BarChart3 className="w-6 h-6" />
                    <h2>Comparison Summary</h2>
                </div>
                {results.total_changes !== undefined && (
                    <div className="total-changes">
                        Total Changes: <span className="highlight">{results.total_changes}</span>
                    </div>
                )}
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color red"></div>
                    <span><strong>Red</strong> = Removed/Changed (in BEFORE document)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color green"></div>
                    <span><strong>Green</strong> = Added/New (in AFTER document)</span>
                </div>
            </div>

            {results.summary && (
                <div className="summary-section">
                    <h3>Summary</h3>
                    <p>{results.summary}</p>
                </div>
            )}

            <div className="changes-container">
                {renderChangesList(results.added, 'added')}
                {renderChangesList(results.removed, 'removed')}
                {renderChangesList(results.modified, 'modified')}
                {renderChangesList(results.table_changes, 'table_changes')}
            </div>

            {results.batch_count && results.batch_count > 1 && (
                <div className="batch-info">
                    <Info className="w-4 h-4" />
                    <span>Processed in {results.batch_count} batches</span>
                </div>
            )}
        </div>
    );
};

export default ComparisonResults;
