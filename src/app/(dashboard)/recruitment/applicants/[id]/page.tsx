'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { applicantAPI, interviewAPI, offerLetterAPI } from '@/lib/recruitment/api';
import { ApplicantStatusBadge } from '@/components/recruitment/applicants/ApplicantCard';
import { CandidateStatus } from '@/lib/recruitment/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Mail, Phone, FileText, Calendar, ExternalLink } from 'lucide-react';

const PIPELINE: { value: CandidateStatus; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'offer_extended', label: 'Offer Extended' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicantId = params.id as string;

  const [applicant, setApplicant] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Schedule interview dialog
  const [showSchedule, setShowSchedule] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    interviewType: 'video',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    meetingLink: '',
  });

  // Offer dialog
  const [showOffer, setShowOffer] = useState(false);
  const [offerForm, setOfferForm] = useState({
    salary: 0,
    startDate: '',
    reportingManager: '',
    expiryDate: '',
  });

  const loadApplicantDetails = async () => {
    try {
      setIsLoading(true);
      const [appData, interviewData, offerData] = await Promise.all([
        applicantAPI.getById(applicantId),
        interviewAPI.getByApplicant(applicantId),
        offerLetterAPI.getByApplicant(applicantId),
      ]);
      setApplicant(appData);
      setInterviews(interviewData);
      setOffers(offerData);
    } catch (err: any) {
      setError(err.message || 'Failed to load applicant details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplicantDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId]);

  const handleStatusChange = async (status: CandidateStatus) => {
    try {
      await applicantAPI.updateStatus(applicantId, status);
      loadApplicantDetails();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleScheduleInterview = async () => {
    try {
      await interviewAPI.schedule(applicantId, interviewForm);
      setShowSchedule(false);
      setInterviewForm({ interviewType: 'video', scheduledDate: '', scheduledTime: '', duration: 60, meetingLink: '' });
      loadApplicantDetails();
    } catch {
      alert('Failed to schedule interview');
    }
  };

  const handleGenerateOffer = async () => {
    try {
      await offerLetterAPI.generate(applicantId, offerForm);
      setShowOffer(false);
      setOfferForm({ salary: 0, startDate: '', reportingManager: '', expiryDate: '' });
      loadApplicantDetails();
    } catch {
      alert('Failed to generate offer');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !applicant) {
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
          <p className="text-red-600">{error || 'Applicant not found'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Pipeline actions */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-50">
            <Label className="text-xs text-gray-600">Move candidate to</Label>
            <select
              value={applicant.status}
              onChange={(e) => handleStatusChange(e.target.value as CandidateStatus)}
              className="mt-1 h-9 w-full max-w-xs rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              {PIPELINE.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSchedule(true)}>
              <Calendar className="w-4 h-4 mr-1.5" />
              Schedule Interview
            </Button>
            <Button onClick={() => setShowOffer(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <FileText className="w-4 h-4 mr-1.5" />
              Extend Offer
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {applicant.firstName} {applicant.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{applicant.jobTitle}</p>
          </div>
          <ApplicantStatusBadge status={applicant.status} />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
          <div>
            <a
              href={`mailto:${applicant.email}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Mail className="w-4 h-4" />
              {applicant.email}
            </a>
          </div>
          <div>
            <a
              href={`tel:${applicant.phone}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Phone className="w-4 h-4" />
              {applicant.phone}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-600">Applied on:</p>
            <p className="font-medium">
              {new Date(applicant.appliedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Experience</p>
            <p className="text-lg font-semibold">{applicant.yearsOfExperience} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Position</p>
            <p className="text-lg font-semibold">{applicant.currentPosition || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Resume Score</p>
            <p className="text-lg font-semibold text-blue-600">
              {typeof applicant.resume_score === 'number' ? `${applicant.resume_score}%` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Application Source</p>
            <p className="text-lg font-semibold capitalize">{(applicant.source || '').replace(/_/g, ' ')}</p>
          </div>
        </div>

        {/* Skills */}
        {applicant.skills && applicant.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume & Portfolio */}
        <div className="mt-6 pt-6 border-t flex gap-4">
          {applicant.resumeUrl && (
            <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <FileText className="w-4 h-4" />
                View Resume
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}
          {applicant.portfolioUrl && (
            <a href={applicant.portfolioUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Portfolio
              </Button>
            </a>
          )}
        </div>
      </Card>

      {/* Interviews */}
      {interviews.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interviews</h2>
          <div className="space-y-3">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/recruitment/interviews/${interview.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{interview.interviewType}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(interview.scheduledDate).toLocaleDateString()} at{' '}
                      {interview.scheduledTime}
                    </p>
                  </div>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {interview.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Offers */}
      {offers.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Offer Letters</h2>
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{offer.position}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {offer.currency} {offer.salary.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      offer.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : offer.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Schedule Interview Dialog */}
      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <select
                value={interviewForm.interviewType}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewType: e.target.value })}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <option value="video">Video</option>
                <option value="phone">Phone</option>
                <option value="in-person">In-person</option>
                <option value="group">Group</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={interviewForm.scheduledDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={interviewForm.scheduledTime}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Meeting Link (optional)</Label>
              <Input
                value={interviewForm.meetingLink}
                onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                placeholder="https://meet.example.com/..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowSchedule(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleScheduleInterview}
                disabled={!interviewForm.scheduledDate || !interviewForm.scheduledTime}
              >
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Offer Dialog */}
      <Dialog open={showOffer} onOpenChange={setShowOffer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Extend Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Annual Salary (INR)</Label>
              <Input
                type="number"
                value={offerForm.salary || ''}
                onChange={(e) => setOfferForm({ ...offerForm, salary: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={offerForm.startDate}
                  onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Offer Expiry</Label>
                <Input
                  type="date"
                  value={offerForm.expiryDate}
                  onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Reporting Manager</Label>
              <Input
                value={offerForm.reportingManager}
                onChange={(e) => setOfferForm({ ...offerForm, reportingManager: e.target.value })}
                placeholder="Manager name"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowOffer(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateOffer} disabled={!offerForm.salary}>
                Generate Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
