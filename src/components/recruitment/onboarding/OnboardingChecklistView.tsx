'use client';

import { OnboardingItem, OnboardingStep } from '@/lib/recruitment/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface OnboardingChecklistProps {
  items: OnboardingItem[];
  onUpdateItem?: (item: OnboardingItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onAddItem?: (item: any) => void;
  isEditable?: boolean;
}

const CategoryColors = {
  it_setup: 'bg-blue-100 text-blue-800',
  compliance: 'bg-red-100 text-red-800',
  training: 'bg-green-100 text-green-800',
  paperwork: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};

const StatusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  skipped: AlertCircle,
};

export function OnboardingChecklistView({
  items,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  isEditable = false,
}: OnboardingChecklistProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<any>({
    title: '',
    description: '',
    category: 'other',
    dueDate: '',
    assignedTo: '',
  });

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const completionPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleAddItem = () => {
    if (newItem.title && newItem.dueDate) {
      onAddItem?.(newItem);
      setNewItem({
        title: '',
        description: '',
        category: 'other',
        dueDate: '',
        assignedTo: '',
      });
      setShowAddForm(false);
    }
  };

  const handleStatusChange = (item: OnboardingItem, newStatus: OnboardingStep) => {
    onUpdateItem?.({
      ...item,
      status: newStatus,
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">Onboarding Progress</h3>
          <span className="text-lg font-bold text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {completedCount} of {items.length} tasks completed
        </p>
      </Card>

      {/* Add New Item Form */}
      {isEditable && showAddForm && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="space-y-3">
            <Input
              placeholder="Task title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={2}
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="it_setup">IT Setup</option>
                <option value="compliance">Compliance</option>
                <option value="training">Training</option>
                <option value="paperwork">Paperwork</option>
                <option value="other">Other</option>
              </select>
              <Input
                type="date"
                value={newItem.dueDate}
                onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
              />
              <Input
                placeholder="Assigned to"
                value={newItem.assignedTo}
                onChange={(e) => setNewItem({ ...newItem, assignedTo: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddItem}>
                <Plus className="w-3 h-3 mr-1" />
                Add Task
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isEditable && !showAddForm && (
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Checklist Item
        </Button>
      )}

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const StatusIcon = StatusIcons[item.status];
          const isExpanded = expandedItems.includes(item.id);

          return (
            <Card
              key={item.id}
              className={`p-4 ${
                item.status === 'completed' ? 'bg-green-50 border-green-200' : ''
              } ${item.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : ''}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 flex gap-3">
                  <div
                    className={`mt-1 p-2 rounded ${
                      item.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                    }`}
                  >
                    <StatusIcon
                      className={`w-5 h-5 ${
                        item.status === 'completed'
                          ? 'text-green-700'
                          : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-semibold ${
                          item.status === 'completed'
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          CategoryColors[
                            item.category as keyof typeof CategoryColors
                          ]
                        }`}
                      >
                        {item.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                      {item.assignedTo && <span>Assigned to: {item.assignedTo}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditable && item.status !== 'completed' && (
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item, e.target.value as OnboardingStep)
                      }
                      className="text-sm px-2 py-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="skipped">Skipped</option>
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1 rounded hover:bg-black/5"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {item.description && (
                    <div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  )}

                  {item.comments && (
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      <p className="font-medium text-blue-900">Comments:</p>
                      <p className="text-blue-800 mt-1">{item.comments}</p>
                    </div>
                  )}

                  {isEditable && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteItem?.(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
