'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { jobRequisitionAPI, applicantAPI, interviewAPI, offerLetterAPI } from '@/lib/recruitment/api';
import {
  Briefcase,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export default function RecruitmentDashboardPage() {
  const [stats, setStats] = useState({
    openJobs: 0,
    totalApplicants: 0,
    scheduledInterviews: 0,
    pendingOffers: 0,
    hirings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [jobs, applicants, interviews, offers] = await Promise.all([
        jobRequisitionAPI.getAll(),
        applicantAPI.getAll(),
        interviewAPI.getAll(),
        offerLetterAPI.getAll(),
      ]);

      setStats({
        openJobs: jobs.filter((j) => j.status === 'open').length,
        totalApplicants: applicants.length,
        scheduledInterviews: interviews.filter((i) => i.status === 'scheduled').length,
        pendingOffers: offers.filter((o) => o.status === 'sent').length,
        hirings: applicants.filter((a) => a.status === 'hired').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recruitment & Onboarding</h1>
        <p className="text-gray-600 mt-2">
          Streamline your hiring process from job posting to onboarding
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Positions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.openJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalApplicants}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.scheduledInterviews}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Offers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOffers}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Hired</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.hirings}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Job Requisitions */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Job Requisitions</h3>
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Create and manage job requisitions with approval workflows
          </p>
          <ul className="space-y-2 mb-6 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Create job postings
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Approval workflow
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Track hiring status
            </li>
          </ul>
          <Link href="/recruitment/jobs">
            <Button className="w-full gap-2">
              Manage Jobs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        {/* Applicant Tracking */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Applicant Tracking</h3>
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm mb-6">
            ATS system with resume parsing and candidate scoring
          </p>
          <ul className="space-y-2 mb-6 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Resume parsing & scoring
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Candidate management
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Pipeline tracking
            </li>
          </ul>
          <Link href="/recruitment/applicants">
            <Button className="w-full gap-2">
              View Applicants
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        {/* Interview Scheduling */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Interview Scheduling</h3>
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Schedule interviews and collect structured feedback
          </p>
          <ul className="space-y-2 mb-6 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Schedule interviews
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Video/Phone/In-person
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Feedback collection
            </li>
          </ul>
          <Link href="/recruitment/interviews">
            <Button className="w-full gap-2">
              Manage Interviews
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        {/* Offer Letters & Onboarding */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Onboarding</h3>
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Generate offers and manage digital onboarding
          </p>
          <ul className="space-y-2 mb-6 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
              Generate offer letters
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
              Checklist management
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
              Document verification
            </li>
          </ul>
          <Link href="/recruitment/onboarding">
            <Button className="w-full gap-2">
              Manage Onboarding
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/recruitment/jobs/create">
            <Button variant="outline">Create Job Requisition</Button>
          </Link>
          <Link href="/recruitment/applicants">
            <Button variant="outline">View All Applicants</Button>
          </Link>
          <Link href="/recruitment/interviews">
            <Button variant="outline">Schedule Interview</Button>
          </Link>
          <Link href="/recruitment/onboarding">
            <Button variant="outline">Manage Onboarding</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
