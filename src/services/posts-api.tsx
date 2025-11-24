// This file contains functions that fetch data from an API
// We'll use JSONPlaceholder, a free fake REST API for testing

// Define the shape of a Post object
export interface Post {
    id: number
    title: string
    body: string
    userId: number
  }
  
  // Fetch all posts
  export const fetchPosts = async (): Promise<Post[]> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }
    return response.json()
  }
  
  // Fetch a single post by ID
  export const fetchPost = async (id: number): Promise<Post> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch post')
    }
    return response.json()
  }