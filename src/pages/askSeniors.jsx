// import AppLayout from "@/components/layout";

// export default function AskSeniorsPage() {
//   return (
//     <AppLayout>
//       <div className="flex justify-center items-center h-full">
//         <h1>Ask Seniors</h1>
//       </div>
//     </AppLayout>
//   );
// }

import React from 'react';
import AppLayout from '@/components/layout'; // Import your AppLayout
import { Input } from '@/components/ui/input'; // Import shadcn Input
import { Button } from '@/components/ui/button'; // Import shadcn Button
import { Card, CardContent } from '@/components/ui/card'; // Import shadcn Card
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import shadcn Avatar
import {
  Search,
  Plus,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  UserCircle, // Keep this if Avatar doesn't provide a default icon
} from 'lucide-react';

// --- Mock Data for Posts (same as before) ---
const mockPosts = [
  {
    id: 1,
    user: {
      name: 'UmarAhmed_23',
      avatar: null, // We'll use AvatarFallback or UserCircle
    },
    timestamp: 'Published 2 hours ago',
    title: 'How to prepare for the CS202 midterm?',
    content:
      'Hi Seniors! I\'m a second-year BSCS student and I have CS202 Data Structures midterm next week. Can someone guide me on which topics are most important and how to prepare? Are Sir Nadeem\'s past papers enough?',
    upvotes: 27,
    comments: 12,
  },
  {
    id: 2,
    user: {
      name: 'Maryam.BSCS_4th',
      avatar: null,
    },
    timestamp: 'Published 4 hours ago',
    title: 'Which elective should I take in Semester 6?',
    content:
      "I have the option to choose between AI, Cloud Computing, and IoT next semester. I'm interested in freelancing and want a course that also helps with that. Any recommendations?",
    upvotes: 27,
    comments: 12,
  },
  {
    id: 3,
    user: {
      name: 'Ali Ishaq',
      avatar: null,
    },
    timestamp: 'Published 5 hours ago',
    title: 'Where can I find JavaFX tutorials for the project?',
    content:
      "I'm working on a library management system in JavaFX. Can someone share a reliable source or any recorded KU lectures?",
    upvotes: 27,
    comments: 12,
  },
];

// --- "What do you want to ask?" Component ---
// Using shadcn components where appropriate
const PostInput = () => (
  <Card className="bg-green-50 border border-green-200 shadow-sm p-4 rounded-lg">
    <CardContent className="p-0"> {/* Remove default CardContent padding */}
        <div className="flex items-center mb-3">
             {/* Using shadcn Avatar */}
            <Avatar className="w-10 h-10 mr-3">
                 {/* <AvatarImage src="/path/to/user-avatar.png" alt="User Avatar" /> */}
                <AvatarFallback className="bg-gray-300 text-gray-600">
                    <UserCircle className="w-6 h-6" /> {/* Or generate initials */}
                </AvatarFallback>
            </Avatar>
          <Input
            type="text"
            placeholder="What do you want to ask or share?"
            className="
              flex-1 bg-transparent border-0 text-gray-700
              placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0
              shadow-none pl-0 h-auto py-0 text-base
            "
          />
        </div>
        <div className="flex justify-start space-x-3 mt-4 pl-13"> {/* Add padding to align buttons */}
          <Button size="sm" className="bg-green-600 hover:bg-green-700">Ask</Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">Answer</Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">Post</Button>
        </div>
    </CardContent>
  </Card>
);

// --- Single Post Component ---
// Using shadcn components
const Post = ({ post }) => (
  <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
    <CardContent className="p-5"> {/* Use CardContent padding */}
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
            <Avatar className="w-10 h-10 mr-3">
                {/* <AvatarImage src={post.user.avatar} alt={post.user.name} /> */}
                <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                 {/* You could generate initials here */}
                 <UserCircle className="w-6 h-6" />
                </AvatarFallback>
            </Avatar>
          <div>
            <span className="font-semibold text-green-700 text-sm block">
              {post.user.name}
            </span>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 w-8 h-8">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Post Body */}
      <div className="ml-13"> {/* Keep margin-left if needed */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Post Actions */}
      <div className="flex items-center space-x-6 ml-13 mt-4 pt-3 border-t border-gray-100">
        <Button variant="ghost" className="flex items-center text-gray-500 hover:text-green-600 text-sm font-medium h-auto px-2 py-1">
          <ThumbsUp className="w-4 h-4 mr-1.5" />
          {post.upvotes}
        </Button>
        <Button variant="ghost" className="flex items-center text-gray-500 hover:text-green-600 text-sm font-medium h-auto px-2 py-1">
          <MessageCircle className="w-4 h-4 mr-1.5" />
          {post.comments}
        </Button>
      </div>
    </CardContent>
  </Card>
);


// --- AskSeniorsPage Component ---
export default function AskSeniorsPage() {
  return (
    <AppLayout>
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-gray-50"> {/* Changed background */}

          {/* Search Bar - You might integrate this into AppLayout's header later */}
          <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search Your Question"
                          className="
                              w-full px-5 py-3 rounded-full
                              bg-green-50 border border-green-200
                              text-green-900 placeholder-green-700
                              focus:ring-2 focus:ring-green-400 focus-visible:ring-offset-0
                            "
                        />
                        <Search
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-700 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 ml-6">
                      <Button
                        className="
                          flex items-center bg-green-600 text-white
                          px-5 py-2.5 rounded-full font-semibold
                          hover:bg-green-700 transition-colors h-auto
                        "
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add a Question
                      </Button>
                      {/* Bell icon might be in AppLayout header already */}
                      {/* <Button
                        variant="ghost" size="icon"
                        className="text-gray-500 hover:text-green-600 w-8 h-8"
                        aria-label="Notifications"
                      >
                        <Bell className="w-6 h-6" />
                      </Button> */}
                    </div>
              </div>
          </div>

          {/* Feed container */}
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            <PostInput />

            {/* Post Feed */}
            <div className="space-y-5">
              {mockPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          </div>
      </main>
    </AppLayout>
  );
}
