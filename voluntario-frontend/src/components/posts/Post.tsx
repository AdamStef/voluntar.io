import { EventPostType } from '@/utils/types/types';
import { Panel } from '../ui/Panel';
import { H4 } from '../ui/typography/heading';
import { Trash, Edit3, MoreVertical } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost, putEventPost } from '@/utils/api/api';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type PostProps = {
  post: EventPostType;
};

export const Post = ({ post }: PostProps) => {
  const { user } = useAuthContext();
  const eventId = useParams().eventId;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['events', eventId, 'posts'] });
      console.log(
        'Post deleted successfully',
        ['events', eventId, 'posts'],
        data,
      );
    },
  });

  const editPostMutation = useMutation({
    mutationFn: putEventPost,
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['events', eventId, 'posts'] });
      setIsEditing(false);
      console.log(
        'Post edited successfully',
        ['events', eventId, 'posts'],
        data,
      );
    },
  });

  const handleDeletePost = () => {
    console.log('Deleting post:', post.id);
    deletePostMutation.mutateAsync(post.id);
  };

  const handleEditPost = () => {
    editPostMutation.mutateAsync({ postId: post.id, content: editedContent });
  };

  return (
    <Panel>
      <div className="flex justify-between">
        <H4>{post.organization.name}</H4>
        {user?.organization?.id === post.organization.id && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="rounded bg-white p-2 shadow-md">
              <DropdownMenu.Item
                className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="mr-2 h-5 w-5 text-gray-700" />
                Edytuj
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex cursor-pointer items-center p-2 text-destructive hover:bg-gray-100"
                onClick={handleDeletePost}
              >
                <Trash className="mr-2 h-5 w-5 text-destructive" />
                Usuń
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>
      <p className="text-sm text-accent-foreground">
        {post.createdAt.toLocaleString()}
        {post.wasEdited && ' (edytowano)'}
      </p>
      {isEditing ? (
        <>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mt-2"
          />
          <div className="mt-2 flex gap-2">
            <Button onClick={handleEditPost}>Zapisz</Button>
            <Button onClick={() => setIsEditing(false)} variant="secondary">
              Anuluj
            </Button>
          </div>
        </>
      ) : (
        <p id="post-content" className="mt-5 leading-tight">
          {post.content}
        </p>
      )}
    </Panel>
  );
};
