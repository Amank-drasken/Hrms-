'use client';

import { OnboardingDocument } from '@/lib/recruitment/types';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, Download } from 'lucide-react';

interface DocumentUploadProps {
  documents: OnboardingDocument[];
  onUpload?: (file: File, documentType: string) => void;
  onVerify?: (documentId: string) => void;
  onReject?: (documentId: string, reason: string) => void;
  onDelete?: (documentId: string) => void;
  isAdmin?: boolean;
  isLoading?: boolean;
}

const DocumentTypeLabels = {
  aadhar: 'Aadhar Card',
  pan: 'PAN Card',
  bank_details: 'Bank Details',
  offer_letter: 'Offer Letter',
  nda: 'NDA',
  contract: 'Employment Contract',
  other: 'Other',
};

const DocumentTypeIcons = {
  aadhar: '🪪',
  pan: '📋',
  bank_details: '🏦',
  offer_letter: '📄',
  nda: '⚖️',
  contract: '📝',
  other: '📎',
};

export function DocumentUploadSection({
  documents,
  onUpload,
  onVerify,
  onReject,
  onDelete,
  isAdmin = false,
  isLoading = false,
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState('other');
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload?.(file, selectedType);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-4 border-2 border-dashed">
        <div className="text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload required documents for onboarding verification
          </p>

          <div className="flex gap-2 justify-center mb-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {Object.entries(DocumentTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {isLoading ? 'Uploading...' : 'Choose File'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>

          <p className="text-xs text-gray-500">
            Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
          </p>
        </div>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h3>

          <div className="space-y-3">
            {documents.map((doc) => {
              const docTypeLabel =
                DocumentTypeLabels[doc.documentType as keyof typeof DocumentTypeLabels] ||
                'Document';
              const docTypeEmoji =
                DocumentTypeIcons[doc.documentType as keyof typeof DocumentTypeIcons];

              return (
                <div key={doc.id} className={`p-3 border rounded-lg ${getStatusColor(doc.verificationStatus)}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{docTypeEmoji}</span>
                      <div className="flex-1">
                        <p className="font-medium">{docTypeLabel}</p>
                        <p className="text-sm opacity-75">
                          {doc.documentName}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                        {doc.verificationStatus === 'verified' && doc.verifiedAt && (
                          <p className="text-xs opacity-60">
                            Verified: {new Date(doc.verifiedAt).toLocaleDateString()}
                          </p>
                        )}
                        {doc.verificationStatus === 'rejected' && doc.rejectionReason && (
                          <p className="text-xs mt-1 font-medium">
                            Reason: {doc.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.verificationStatus === 'verified' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {doc.verificationStatus === 'pending' && (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      {doc.verificationStatus === 'rejected' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}

                      <div className="flex gap-2">
                        {doc.fileUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        )}

                        {isAdmin && doc.verificationStatus === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => onVerify?.(doc.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRejectingDocId(doc.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete?.(doc.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {rejectingDocId === doc.id && (
                    <div className="mt-3 p-3 bg-black/10 rounded">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="w-full text-sm p-2 border rounded mb-2"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => {
                            onReject?.(doc.id, rejectReason);
                            setRejectingDocId(null);
                            setRejectReason('');
                          }}
                        >
                          Confirm Rejection
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRejectingDocId(null);
                            setRejectReason('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Required Documents Checklist */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Required Documents</h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-blue-900 flex items-center justify-center">
              {documents.some((d) => d.documentType === 'aadhar' && d.verificationStatus === 'verified') ? '✓' : ''}
            </span>
            Aadhar Card
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-blue-900 flex items-center justify-center">
              {documents.some((d) => d.documentType === 'pan' && d.verificationStatus === 'verified') ? '✓' : ''}
            </span>
            PAN Card
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-blue-900 flex items-center justify-center">
              {documents.some((d) => d.documentType === 'bank_details' && d.verificationStatus === 'verified') ? '✓' : ''}
            </span>
            Bank Details
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-blue-900 flex items-center justify-center">
              {documents.some((d) => d.documentType === 'nda' && d.verificationStatus === 'verified') ? '✓' : ''}
            </span>
            NDA
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-blue-900 flex items-center justify-center">
              {documents.some((d) => d.documentType === 'contract' && d.verificationStatus === 'verified') ? '✓' : ''}
            </span>
            Employment Contract
          </li>
        </ul>
      </Card>
    </div>
  );
}
