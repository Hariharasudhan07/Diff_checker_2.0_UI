import React from 'react';
import { FileText, GitCompare } from 'lucide-react';
import './Logo.css';

const Logo = ({ size = 'medium' }) => {
    return (
        <div className={`logo-container logo-${size}`}>
            <div className="logo-icon">
                <FileText className="file-icon file-left" />
                <GitCompare className="compare-icon" />
                <FileText className="file-icon file-right" />
            </div>
        </div>
    );
};

export default Logo;
