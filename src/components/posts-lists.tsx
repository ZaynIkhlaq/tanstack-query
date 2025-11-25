import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../services/posts-api'
import { Button } from './ui/button'

export const PostsList = () => {
  // State to track the current page number
  // useState returns an array: [currentValue, setterFunction]
  // We start at page 1 (first page)
  const [page, setPage] = useState(1)
  
  // Total number of posts available (JSONPlaceholder has 100 posts)
  const totalPosts = 100
  const postsPerPage = 5
  // Calculate total pages: divide total posts by posts per page, round up
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  // useQuery is a hook that fetches and manages data
  // It takes two arguments:
  // 1. A query key (unique identifier for this query) - includes page number for caching
  // 2. A query function (the function that fetches the data) - passes page number
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['posts', page], // Include page in key so each page is cached separately
    queryFn: () => fetchPosts(page, postsPerPage), // Pass page and limit to fetchPosts
  })

  // Function to go to the previous page
  const goToPreviousPage = () => {
    // Only go back if we're not on the first page
    if (page > 1) {
      setPage(page - 1) // Decrease page number by 1
    }
  }

  // Function to go to the next page
  const goToNextPage = () => {
    // Only go forward if we're not on the last page
    if (page < totalPages) {
      setPage(page + 1) // Increase page number by 1
    }
  }

  // isLoading is true while the data is being fetched
  if (isLoading) {
    return <div>Loading posts...</div>
  }

  // isError is true if the query failed
  if (isError) {
    return <div>Error: {error.message}</div>
  }

  // data contains the fetched posts once loading is complete
  return (
    <div>
      <h2>Posts</h2>
      {/* Display current page information */}
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Page {page} of {totalPages}
      </p>
      
      {/* List of posts */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map((post) => (
          <li key={post.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{post.title}</h3>
            {/* Display the post body content */}
            <p style={{ marginTop: '0.5rem', color: '#666' }}>{post.body}</p>
            {/* Display the user ID who created this post */}
            <small style={{ color: '#999', fontSize: '0.875rem' }}>User ID: {post.userId}</small>
          </li>
        ))}
      </ul>

      {/* Pagination controls at the bottom */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '1rem', 
        marginTop: '2rem',
        padding: '1rem'
      }}>
        {/* Previous button - disabled on first page */}
        <Button 
          onClick={goToPreviousPage} 
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        
        {/* Display current page number */}
        <span style={{ fontSize: '1rem', fontWeight: '500' }}>
          Page {page} of {totalPages}
        </span>
        
        {/* Next button - disabled on last page */}
        <Button 
          onClick={goToNextPage} 
          disabled={page === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  )
}