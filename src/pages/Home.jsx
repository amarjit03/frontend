import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionsService } from '../services/questions';
import { tagsService } from '../services/tags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Brain
} from 'lucide-react';

const Home = () => {
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalUsers: 0,
    totalAnswers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [questionsData, tagsData] = await Promise.all([
        questionsService.getQuestions({ limit: 5 }).catch(() => []),
        tagsService.getPopularTags({ limit: 10 }).catch(() => [])
      ]);
      
      setRecentQuestions(questionsData);
      setPopularTags(tagsData);
      
      // Mock stats for now
      setStats({
        totalQuestions: questionsData.length || 0,
        totalUsers: 150,
        totalAnswers: 300
      });
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="space-y-8 animate-fade-in">
        {/* Loading skeleton */}
        <div className="text-center py-16">
          <div className="loading-skeleton h-12 w-64 mx-auto mb-4 rounded"></div>
          <div className="loading-skeleton h-6 w-96 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="loading-skeleton h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Welcome to StackIt</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gradient">Knowledge Sharing</span>
            <br />
            Made Simple
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A minimal Q&A forum platform for collaborative learning and structured knowledge sharing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/ask">
              <Button size="lg" className="btn-primary px-8 py-3 text-lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                Ask a Question
              </Button>
            </Link>
            <Link to="/questions">
              <Button variant="outline" size="lg" className="btn-secondary px-8 py-3 text-lg">
                Browse Questions
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover text-center">
          <CardContent className="p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalQuestions}+</div>
            <div className="text-gray-600">Questions Asked</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover text-center">
          <CardContent className="p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}+</div>
            <div className="text-gray-600">Active Users</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover text-center">
          <CardContent className="p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalAnswers}+</div>
            <div className="text-gray-600">Answers Provided</div>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Questions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recent Questions</h2>
            <Link to="/questions">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentQuestions.length === 0 ? (
              <Card className="card-hover">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to ask a question!</p>
                  <Link to="/ask">
                    <Button>Ask the First Question</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              recentQuestions.map((question) => (
                <Card key={question.id} className="card-hover animate-slide-in">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link 
                          to={`/questions/${question.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {question.title}
                        </Link>
                        
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {question.description?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {question.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center mt-4 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTimeAgo(question.created_at)}</span>
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
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{question.answer_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Popular Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.length === 0 ? (
                  <p className="text-sm text-gray-500">No tags yet</p>
                ) : (
                  popularTags.map((tag) => (
                    <Link key={tag.name} to={`/tags/${tag.name}`}>
                      <Badge 
                        variant="secondary" 
                        className="hover:bg-blue-100 hover:text-blue-800 cursor-pointer transition-colors"
                      >
                        {tag.name}
                        <span className="ml-1 text-xs">({tag.question_count})</span>
                      </Badge>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/ask" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
              </Link>
              
              <Link to="/mcq" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="h-4 w-4 mr-2" />
                  Take MCQ Quiz
                </Button>
              </Link>
              
              <Link to="/questions" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Browse Questions
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Be respectful and professional</li>
                <li>• Search before asking</li>
                <li>• Provide clear, detailed questions</li>
                <li>• Accept helpful answers</li>
                <li>• Help others when you can</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;

