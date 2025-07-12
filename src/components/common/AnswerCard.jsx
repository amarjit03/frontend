import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { answersService } from '../../services/answers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VoteButtons from './VoteButtons';
import { 
  CheckCircle, 
  Edit, 
  Trash2, 
  MessageSquare,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const AnswerCard = ({ 
  answer, 
  isQuestionOwner, 
  hasAcceptedAnswer, 
  onAccept, 
  onUpdate, 
  onDelete 
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isAnswerOwner = user?.id === answer.user_id;
  const canAccept = isQuestionOwner && !hasAcceptedAnswer && !answer.is_accepted;

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleAccept = async () => {
    try {
      await answersService.acceptAnswer(answer.id);
      onAccept(answer.id);
      toast.success('Answer accepted!');
    } catch (error) {
      console.error('Failed to accept answer:', error);
      toast.error('Failed to accept answer');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    try {
      await answersService.deleteAnswer(answer.id);
      onDelete(answer.id);
      toast.success('Answer deleted');
    } catch (error) {
      console.error('Failed to delete answer:', error);
      toast.error('Failed to delete answer');
    }
  };

  return (
    <Card className={`${answer.is_accepted ? 'border-green-500 bg-green-50' : ''}`}>
      <CardContent className="p-6">
        {/* Accepted Answer Badge */}
        {answer.is_accepted && (
          <div className="flex items-center text-green-600 mb-4">
            <CheckCircle className="h-5 w-5 mr-2" />
            <Badge variant="outline" className="border-green-500 text-green-600">
              Accepted Answer
            </Badge>
          </div>
        )}

        <div className="flex space-x-4">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons 
              answerId={answer.id}
              initialVoteScore={answer.vote_score || 0}
            />
          </div>

          {/* Answer Content */}
          <div className="flex-1">
            <div 
              className="prose max-w-none mb-4"
              dangerouslySetInnerHTML={{ __html: answer.description }}
            />

            {/* Answer Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Clock className="h-4 w-4" />
                <span>Answered {formatTimeAgo(answer.created_at)}</span>
                <span>•</span>
                <span>by {answer.username}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {canAccept && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAccept}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Comments
                </Button>

                {isAnswerOwner && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-2">Comments</div>
                <div className="space-y-2">
                  {/* Comments will be implemented in the next phase */}
                  <p className="text-sm text-gray-500 italic">
                    Comments feature coming soon...
                  </p>
                </div>
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-2">Edit Answer</div>
                <p className="text-sm text-gray-500 italic">
                  Edit functionality coming soon...
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerCard;

