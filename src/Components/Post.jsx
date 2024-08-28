import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import imageCompression from 'browser-image-compression';

const CreatePostModal = ({ show, handleClose }) => {
  const [data, setData] = useState({ postText: '', media: null });
  const [error, setError] = useState('');

  // Function to convert file to base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1]);
    }
    return hashtags;
  };

  // Function to handle file compression
  const handleFileCompression = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.5,          // Maximum size in MB
        maxWidthOrHeight: 1024, // Maximum width or height in pixels
        useWebWorker: true,     // Use web worker for compression
      };

      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing file:', error);
      return file; // Fallback to original file if compression fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      // Handle file compression if media exists
      const mediaBase64 = data.media
        ? await getBase64(await handleFileCompression(data.media))
        : null;
      const postData = {
        postText: data.postText,
        media: mediaBase64,
      };

      console.log("Payload to be sent:", postData); // Log payload for debugging

      const response = await fetch('https://twit-backend-production.up.railway.app/api/posts', {
        method: "POST",
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Error while creating post: ${response.status}`);
      }

      const hashtags = extractHashtags(data.postText);
      if (hashtags.length > 0) {
        const hashtagResponse = await fetch('https://twit-backend-production.up.railway.app/api/hashtag/', {
          method: "POST",
          headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: hashtags }),
        });

        if (!hashtagResponse.ok) {
          throw new Error(`Error while posting hashtags: ${hashtagResponse.status}`);
        }
      }

      setData({ postText: '', media: null });
      setError('');
      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.message || "An error occurred");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="bg-black text-white"
      dialogClassName="modal-top"
    >
      <Modal.Header closeButton className="border-bottom border-secondary">
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="d-flex">
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

          {error && <p style={{ color: "white" }}>{error}</p>}
          <Modal.Footer className="d-flex justify-content-between border-top border-secondary">
            <div>
              <label htmlFor="media-upload" style={{ cursor: 'pointer', position: 'relative' }}>
                <i className="bi bi-image mx-2"></i>
                <input
                  id="media-upload"
                  type="file"
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const compressedFile = await handleFileCompression(file);
                      setData({ ...data, media: compressedFile });
                    }
                  }}
                />
              </label>
              <i className="bi bi-camera mx-2" style={{ cursor: 'pointer' }}></i>
              <i className="bi bi-bar-chart mx-2" style={{ cursor: 'pointer' }}></i>
              <i className="bi bi-emoji-smile mx-2" style={{ cursor: 'pointer' }}></i>
              <i className="bi bi-calendar mx-2" style={{ cursor: 'pointer' }}></i>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="btn-sm"
            >
              Post
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
