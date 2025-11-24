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
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}