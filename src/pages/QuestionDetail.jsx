import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionsService } from '../services/questions';
import { answersService } from '../services/answers';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from '../components/forms/RichTextEditor';
import AnswerCard from '../components/common/AnswerCard';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Edit,
  ArrowLeft,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      setLoading(true);
      const [questionData, answersData] = await Promise.all([
        questionsService.getQuestion(id),
        answersService.getAnswersByQuestion(id)
      ]);
      
      setQuestion(questionData);
      setAnswers(answersData);
    } catch (error) {
      console.error('Failed to fetch question:', error);
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!answerContent.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setIsSubmittingAnswer(true);

    try {
      const newAnswer = await answersService.createAnswer({
        question_id: id,
        description: answerContent
      });
      
      // Add user info to the new answer for display
      const answerWithUser = {
        ...newAnswer,
        username: user.username,
        user_email: user.email
      };
      
      setAnswers([...answers, answerWithUser]);
      setAnswerContent('');
      toast.success('Answer posted successfully!');
    } catch (error) {
      console.error('Failed to post answer:', error);
      const message = error.response?.data?.detail || 'Failed to post answer';
      toast.error(message);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleAcceptAnswer = (answerId) => {
    setAnswers(answers.map(answer => ({
      ...answer,
      is_accepted: answer.id === answerId
    })));
    setQuestion({
      ...question,
      accepted_answer_id: answerId
    });
  };

  const handleDeleteAnswer = (answerId) => {
    setAnswers(answers.filter(answer => answer.id !== answerId));
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
        <Link to="/questions">
          <Button>Back to Questions</Button>
        </Link>
      </div>
    );
  }

  const isQuestionOwner = user?.id === question.user_id;
  const hasAcceptedAnswer = !!question.accepted_answer_id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/questions">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
      </Link>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{question.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Asked {formatTimeAgo(question.created_at)}</span>
                </div>
                <span>by {question.username}</span>
                {hasAcceptedAnswer && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Solved</span>
                  </div>
                )}
              </div>
            </div>
            {isQuestionOwner && (
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags?.map((tag) => (
              <Link key={tag} to={`/tags/${tag}`}>
                <Badge variant="secondary" className="hover:bg-primary hover:text-white cursor-pointer">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {/* Answers List */}
        {answers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No answers yet</h3>
              <p className="text-gray-600 mb-4">Be the first to answer this question!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Sort accepted answer first */}
            {answers
              .sort((a, b) => {
                if (a.is_accepted && !b.is_accepted) return -1;
                if (!a.is_accepted && b.is_accepted) return 1;
                return 0;
              })
              .map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  isQuestionOwner={isQuestionOwner}
                  hasAcceptedAnswer={hasAcceptedAnswer}
                  onAccept={handleAcceptAnswer}
                  onDelete={handleDeleteAnswer}
                />
              ))
            }
          </div>
        )}
      </div>

      {/* Answer Form */}
      {isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <RichTextEditor
                content={answerContent}
                onChange={setAnswerContent}
                placeholder="Write your answer here..."
              />
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmittingAnswer || !answerContent.trim()}
                >
                  {isSubmittingAnswer ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Post Answer
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Please log in to post an answer.</p>
            <Link to="/login">
              <Button>Login to Answer</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionDetail;

