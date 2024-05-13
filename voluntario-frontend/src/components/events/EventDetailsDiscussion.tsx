import { useParams } from 'react-router-dom';
import { Post } from '../posts/Post';
import { useState } from 'react';
import { EventPostType } from '@/utils/types/types';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { getEventPosts, postEventPost } from '@/utils/api/api';

type EventDetailsDiscussionProps = {
  eventId: string;
};

const queryClient = new QueryClient();

export const EventDetailsDiscussion = () => {
  const { eventId } = useParams() as EventDetailsDiscussionProps;
  const [newPostContent, setNewPostContent] = useState<string>('');

  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['eventPosts', eventId],
    queryFn: async () => getEventPosts(eventId).then((res) => res.data),
  });

  const createPostMutation = useMutation({
    mutationFn: async (newPostContent: string) => {
      const response = await postEventPost(eventId, newPostContent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventPosts'] });
    },
  });

  const handlePostSubmit = async () => {
    try {
      await createPostMutation.mutateAsync(newPostContent);
      setNewPostContent('');
    } catch (error) {
      console.error('Błąd podczas wysyłania posta:', error);
    }
  };

  if (!posts) return null;

  if (isPending) return <div>Ładowanie...</div>;

  if (isError) return <div>Nie udało się pobrać postów</div>;

  if (posts.length === 0) return <div>Brak postów</div>;

  posts.map((post: EventPostType) => console.log('post', post));

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        placeholder="Wpisz treść posta..."
      />
      <button onClick={handlePostSubmit}>Wyślij</button>

      {posts.map((post: EventPostType) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
