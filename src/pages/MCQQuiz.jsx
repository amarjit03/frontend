import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mcqService } from '../services/mcq';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Trophy, 
  Clock, 
  Target,
  TrendingUp,
  Play,
  BarChart3
} from 'lucide-react';

const MCQQuiz = () => {
  const [topics, setTopics] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [topicStats, setTopicStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsData, quizzesData] = await Promise.all([
        mcqService.getAvailableTopics(),
        mcqService.getMyQuizzes({ limit: 10 })
      ]);
      
      setTopics(topicsData);
      setMyQuizzes(quizzesData);

      // Fetch stats for each topic
      const statsPromises = topicsData.map(topic => 
        mcqService.getTopicStats(topic).catch(() => null)
      );
      const statsResults = await Promise.all(statsPromises);
      
      const statsMap = {};
      topicsData.forEach((topic, index) => {
        if (statsResults[index]) {
          statsMap[topic] = statsResults[index];
        }
      });
      setTopicStats(statsMap);
    } catch (error) {
      console.error('Failed to fetch MCQ data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTopicName = (topic) => {
    return topic.charAt(0).toUpperCase() + topic.slice(1).replace(/[-_]/g, ' ');
  };

  const getTopicIcon = (topic) => {
    const iconMap = {
      javascript: '🟨',
      python: '🐍',
      react: '⚛️',
      nodejs: '🟢',
      java: '☕',
      cpp: '🔧',
      html: '🌐',
      css: '🎨',
      sql: '🗄️',
      git: '📚'
    };
    return iconMap[topic.toLowerCase()] || '📝';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <Brain className="h-16 w-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          MCQ Quiz Challenge
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Test your knowledge with AI-generated multiple choice questions on various programming topics
        </p>
      </div>

      <Tabs defaultValue="topics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="topics">Available Topics</TabsTrigger>
          <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Available Topics */}
        <TabsContent value="topics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const stats = topicStats[topic];
              return (
                <Card key={topic} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTopicIcon(topic)}</span>
                      <div>
                        <CardTitle className="text-lg">{formatTopicName(topic)}</CardTitle>
                        <CardDescription>
                          {stats ? `${stats.total_quizzes} quizzes taken` : 'New topic'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {stats && (
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Best Score:</span>
                          <span className="font-semibold">{stats.best_score}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average:</span>
                          <span>{Math.round(stats.average_score)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate:</span>
                          <span>{Math.round(stats.completion_rate * 100)}%</span>
                        </div>
                      </div>
                    )}
                    
                    <Link to={`/mcq/quiz/${topic}`}>
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* My Quizzes */}
        <TabsContent value="my-quizzes">
          <div className="space-y-4">
            {myQuizzes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No quizzes taken yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start your first quiz to track your progress!
                  </p>
                  <Button onClick={() => document.querySelector('[value="topics"]').click()}>
                    Browse Topics
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getTopicIcon(quiz.topic)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {formatTopicName(quiz.topic)}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                            </div>
                            <span>•</span>
                            <span>{quiz.total_questions} questions</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant={quiz.completed ? "default" : "secondary"}
                            className={quiz.completed ? "bg-green-500" : ""}
                          >
                            {quiz.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        {quiz.completed && (
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round((quiz.score / quiz.total_questions) * 100)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {quiz.completed && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Score: {quiz.score}/{quiz.total_questions}</span>
                          <span>{Math.round((quiz.score / quiz.total_questions) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(quiz.score / quiz.total_questions) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topics.slice(0, 6).map((topic) => (
              <Card key={topic}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{getTopicIcon(topic)}</span>
                    <span>{formatTopicName(topic)}</span>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 mb-2">Top Performers</div>
                    {/* Placeholder for leaderboard data */}
                    <div className="space-y-2">
                      {[1, 2, 3].map((rank) => (
                        <div key={rank} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                              {rank}
                            </Badge>
                            <span className="text-sm">Loading...</span>
                          </div>
                          <span className="text-sm font-semibold">--%</span>
                        </div>
                      ))}
                    </div>
                    <Link to={`/mcq/leaderboard/${topic}`}>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Full Leaderboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MCQQuiz;

