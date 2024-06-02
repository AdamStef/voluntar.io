import React, { useState, useEffect } from 'react';
import { getUserComments } from '@/utils/api/api';

interface UserCommentsListProps {
  userId: number;
}

const UserCommentsList: React.FC<UserCommentsListProps> = ({ userId }) => {
  const [comments, setComments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getUserComments(userId);
        setComments(commentsData);
      } catch (error) {
        setError('Bład z komentarzami');
      }
    };

    fetchComments();
  }, [userId]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="rounded-lg bg-gray-100 p-6">
      <h2 className="mb-4 text-2xl font-bold">Twoje komentarze</h2>
      {comments.length === 0 ? (
        <p className="text-center">Nie znaleziono komentarzy</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p>{comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserCommentsList;
