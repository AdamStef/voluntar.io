import { useParams } from 'react-router-dom';
import { Post } from '../../posts/Post';
import { useState } from 'react';
import { EventPostType, Role } from '@/utils/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEventPosts, postEventPost } from '@/utils/api/api';
import { Button } from '../../ui/button';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Spinner } from '../../ui/Spinner';
import { Textarea } from '@/components/ui/textarea';

type EventDetailsDiscussionProps = {
  eventId: string;
};

export const EventDetailsDiscussion = () => {
  const { eventId } = useParams() as EventDetailsDiscussionProps;
  const [newPostContent, setNewPostContent] = useState<string>('');
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const {
    data: posts,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['events', eventId, 'posts'],
    queryFn: async () => getEventPosts(eventId).then((res) => res.data),
  });

  const createPostMutation = useMutation({
    mutationFn: postEventPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'posts'] });
      console.log(
        'Post created successfully',
        ['events', eventId, 'posts'],
        data,
      );
    },
  });

  const handlePostSubmit = async () => {
    try {
      await createPostMutation.mutateAsync({
        eventId,
        content: newPostContent,
      });
      // refetch();
      setNewPostContent('');
    } catch (error) {
      console.error('Błąd podczas wysyłania posta:', error);
    }
  };

  if (isPending) return <Spinner className="mx-auto" />;

  if (isError) return <div>Nie udało się pobrać postów</div>;

  if (!posts) return null;

  return (
    <div className="flex flex-col gap-2">
      {user?.role === Role.ORGANIZATION && (
        <>
          <Textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Wpisz treść posta..."
          />
          <Button onClick={handlePostSubmit}>Opublikuj</Button>
        </>
      )}

      {posts.length === 0 ? (
        <div>Brak postów</div>
      ) : (
        posts.map((post: EventPostType) => (
          <Post key={post.id} post={post} refetch={refetch} />
        ))
      )}
    </div>
  );
};
