import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../services/posts-api'
import { Button } from './ui/button' //using shadcn button over here
import { usePaginationStore } from '../stores/pagination-store'

export const PostsList = () => {
  // Get current page and setter from Zustand store
  // This store persists the page number to localStorage automatically
  const { currentPage: page, setCurrentPage } = usePaginationStore()
  
  // using SCREAMING_SNAKE convention for all hardcoded const
  const TOTAL_POSTS = 100
  const POSTS_PER_PAGE = 5 
  const TOTAL_PAGES = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE)


  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['posts', page], // Include page in key so each page is cached separately
    queryFn: () => fetchPosts(page, POSTS_PER_PAGE), 
  })

  // Function to go to the previous page
  const goToPreviousPage = () => {
    // Only go back if we're not on the first page
    if (page > 1) {
      // Update the page in Zustand store, which automatically saves to localStorage
      setCurrentPage(page - 1) // Decrease page number by 1
    }
  }

  // Function to go to the next page
  const goToNextPage = () => {
    // Only go forward if we're not on the last page
    if (page < TOTAL_PAGES) {
      // Update the page in Zustand store, which automatically saves to localStorage
      setCurrentPage(page + 1) // Increase page number by 1
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
        Page {page} of {TOTAL_PAGES}
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '1rem', 
        marginTop: '2rem',
        padding: '1rem'
      }}>
        <Button 
          onClick={goToPreviousPage} 
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        
        {/* Display current page number */}
        <span style={{ fontSize: '1rem', fontWeight: '500' }}>
          Page {page} of {TOTAL_PAGES}
        </span>
        
        {/* Next button - disabled on last page */}
        <Button 
          onClick={goToNextPage} 
          disabled={page === TOTAL_PAGES}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  )
}