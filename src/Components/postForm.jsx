import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreatePostForm = () => {
  const [data, setData] = useState({ postText: '', media: null });
  const [error, setError] = useState('');

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1]);
    }
    return hashtags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No token found");
      return;
    }

    const formData = new FormData();
    formData.append('postText', data.postText);
    if (data.media) {
      formData.append('media', data.media);
    }

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: "POST",
        headers: {
          "Authorization": `${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error while creating post: ${response.status}`);
      }

      const text = extractHashtags(data.postText);
      if (text.length > 0) {
        const hashtagResponse = await fetch('http://localhost:5000/api/hashtag/', {
          method: "POST",
          headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!hashtagResponse.ok) {
          throw new Error(`Error while posting hashtags: ${hashtagResponse.status}`);
        }
      }

      setData({ postText: '', media: null });
      setError('');
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.message || "An error occurred");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
        <div className="d-flex align-items-center mb-3">
          <img
            src="https://github.com/mdo.png"
            alt="User"
            className="rounded-circle me-3"
            width={50}
            height={50}
          />
          <textarea
            className="form-control border-0 bg-secondary text-white"
            rows="4"
            placeholder="What's happening?"
            style={{ resize: 'none' }}
            value={data.postText}
            onChange={(e) =>
              setData({ ...data, postText: e.target.value })
            }
            required
          ></textarea>
        </div>

        {error && <p className="text-white">{error}</p>}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <label htmlFor="media-upload" className="d-inline">
              <i className="bi bi-image mx-2"></i>
              <input
                id="media-upload"
                type="file"
                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', cursor: 'pointer' }}
                onChange={(e) =>
                  setData({ ...data, media: e.target.files[0] })
                }
              />
            </label>
            <i className="bi bi-camera mx-2" style={{ cursor: 'pointer' }}></i>
            <i className="bi bi-bar-chart mx-2" style={{ cursor: 'pointer' }}></i>
            <i className="bi bi-emoji-smile mx-2" style={{ cursor: 'pointer' }}></i>
            <i className="bi bi-calendar mx-2" style={{ cursor: 'pointer' }}></i>
          </div>
          <button type="submit" className="btn btn-primary">
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;
