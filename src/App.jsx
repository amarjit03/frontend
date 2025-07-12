import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">StackIt</span>
              </div>
              <nav className="flex space-x-4">
                <a href="/questions" className="text-gray-600 hover:text-gray-900">Questions</a>
                <a href="/tags" className="text-gray-600 hover:text-gray-900">Tags</a>
                <a href="/mcq" className="text-gray-600 hover:text-gray-900">MCQ Quiz</a>
                <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to StackIt
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  A minimal Q&A forum platform for collaborative learning
                </p>
                <div className="space-x-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Ask a Question
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
                    Browse Questions
                  </button>
                </div>
              </div>
            } />
            <Route path="/questions" element={
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Questions</h1>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600">No questions yet. Be the first to ask!</p>
                </div>
              </div>
            } />
            <Route path="/login" element={
              <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h1>
                <div className="bg-white rounded-lg shadow p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input 
                        type="password" 
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter your password"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            } />
            <Route path="*" element={
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

