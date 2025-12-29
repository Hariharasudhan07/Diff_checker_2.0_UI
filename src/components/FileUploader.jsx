import React, { useState } from 'react';
import { Upload, FileCheck } from 'lucide-react';
import './FileUploader.css';

const FileUploader = ({ label, onFileSelect, selectedFile, type }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            onFileSelect(files[0]);
        } else {
            alert('Please upload a PDF file');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            onFileSelect(file);
        } else {
            alert('Please upload a PDF file');
        }
    };

    return (
        <div className="file-uploader">
            <label className="uploader-label">{label}</label>
            <div
                className={`upload-area ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById(`file-input-${type}`).click()}
            >
                <input
                    id={`file-input-${type}`}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div className="upload-icon">
                    {selectedFile ? (
                        <FileCheck className="w-12 h-12" />
                    ) : (
                        <Upload className="w-12 h-12" />
                    )}
                </div>

                <div className="upload-text">
                    {selectedFile ? (
                        <>
                            <p className="file-name">{selectedFile.name}</p>
                            <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                    ) : (
                        <>
                            <p className="upload-prompt">Drag & drop your PDF here</p>
                            <p className="upload-or">or</p>
                            <button className="browse-button" type="button">Browse Files</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
