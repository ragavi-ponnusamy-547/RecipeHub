import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ comments = [], onAddComment }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onAddComment(comment.trim());
      setComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="comment-section">
      <h3>Comments</h3>
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            rows="3"
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="muted-text">Sign in to leave a comment.</p>
      )}

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="muted-text">No comments yet.</p>
        ) : (
          comments.map((entry) => (
            <article className="comment-item" key={entry._id}>
              <img src={entry.profilePic} alt={entry.username} />
              <div>
                <strong>@{entry.username}</strong>
                <p>{entry.text}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
