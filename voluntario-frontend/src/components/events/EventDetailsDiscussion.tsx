import { getEventPosts } from '@/utils/api/api.ts';
import { useParams } from 'react-router-dom';
import { Post } from '../posts/Post';
import { useQuery } from '@tanstack/react-query';

type EventDetailsDiscussionProps = {
  eventId: string;
};

export const EventDetailsDiscussion = () => {
  const { eventId } = useParams() as EventDetailsDiscussionProps;

  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['eventPosts', eventId],
    queryFn: async () => getEventPosts(eventId).then((res) => res.data),
  });

  if (!posts) return null;

  if (isPending) return <div>Ładownie...</div>;

  if (isError) return <div>Nie znaleziono postów</div>;

  if (posts.length === 0) return <div>Brak postów</div>;

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
