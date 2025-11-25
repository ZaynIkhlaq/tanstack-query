import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPost, deletePost, type CreatePost } from '../services/posts-api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { useFormStore } from '../stores/form-store'

export const CreatePostForm = () => {
  // useQueryClient gives us access to the query client
  // We use it to refresh the posts list after creating a new post
  const queryClient = useQueryClient()

  // Get form data and actions from Zustand store
  // This store persists data to localStorage automatically
  const { formData, setTitle, setBody, setUserId, clearForm } = useFormStore()

  // useForm is a hook from react-hook-form that manages form state
  // It returns methods and properties to handle form submission and validation
  const {
    register, // Function to register form inputs
    handleSubmit, // Function to handle form submission
    reset, // Function to reset the form
    watch, // Function to watch form values as they change
    formState: { errors }, // Object containing validation errors
  } = useForm<CreatePost>({
    // Use persisted values from Zustand store as default values
    // This restores the form when the page refreshes
    defaultValues: {
      title: formData.title,
      body: formData.body,
      userId: formData.userId, 
    },
    // Validation mode: validate on change and on blur for better UX
    mode: 'onChange', // Validate as user types
    reValidateMode: 'onChange', // Re-validate on change after first submission
  })

  // Watch form values and sync them to Zustand store
  // This saves the form data as the user types
  const titleValue = watch('title')
  const bodyValue = watch('body')
  const userIdValue = watch('userId')

  // useEffect runs whenever the watched values change
  // It updates the Zustand store, which automatically saves to localStorage
  useEffect(() => {
    setTitle(titleValue)
  }, [titleValue, setTitle])

  useEffect(() => {
    setBody(bodyValue)
  }, [bodyValue, setBody])

  useEffect(() => {
    setUserId(userIdValue)
  }, [userIdValue, setUserId])

  // State to track the post ID to delete
  // This is separate from the form since it's not part of the create post form
  const [deletePostId, setDeletePostId] = useState<string>('')

  // useMutation handles POST, PUT, DELETE operations (mutations)
  // It returns a mutate function and status information
  const mutation = useMutation({
    mutationFn: createPost, // The function that creates the post
    onSuccess: () => {
      // After successfully creating a post, refresh the posts list
      // invalidateQueries tells React Query to refetch data for matching queries
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Reset the form after successful submission
      // Pass defaultValues to ensure form resets properly
      reset({
        title: '',
        body: '',
        userId: 1,
      })
      // Also clear the persisted form data in Zustand store
      // This ensures localStorage is cleared after successful submission
      clearForm()
      // Show success toast notification
      toast.success('Post created successfully!')
    },
    onError: (error) => {
      // Show error toast notification
      toast.error(`Error: ${error.message}`)
    },
  })

  // useMutation for delete operation
  // This handles DELETE requests to remove posts
  const deleteMutation = useMutation({
    mutationFn: deletePost, // The function that deletes the post
    onSuccess: () => {
      // After successfully deleting a post, refresh the posts list
      // invalidateQueries tells React Query to refetch data for matching queries
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Clear the delete input field
      setDeletePostId('')
      // Show success toast notification
      toast.success('Post deleted successfully!')
    },
    onError: (error) => {
      // Show error toast notification
      toast.error(`Error: ${error.message}`)
    },
  })

  // This function runs when the form is submitted
  const onSubmit = (data: CreatePost) => {
    // Call mutation.mutate to trigger the POST request
    mutation.mutate(data)
  }

  // Function to handle delete button click
  const handleDelete = () => {
    // Validate that a post ID was entered
    const postId = parseInt(deletePostId, 10)
    if (!deletePostId || isNaN(postId) || postId < 1) {
      toast.error('Please enter a valid post ID')
      return
    }
    // Call deleteMutation.mutate to trigger the DELETE request
    deleteMutation.mutate(postId)
  }

  return (
    <div style={{ 
      marginBottom: '2rem',
      padding: '1.5rem',
      background: '#4a4a4a',
      border: '1px solid #5a5a5a',
      borderRadius: '8px',
    }}>
      {/* Simple header */}
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        marginBottom: '1rem',
        color: '#ffffff',
      }}>
        Create New Post
      </h2>
      
      {/* Separator for visual separation */}
      <Separator style={{ marginBottom: '1.5rem', background: '#5a5a5a' }} />
      
      {/* Form element - onSubmit calls handleSubmit which validates then calls onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title input field */}
        <div>
          <Label htmlFor="title" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e5e5', display: 'block', marginBottom: '0.5rem' }}>
            Title
          </Label>
          <Input
            id="title"
            {...register('title', {
              required: 'Title is required', // Validation rule: must be filled
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters', // Custom error message
              },
              validate: (value) => {
                // Additional validation: trim whitespace
                if (value.trim().length < 3) {
                  return 'Title must be at least 3 characters (excluding spaces)'
                }
                return true
              },
            })}
            placeholder="Enter post title"
            aria-invalid={errors.title ? 'true' : 'false'} // Accessibility: mark invalid fields
            style={{
              background: '#2a2a2a',
              border: errors.title ? '2px solid #dc2626' : '2px solid #5a5a5a',
              color: '#ffffff',
            }}
          />
          {/* Display validation error if title is invalid */}
          {errors.title && (
            <p style={{ 
              color: '#dc2626', 
              fontSize: '0.75rem', 
              marginTop: '0.5rem',
              marginBottom: 0,
            }}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Body textarea field */}
        <div>
          <Label htmlFor="body" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e5e5', display: 'block', marginBottom: '0.5rem' }}>
            Body
          </Label>
          <Textarea
            id="body"
            {...register('body', {
              required: 'Body is required', // Validation rule: must be filled
              minLength: {
                value: 10,
                message: 'Body must be at least 10 characters', // Custom error message
              },
              validate: (value) => {
                // Additional validation: trim whitespace
                if (value.trim().length < 10) {
                  return 'Body must be at least 10 characters (excluding spaces)'
                }
                return true
              },
            })}
            placeholder="Enter post body"
            rows={5}
            aria-invalid={errors.body ? 'true' : 'false'} // Accessibility: mark invalid fields
            style={{
              background: '#2a2a2a',
              border: errors.body ? '2px solid #dc2626' : '2px solid #5a5a5a',
              color: '#ffffff',
            }}
          />
          {/* Display validation error if body is invalid */}
          {errors.body && (
            <p style={{ 
              color: '#dc2626', 
              fontSize: '0.75rem', 
              marginTop: '0.5rem',
              marginBottom: 0,
            }}>
              {errors.body.message}
            </p>
          )}
        </div>

        {/* User ID input field */}
        <div>
          <Label htmlFor="userId" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e5e5', display: 'block', marginBottom: '0.5rem' }}>
            User ID
          </Label>
          <Input
            id="userId"
            type="number"
            {...register('userId', {
              required: 'User ID is required', // Validation rule: must be filled
              valueAsNumber: true, // Convert string to number
              min: {
                value: 1,
                message: 'User ID must be at least 1', // Custom error message
              },
              max: {
                value: 10,
                message: 'User ID must be at most 10', // JSONPlaceholder has 10 users
              },
              validate: (value) => {
                // Ensure it's a valid integer
                if (!Number.isInteger(Number(value))) {
                  return 'User ID must be a whole number'
                }
                return true
              },
            })}
            placeholder="1-10"
            aria-invalid={errors.userId ? 'true' : 'false'} // Accessibility: mark invalid fields
            style={{ 
              maxWidth: '150px',
              background: '#2a2a2a',
              border: errors.userId ? '2px solid #dc2626' : '2px solid #5a5a5a',
              color: '#ffffff',
            }}
          />
          {/* Display validation error if userId is invalid */}
          {errors.userId && (
            <p style={{ 
              color: '#dc2626', 
              fontSize: '0.75rem', 
              marginTop: '0.5rem',
              marginBottom: 0,
            }}>
              {errors.userId.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            style={{ minWidth: '140px' }}
          >
            {/* Show loading state while creating post */}
            {mutation.isPending ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>

      {/* Delete Post Section */}
      <Separator style={{ marginTop: '2rem', marginBottom: '1.5rem', background: '#5a5a5a' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: '#ffffff',
        }}>
          Delete Post
        </h3>
        
        {/* Delete post input and button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Label htmlFor="deletePostId" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e5e5', display: 'block', marginBottom: '0.5rem' }}>
              Post ID to Delete
            </Label>
            <Input
              id="deletePostId"
              type="number"
              value={deletePostId}
              onChange={(e) => setDeletePostId(e.target.value)}
              placeholder="Enter post ID"
              style={{ 
                maxWidth: '200px',
                background: '#2a2a2a',
                border: '2px solid #5a5a5a',
                color: '#ffffff',
              }}
            />
          </div>
          
          {/* Delete button - positioned next to the Create Post button area */}
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.75rem' }}>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending || !deletePostId}
              style={{ minWidth: '140px' }}
            >
              {/* Show loading state while deleting post */}
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

