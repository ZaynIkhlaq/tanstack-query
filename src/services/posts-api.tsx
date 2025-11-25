// This file contains functions that fetch data from an API
// We'll use JSONPlaceholder, a free fake REST API for testing

// Define the shape of a Post object
// JSONPlaceholder posts have: id, title, body, and userId

// this is the same form in which we get the data
export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// Define the shape of a Post when creating a new one
// Note: We don't include 'id' because the server generates it for us
export interface CreatePost {
  title: string
  body: string
  userId: number
}

// Fetch posts from the API with pagination
// GET request - retrieves data without modifying anything
// page: which page to fetch (starts at 1)
// limit: how many posts per page (default: 5)
export const fetchPosts = async (page: number = 1, limit: number = 5): Promise<Post[]> => {
  // Calculate the start index for pagination
  // Page 1: start at 0, Page 2: start at 5, Page 3: start at 10, etc.
  const start = (page - 1) * limit
  
  // JSONPlaceholder supports _limit and _start query parameters
  // _limit: number of items to return
  // _start: index to start from (0-based)
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

// Fetch a single post by ID
// GET request - retrieves one specific post
export const fetchPost = async (id: number): Promise<Post> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }
  return response.json()
}

// Create a new post
// POST request - sends data to the server to create a new resource
export const createPost = async (newPost: CreatePost): Promise<Post> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST', // Specify we're using POST method (create)
    headers: {
      'Content-Type': 'application/json', // Tell the server we're sending JSON data
    },
    body: JSON.stringify(newPost), 
  })
  
  if (!response.ok) {
    throw new Error('Failed to create post')
  }
  
  return response.json() // Return the created post (with id from server)
}