import React, { useState, useEffect } from 'react';
import { votesService } from '../../services/votes';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const VoteButtons = ({ answerId, initialVoteScore = 0, onVoteChange }) => {
  const { isAuthenticated } = useAuth();
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [userVote, setUserVote] = useState(0); // -1, 0, or 1
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && answerId) {
      fetchUserVote();
      fetchVoteStats();
    }
  }, [answerId, isAuthenticated]);

  const fetchUserVote = async () => {
    try {
      const vote = await votesService.getMyVote(answerId);
      setUserVote(vote?.value || 0);
    } catch (error) {
      console.error('Failed to fetch user vote:', error);
    }
  };

  const fetchVoteStats = async () => {
    try {
      const stats = await votesService.getVoteStats(answerId);
      setVoteScore(stats.total_score);
      setUserVote(stats.user_vote || 0);
    } catch (error) {
      console.error('Failed to fetch vote stats:', error);
    }
  };

  const handleVote = async (value) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      if (userVote === value) {
        // Remove vote if clicking the same button
        await votesService.removeVote(answerId);
        setUserVote(0);
        setVoteScore(voteScore - value);
      } else {
        // Add or change vote
        await votesService.voteAnswer({
          answer_id: answerId,
          value: value
        });
        
        const oldVote = userVote;
        setUserVote(value);
        setVoteScore(voteScore - oldVote + value);
      }

      if (onVoteChange) {
        onVoteChange(voteScore);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      const message = error.response?.data?.detail || 'Failed to vote';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`p-1 h-8 w-8 ${
          userVote === 1 
            ? 'text-green-600 bg-green-50 hover:bg-green-100' 
            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
        }`}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
      
      <span className={`text-sm font-semibold ${
        voteScore > 0 ? 'text-green-600' : 
        voteScore < 0 ? 'text-red-600' : 
        'text-gray-600'
      }`}>
        {voteScore}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`p-1 h-8 w-8 ${
          userVote === -1 
            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
        }`}
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VoteButtons;

