import { EventPostType } from '@/utils/types/types';
import { Panel } from '../ui/Panel';
import { H4 } from '../ui/typography/heading';
import { Trash } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Button } from '../ui/button';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { deletePost } from '@/utils/api/api';
import { useParams } from 'react-router-dom';

type PostProps = {
  post: EventPostType;
  refetch: () => void;
};

const queryClient = new QueryClient();

export const Post = ({ post, refetch }: PostProps) => {
  const { user } = useAuthContext();
  const eventId = useParams().eventId;
  // const eventId = post.event.id;

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'posts'] });
      console.log(
        'Post deleted successfully',
        ['events', eventId, 'posts'],
        data,
      );
      refetch();
    },
  });

  const handleDeletePost = () => {
    console.log('Deleting post:', post.id);
    deletePostMutation.mutateAsync(post.id);
  };

  return (
    <Panel>
      {/* TODO: zmienić na nazwę organizacji */}
      <div className="flex justify-between">
        <H4>Organizator: {post.organizerId}</H4>
        {user?.id === post.organizerId && (
          <Button onClick={handleDeletePost} variant="destructive">
            <Trash className="w-5 text-destructive-foreground" />
          </Button>
        )}
      </div>
      <p className="text-sm text-accent-foreground">
        {post.createdAt.toLocaleString()}
        {post.wasEdited ? ' (edytowany)' : ''}
      </p>
      <p className="mt-5 leading-tight">{post.content}</p>
    </Panel>
  );
};
