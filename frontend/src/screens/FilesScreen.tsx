import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FileDocument } from '../types';

export const FilesScreen: React.FC = () => {
  const { files, addFile, deleteFile, setCurrentPage, addToast } = useApp();

  const [activeFile, setActiveFile] = useState<FileDocument | null>(files[0] || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUploadSim = (fileName: string) => {
    setIsUploading(true);
    setTimeout(() => {
      const newDoc: FileDocument = {
        id: 'file-' + Date.now(),
        name: fileName,
        size: '1.2 MB',
        type: fileName.endsWith('.pdf')
          ? 'PDF Document'
          : fileName.endsWith('.xlsx')
          ? 'Spreadsheet'
          : 'CSV Data',
        uploadedAt: 'Just now',
        status: 'Analyzed',
        summary: `Document automatically parsed and indexed. Miley extracted telemetry metrics, regional variations, and supplier lead time risks for instant lookup.`,
        keyInsights: [
          'All line items mapped to corresponding SKUs in inventory database.',
          'Lead time variance flagged for Western corridor transits.',
          'Ready for conversational Q&A in AI Assistant.',
        ],
        extractedMetrics: {
          'Processing Status': 'Complete',
          'Indexed Records': '248 Lines',
          'Confidence': '94.2%',
        },
      };

      addFile(newDoc);
      setActiveFile(newDoc);
      setIsUploading(false);
    }, 1500);
  };

  const getFileIcon = (type: FileDocument['type']) => {
    switch (type) {
      case 'Spreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-[#3D7A5A]" />;
      case 'CSV Data':
        return <FileCode className="w-5 h-5 text-[#C4842E]" />;
      case 'PDF Document':
      default:
        return <FileText className="w-5 h-5 text-[#C86D51]" />;
    }
  };

  return (
    <div id="files-screen-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#232220]">Documents & Intelligence</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0EAE1] text-[#7A5043]">
              {files.length} indexed
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Ingest contracts, demand forecasts, and telemetry CSVs for Miley automated grounding.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label
            id="upload-file-label-btn"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold shadow-2xs transition-all hover:shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Document</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUploadSim(file.name);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        id="file-drop-zone"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) {
            handleFileUploadSim(file.name);
          } else {
            handleFileUploadSim('Uploaded_Logistics_Report.pdf');
          }
        }}
        onClick={() => handleFileUploadSim(`Monsoon_Logistics_Telemetry_${Math.floor(10 + Math.random() * 89)}.pdf`)}
        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? 'border-[#C86D51] bg-[#FAECE8]/50'
            : isUploading
            ? 'border-[#C86D51] bg-[#FDF9F6]'
            : 'border-[#DFD8CC] bg-[#FAF8F5] hover:border-[#C86D51]/60 hover:bg-[#FAF6F0]'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-[#EFEBE3] text-[#C86D51] flex items-center justify-center">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-[#232220]">
            {isUploading ? 'Miley is analyzing document...' : 'Click to upload or drag & drop files here'}
          </p>
          <p className="text-[11px] text-[#7A756D] mt-0.5">
            Supports PDF, XLSX, CSV, DOCX (up to 25 MB). Instantly summarized by Miley.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Document List vs Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Files (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          {files.map((file) => {
            const isSelected = activeFile?.id === file.id;
            return (
              <div
                key={file.id}
                id={`file-card-${file.id}`}
                onClick={() => setActiveFile(file)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-white border-[#C86D51] shadow-xs'
                    : 'bg-[#FAF8F5] border-[#EBE6DC] hover:bg-white hover:border-[#DFD7CB]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FAF6F0] border border-[#EBE3D8] flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[#232220] truncate">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#7A756D]">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF2ED] text-[#3D7A5A] border border-[#CDE3D5] flex-shrink-0">
                    {file.status}
                  </span>
                </div>

                <p className="text-[11px] text-[#6A665E] line-clamp-2 leading-relaxed">
                  {file.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Ingested File Intelligence (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs p-6 space-y-5">
          {activeFile ? (
            <>
              {/* Document Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#F2ECE2] pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D8]">
                    {getFileIcon(activeFile.type)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#232220]">{activeFile.name}</h2>
                    <div className="flex items-center gap-2 text-xs text-[#7A756D] mt-0.5">
                      <span>{activeFile.type}</span>
                      <span>•</span>
                      <span>{activeFile.size}</span>
                      <span>•</span>
                      <span>Uploaded {activeFile.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id="delete-file-btn"
                    onClick={() => {
                      deleteFile(activeFile.id);
                      setActiveFile(files.find((f) => f.id !== activeFile.id) || null);
                    }}
                    className="p-1.5 text-[#9C968B] hover:text-[#C86D51] hover:bg-[#FAECE8] rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Extracted Metrics Grid */}
              {activeFile.extractedMetrics && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#7A756D] uppercase tracking-wider">
                    Extracted Key Metrics
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(activeFile.extractedMetrics).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EBE6DC] space-y-0.5"
                      >
                        <div className="text-[10px] text-[#7A756D] font-medium truncate">{key}</div>
                        <div className="text-sm font-bold text-[#232220]">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Executive Summary */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#7A756D] uppercase tracking-wider">
                  Miley Document Summary
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC] text-xs text-[#33302B] leading-relaxed">
                  {activeFile.summary}
                </div>
              </div>

              {/* Key Insights List */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#7A756D] uppercase tracking-wider">
                  Key Strategic Insights
                </div>
                <div className="space-y-2">
                  {activeFile.keyInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-[#33302B] leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7A5A] flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ground AI Chat Action */}
              <div className="pt-4 border-t border-[#F2ECE2] flex items-center justify-between">
                <span className="text-xs text-[#7A756D] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
                  <span>Grounds all future assistant replies</span>
                </span>

                <button
                  id="ground-chat-with-file-btn"
                  onClick={() => setCurrentPage('ai-assistant')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
                >
                  <span>Chat with Document</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
              <FileCheck className="w-8 h-8 text-[#A09A8F]" />
              <p className="text-sm font-bold text-[#232220]">No document selected</p>
              <p className="text-xs text-[#7A756D]">Upload or select a file to view automated intelligence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
