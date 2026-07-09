'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { OnboardingChecklistView } from '@/components/recruitment/onboarding/OnboardingChecklistView';
import { DocumentUploadSection } from '@/components/recruitment/onboarding/DocumentUploadSection';
import { onboardingAPI, onboardingDocumentAPI } from '@/lib/recruitment/api';

export default function OnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const checklistId = params.id as string;

  const [checklist, setChecklist] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadChecklistData();
  }, [checklistId]);

  const loadChecklistData = async () => {
    try {
      setIsLoading(true);
      const checklistData = await onboardingAPI.getById(checklistId);
      setChecklist(checklistData);

      const docsData = await onboardingDocumentAPI.getAll(checklistData.employeeId);
      setDocuments(docsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load onboarding details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = async (item: any) => {
    try {
      await onboardingAPI.updateItemStatus(checklistId, item.id, item.status);
      loadChecklistData();
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleAddItem = async (newItem: any) => {
    try {
      await onboardingAPI.addItem(checklistId, newItem);
      loadChecklistData();
    } catch (err) {
      alert('Failed to add item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Remove this item?')) {
      try {
        await onboardingAPI.removeItem(checklistId, itemId);
        loadChecklistData();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const handleUploadDocument = async (file: File, documentType: string) => {
    if (!checklist) return;

    try {
      setIsUploading(true);
      await onboardingDocumentAPI.upload(checklist.employeeId, file, documentType);
      loadChecklistData();
    } catch (err: any) {
      alert('Failed to upload document: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      await onboardingDocumentAPI.verify(documentId);
      loadChecklistData();
    } catch (err) {
      alert('Failed to verify document');
    }
  };

  const handleRejectDocument = async (documentId: string, reason: string) => {
    try {
      await onboardingDocumentAPI.reject(documentId, reason);
      loadChecklistData();
    } catch (err) {
      alert('Failed to reject document');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm('Delete this document?')) {
      try {
        await onboardingDocumentAPI.delete(documentId);
        loadChecklistData();
      } catch (err) {
        alert('Failed to delete document');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !checklist) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error || 'Onboarding not found'}</p>
        </Card>
      </div>
    );
  }

  const completedItems = checklist.items?.filter((i: any) => i.status === 'completed').length || 0;
  const totalItems = checklist.items?.length || 0;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">{checklist.employeeName}</h1>
          <p className="text-gray-600 mt-1">{checklist.employeeEmail}</p>
        </div>

        {completionPercentage === 100 && (
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">Onboarding Complete</span>
            </div>
          </div>
        )}
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Department</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">{checklist.department}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Start Date</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {new Date(checklist.startDate).toLocaleDateString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Progress</p>
          <p className="text-lg font-semibold text-blue-600 mt-1">{completionPercentage}%</p>
        </Card>
      </div>

      {/* Warning if incomplete */}
      {completionPercentage < 100 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Onboarding Pending</h3>
              <p className="text-sm text-yellow-800 mt-1">
                {totalItems - completedItems} out of {totalItems} tasks pending completion
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
          Checklist
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Documents</button>
      </div>

      {/* Onboarding Checklist Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Onboarding Checklist</h2>
        <OnboardingChecklistView
          items={checklist.items || []}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onAddItem={handleAddItem}
          isEditable={true}
        />
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Documents & Verification</h2>
        <DocumentUploadSection
          documents={documents}
          onUpload={handleUploadDocument}
          onVerify={handleVerifyDocument}
          onReject={handleRejectDocument}
          onDelete={handleDeleteDocument}
          isAdmin={true}
          isLoading={isUploading}
        />
      </div>

      {/* Complete Onboarding Button */}
      {completionPercentage === 100 && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              if (confirm('Mark onboarding as complete?')) {
                onboardingAPI.complete(checklistId).then(() => loadChecklistData());
              }
            }}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            Complete Onboarding
          </Button>
        </div>
      )}
    </div>
  );
}
