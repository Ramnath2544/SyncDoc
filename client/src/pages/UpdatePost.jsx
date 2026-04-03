import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function UpdatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImageUploadError(
        'Could not upload image (File must be less than 2MB)',
      );
      setImageFile(null);
      return;
    }

    setImageUploadError(null);
    setImageFile(file);
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setImageUploadError('Please choose an image first');
      return;
    }

    setIsUploading(true);
    setImageUploadError(null);
    setImageUploadProgress(0);

    const progressInterval = setInterval(() => {
      setImageUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: uploadData,
      });

      clearInterval(progressInterval);

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        setImageUploadError(
          data?.error || data?.message || 'Could not upload image',
        );
        setIsUploading(false);
        setImageUploadProgress(null);
        return;
      }

      setImageUploadProgress(100);

      setTimeout(() => {
        setImageUploadProgress(null);
        setIsUploading(false);
      }, 1000);

      setFormData({ ...formData, image: data.imageUrl });
    } catch (err) {
      clearInterval(progressInterval);
      setImageUploadProgress(null);
      setImageUploadError(
        err.message || 'Network error: Could not upload image',
      );
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch {
      setPublishError('Something went wrong while publishing.');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            id='category'
            required
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            disabled={isUploading}
          />

          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={isUploading}
            className='min-w-[160px] p-2'
          >
            <div className='flex items-center justify-center gap-3'>
              {isUploading && imageUploadProgress !== null ? (
                <>
                  <div className='w-8 h-8'>
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress}%`}
                      styles={{
                        root: { width: '100%', height: '100%' },
                        path: {
                          stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                        },
                        text: {
                          fill: '#3e98c7',
                          fontSize: '32px',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  </div>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload image</span>
              )}
            </div>
          </Button>
        </div>

        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}

        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover rounded-lg border border-gray-200 dark:border-gray-800'
          />
        )}

        <ReactQuill
          theme='snow'
          value={formData.content}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
          className='cursor-pointer'
        >
          Update post
        </Button>

        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
