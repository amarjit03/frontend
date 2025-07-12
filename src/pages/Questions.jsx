import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { questionsService } from '../services/questions';
import { tagsService } from '../services/tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Filter,
  Plus
} from 'lucide-react';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
    fetchQuestions();
  }, [searchParams, sortBy, selectedTags]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 20,
        skip: 0
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (selectedTags.length > 0) {
        params.tags = selectedTags;
      }

      const data = await questionsService.getQuestions(params);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
    fetchQuestions();
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

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-600 mt-1">
            {questions.length} questions found
          </p>
        </div>
        <Link to="/ask">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Sort Tabs */}
      <Tabs value={sortBy} onValueChange={setSortBy}>
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>

        <TabsContent value={sortBy} className="mt-6">
          {/* Questions List */}
          <div className="space-y-4">
            {questions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                    <p className="mb-4">
                      {searchQuery 
                        ? `No questions match your search for "${searchQuery}"`
                        : "Be the first to ask a question!"
                      }
                    </p>
                    <Link to="/ask">
                      <Button>Ask the First Question</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              questions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link 
                          to={`/questions/${question.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-primary"
                        >
                          {question.title}
                        </Link>
                        
                        <p className="text-gray-600 mt-2 line-clamp-3">
                          {question.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {question.tags?.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => {
                                if (!selectedTags.includes(tag)) {
                                  setSelectedTags([...selectedTags, tag]);
                                }
                              }}
                            >
                              <Badge variant="secondary" className="text-xs hover:bg-primary hover:text-white cursor-pointer">
                                {tag}
                              </Badge>
                            </button>
                          ))}
                        </div>

                        {/* Author and Time */}
                        <div className="flex items-center mt-4 text-sm text-gray-500">
                          <span>Asked {formatTimeAgo(question.created_at)}</span>
                          {question.username && (
                            <>
                              <span className="mx-2">•</span>
                              <span>by {question.username}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col items-end text-sm text-gray-500 ml-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{question.answer_count || 0}</span>
                          </div>
                          {question.accepted_answer_id && (
                            <CheckCircle className="h-5 w-5 text-green-500" title="Has accepted answer" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Load More */}
      {questions.length >= 20 && (
        <div className="text-center">
          <Button variant="outline">Load More Questions</Button>
        </div>
      )}
    </div>
  );
};

export default Questions;

