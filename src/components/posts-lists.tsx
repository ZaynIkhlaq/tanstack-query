import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPosts, deletePost, updatePost, type Post, type UpdatePost } from '../services/posts-api'
import { Button } from './ui/button' //using shadcn components over here
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { Separator } from './ui/separator'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { usePaginationStore } from '../stores/pagination-store'
import { toast } from 'sonner'

export const PostsList = () => {
  // getting current page from Zustand, ensuring persistence
  const { currentPage: page, setCurrentPage } = usePaginationStore()
  
  const queryClient = useQueryClient()
  
  // using SCREAMING_SNAKE convention
  const TOTAL_POSTS = 100
  const POSTS_PER_PAGE = 5 
  const TOTAL_PAGES = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE)


  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['posts', page], 
    queryFn: () => fetchPosts(page, POSTS_PER_PAGE), 
  })


  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<UpdatePost>({
    title: '',
    body: '',
    userId: 1,
  })

  // handling update part 
  const updateMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePost }) => 
      updatePost(postId, data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setEditingPostId(null)
      setEditFormData({ title: '', body: '', userId: 1 })
      toast.success('Post updated successfully!')
    },
    onError: (error) => {
      
      toast.error(`Error: ${error.message}`)
    },
  })

 
  const deleteMutation = useMutation({
    mutationFn: deletePost, // The function that deletes the post
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['posts'] })
      
      toast.success('Post deleted successfully!')
    },
    onError: (error) => {
     
      toast.error(`Error: ${error.message}`)
    },
  })

  // Function to start editing a post
  const handleEdit = (post: Post) => {
    
    setEditingPostId(post.id)

    setEditFormData({
      title: post.title,
      body: post.body,
      userId: post.userId,
    })
  }

  // Function to cancel editing
  const handleCancelEdit = () => {
    // Reset editing state without saving
    setEditingPostId(null)
    setEditFormData({ title: '', body: '', userId: 1 })
  }

  // Function to save the edited post
  const handleSaveEdit = (postId: number) => {
    // Validate the form data
    if (!editFormData.title.trim() || !editFormData.body.trim()) {
      toast.error('Title and body are required')
      return
    }
    // Call mutation.mutate to trigger the PUT request
    updateMutation.mutate({ postId, data: editFormData })
  }

  // Function to handle delete button click
  const handleDelete = (postId: number) => {
    // Call mutation.mutate to trigger the DELETE request
    deleteMutation.mutate(postId)
  }

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
              {/* Check if this post is being edited */}
              {editingPostId === post.id ? (
                /* Edit mode - show edit form */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Title input field */}
                  <div>
                    <Label htmlFor={`edit-title-${post.id}`} style={{ fontSize: '0.875rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '0.5rem' }}>
                      Title
                    </Label>
                    <Input
                      id={`edit-title-${post.id}`}
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      style={{
                        background: '#ffffff',
                        border: '2px solid #5a5a5a',
                        color: '#000000',
                      }}
                    />
                  </div>

                  {/* Body textarea field */}
                  <div>
                    <Label htmlFor={`edit-body-${post.id}`} style={{ fontSize: '0.875rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '0.5rem' }}>
                      Body
                    </Label>
                    <Textarea
                      id={`edit-body-${post.id}`}
                      value={editFormData.body}
                      onChange={(e) => setEditFormData({ ...editFormData, body: e.target.value })}
                      rows={5}
                      style={{
                        background: '#ffffff',
                        border: '2px solid #5a5a5a',
                        color: '#000000',
                      }}
                    />
                  </div>

                  {/* User ID input field */}
                  <div>
                    <Label htmlFor={`edit-userId-${post.id}`} style={{ fontSize: '0.875rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '0.5rem' }}>
                      User ID
                    </Label>
                    <Input
                      id={`edit-userId-${post.id}`}
                      type="number"
                      value={editFormData.userId}
                      onChange={(e) => setEditFormData({ ...editFormData, userId: parseInt(e.target.value, 10) || 1 })}
                      style={{
                        maxWidth: '150px',
                        background: '#ffffff',
                        border: '2px solid #5a5a5a',
                        color: '#000000',
                      }}
                    />
                  </div>

                  {/* Save and Cancel buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={updateMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSaveEdit(post.id)}
                      disabled={updateMutation.isPending}
                    >
                      {/* Show loading state while updating post */}
                      {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View mode - show post content */
                <>
                  {/* Header section with title and action buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, flex: 1 }}>{post.title}</h3>
                    {/* Action buttons - Edit and Delete */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        disabled={deleteMutation.isPending || updateMutation.isPending}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteMutation.isPending || updateMutation.isPending}
                      >
                        {/* Show loading state while deleting post */}
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                  {/* Display the post body content */}
                  <p style={{ marginTop: '0.5rem', color: '#666', marginBottom: '0.75rem' }}>{post.body}</p>
                  {/* Display the user ID who created this post using Badge */}
                  <Badge variant="secondary">User {post.userId}</Badge>
                </>
              )}
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