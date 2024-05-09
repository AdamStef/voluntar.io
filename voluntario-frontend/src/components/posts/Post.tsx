import { EventPostType } from '@/utils/types/types';
import { Panel } from '../ui/Panel';
import { H4 } from '../ui/typography/heading';

type PostProps = {
  post: EventPostType;
};

export const Post = ({ post }: PostProps) => {
  return (
    <Panel>
      {/* TODO: zmienić na nazwę organizacji */}
      <H4>Organizator: {post.organizerId}</H4>
      <p className="text-sm text-accent-foreground">
        {post.createdAt.toLocaleString()}
        {post.wasEdited ? ' (edytowany)' : ''}
      </p>
      <p className="mt-5 leading-tight">{post.content}</p>
    </Panel>
  );
};
