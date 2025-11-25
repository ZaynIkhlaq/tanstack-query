import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPost, type CreatePost } from '../services/posts-api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
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
    control, // Controller for complex inputs like Select
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

  // This function runs when the form is submitted
  const onSubmit = (data: CreatePost) => {
    // Call mutation.mutate to trigger the POST request
    mutation.mutate(data)
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

        {/* User ID select field */}
        <div>
          <Label htmlFor="userId" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e5e5', display: 'block', marginBottom: '0.5rem' }}>
            User ID
          </Label>
          <Controller
            name="userId"
            control={control}
            rules={{
              required: 'User ID is required', // Validation rule: must be filled
            }}
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => {
                  field.onChange(Number(value))
                  setUserId(Number(value))
                }}
              >
                <SelectTrigger
                  id="userId"
                  style={{ 
                    maxWidth: '200px',
                    background: '#2a2a2a',
                    border: errors.userId ? '2px solid #dc2626' : '2px solid #5a5a5a',
                    color: '#ffffff',
                  }}
                >
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      User {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
    </div>
  )
}

