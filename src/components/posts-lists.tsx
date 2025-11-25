import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../services/posts-api'

export const PostsList = () => {
  // useQuery is a hook that fetches and manages data
  // It takes two arguments:
  // 1. A query key (unique identifier for this query)
  // 2. A query function (the function that fetches the data)
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['posts'], // Unique key for caching
    queryFn: fetchPosts, // Function that returns a Promise
  })

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
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map((post) => (
          <li key={post.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{post.title}</h3>
            {/* Display the thumbnail image */}
            {/* The img tag's src attribute points to the image URL */}
            {/* alt provides text description for accessibility */}
            <img 
              src={post.thumbnailUrl} 
              alt={post.title}
              style={{ maxWidth: '150px', height: 'auto', borderRadius: '4px', marginTop: '0.5rem' }}
            />
            {/* Optionally display the full-size image URL as a link */}
            {post.body && <p>{post.body}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}