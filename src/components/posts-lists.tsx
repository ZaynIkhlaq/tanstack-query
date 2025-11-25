import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../services/posts-api'
import { Button } from './ui/button' //using shadcn button over here
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { Separator } from './ui/separator'
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
    return (
      <div>
        <h2>Posts</h2>
        <Separator style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }} />
        {/* Skeleton loading states for better UX */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
              <Skeleton style={{ height: '24px', width: '75%', marginBottom: '0.5rem', background: '#e5e5e5' }} />
              <Skeleton style={{ height: '16px', width: '100%', marginBottom: '0.25rem', background: '#e5e5e5' }} />
              <Skeleton style={{ height: '16px', width: '90%', marginBottom: '0.5rem', background: '#e5e5e5' }} />
              <Skeleton style={{ height: '14px', width: '30%', background: '#e5e5e5' }} />
            </div>
          ))}
        </div>
      </div>
    )
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
      <p style={{ color: '#666', marginBottom: '0.5rem' }}>
        Page {page} of {TOTAL_PAGES}
      </p>
      
      {/* Separator for visual separation */}
      <Separator style={{ marginBottom: '1.5rem' }} />
      
      {/* List of posts */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map((post, index) => (
          <li key={post.id}>
            <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
              {/* Display the post body content */}
              <p style={{ marginTop: '0.5rem', color: '#666', marginBottom: '0.75rem' }}>{post.body}</p>
              {/* Display the user ID who created this post using Badge */}
              <Badge variant="secondary">User {post.userId}</Badge>
            </div>
            {/* Add separator between posts (except after the last one) */}
            {index < data.length - 1 && <Separator style={{ marginBottom: '1.5rem' }} />}
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