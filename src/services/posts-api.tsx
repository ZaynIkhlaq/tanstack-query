
// We use JSONPlaceholder, a free fake REST API for testing

// JSONPlaceholder posts have: id, title, body, and userId

// this is the same form in which we get the data (for fetching part)
export interface Post {
  id: number
  title: string
  body: string
  userId: number
}



// schema of new post
export interface CreatePost {
  title: string
  body: string
  userId: number
}

// using pagination, only showing 5 posts per page
export const fetchPosts = async (page: number = 1, limit: number = 5): Promise<Post[]> => {
  const start = (page - 1) * limit
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

// new Post
export const createPost = async (newPost: CreatePost): Promise<Post> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST', // specify POST
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(newPost), 
  })
  
  if (!response.ok) {
    throw new Error('Failed to create post')
  }
  
  return response.json() 
}