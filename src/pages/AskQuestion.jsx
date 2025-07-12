import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsService } from '../services/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from '../components/forms/RichTextEditor';
import TagInput from '../components/forms/TagInput';
import { HelpCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Please add at least one tag';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const question = await questionsService.createQuestion(formData);
      toast.success('Question posted successfully!');
      navigate(`/questions/${question.id}`);
    } catch (error) {
      console.error('Failed to create question:', error);
      const message = error.response?.data?.detail || 'Failed to post question';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
        <p className="text-gray-600">
          Get help from the community by asking a clear, detailed question.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
              <CardDescription>
                Provide clear and specific information to get the best answers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="What's your programming question? Be specific."
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formData.title.length}/200 characters
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <RichTextEditor
                    content={formData.description}
                    onChange={(content) => handleChange('description', content)}
                    placeholder="Describe your problem in detail. Include what you've tried and what you expected to happen."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">
                    Tags <span className="text-red-500">*</span>
                  </Label>
                  <TagInput
                    tags={formData.tags}
                    onChange={(tags) => handleChange('tags', tags)}
                    placeholder="Add relevant tags (e.g., javascript, react, api)"
                  />
                  {errors.tags && (
                    <p className="text-sm text-red-500">{errors.tags}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Post Question
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Title</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be specific and descriptive</li>
                  <li>• Include key technologies</li>
                  <li>• Avoid vague terms like "doesn't work"</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Description</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Explain what you're trying to achieve</li>
                  <li>• Show what you've tried</li>
                  <li>• Include relevant code snippets</li>
                  <li>• Describe the expected vs actual behavior</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Tags</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use existing tags when possible</li>
                  <li>• Include programming languages</li>
                  <li>• Add framework/library names</li>
                  <li>• Maximum 5 tags recommended</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Search for existing questions first</li>
                <li>• Be respectful and professional</li>
                <li>• Provide minimal reproducible examples</li>
                <li>• Accept helpful answers</li>
                <li>• Update your question if needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;

