'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { interviewAPI } from '@/lib/recruitment/api';
import { ArrowLeft, Calendar, Clock, Users, Video, CheckCircle } from 'lucide-react';

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reschedule form
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Feedback form
  const [feedback, setFeedback] = useState({
    overallRating: 3,
    technicalSkills: 3,
    communication: 3,
    cultureFit: 3,
    comments: '',
    recommendation: 'maybe',
  });

  const load = async () => {
    try {
      setIsLoading(true);
      const data = await interviewAPI.getById(interviewId);
      setInterview(data);
      setDate(data?.scheduledDate || '');
      setTime(data?.scheduledTime || '');
      if (data?.feedback) setFeedback({ ...feedback, ...data.feedback });
    } catch (err: any) {
      setError(err.message || 'Failed to load interview');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const handleReschedule = async () => {
    try {
      await interviewAPI.reschedule(interviewId, { scheduledDate: date, scheduledTime: time, status: 'scheduled' });
      load();
    } catch {
      alert('Failed to reschedule');
    }
  };

  const handleCancel = async () => {
    if (confirm('Cancel this interview?')) {
      try {
        await interviewAPI.cancel(interviewId, 'Cancelled by recruiter');
        load();
      } catch {
        alert('Failed to cancel');
      }
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      await interviewAPI.submitFeedback(interviewId, feedback as any);
      load();
    } catch {
      alert('Failed to submit feedback');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  if (error || !interview) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error || 'Interview not found'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Overview */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{interview.applicantName}</h1>
            <p className="text-gray-600 mt-1">{interview.jobTitle}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              interview.status === 'scheduled'
                ? 'bg-blue-100 text-blue-800'
                : interview.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : interview.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {interview.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            {new Date(interview.scheduledDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            {interview.scheduledTime} ({interview.duration} min)
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 capitalize">
            <Video className="w-4 h-4 text-gray-400" />
            {interview.interviewType}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="w-4 h-4 text-gray-400" />
            {interview.interviewers?.length || 0} interviewer(s)
          </div>
        </div>

        {interview.meetingLink && (
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Join Meeting →
          </a>
        )}
      </Card>

      {/* Reschedule */}
      {interview.status !== 'cancelled' && interview.status !== 'completed' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reschedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReschedule}>Update</Button>
              <Button variant="outline" className="text-red-600" onClick={handleCancel}>
                Cancel Interview
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {interview.feedback ? 'Feedback' : 'Submit Feedback'}
        </h2>

        {interview.feedback ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Metric label="Overall" value={interview.feedback.overallRating} />
              <Metric label="Technical" value={interview.feedback.technicalSkills} />
              <Metric label="Communication" value={interview.feedback.communication} />
              <Metric label="Culture Fit" value={interview.feedback.cultureFit} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recommendation</p>
              <p className="font-semibold capitalize">{interview.feedback.recommendation?.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Comments</p>
              <p className="text-gray-800">{interview.feedback.comments}</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium pt-2">
              <CheckCircle className="w-4 h-4" />
              Feedback recorded
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['overallRating', 'technicalSkills', 'communication', 'cultureFit'] as const).map((k) => (
                <div key={k}>
                  <Label className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</Label>
                  <select
                    value={feedback[k]}
                    onChange={(e) => setFeedback({ ...feedback, [k]: Number(e.target.value) })}
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <Label>Recommendation</Label>
              <select
                value={feedback.recommendation}
                onChange={(e) => setFeedback({ ...feedback, recommendation: e.target.value })}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <option value="strong_yes">Strong Yes</option>
                <option value="yes">Yes</option>
                <option value="maybe">Maybe</option>
                <option value="no">No</option>
                <option value="strong_no">Strong No</option>
              </select>
            </div>
            <div>
              <Label>Comments</Label>
              <Textarea
                value={feedback.comments}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                rows={4}
                placeholder="Share your assessment of the candidate..."
              />
            </div>
            <Button onClick={handleSubmitFeedback} className="bg-green-600 hover:bg-green-700">
              Submit Feedback
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-lg border border-gray-200 text-center">
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-blue-600">{value}/5</p>
    </div>
  );
}
