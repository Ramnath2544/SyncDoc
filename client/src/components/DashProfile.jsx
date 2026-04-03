import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  TextInput,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { avatarUrl } from "../constants/defaultAvatarUrl";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formDataUpdate, setFormDataUpdate] = useState({});
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState(null);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)",
        );
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadError(null);
    }
  };

  useEffect(() => {
    const uploadImage = async () => {
      setIsUploading(true);
      setImageFileUploadError(null);
      setImageFileUploadProgress(0);
      const progressInterval = setInterval(() => {
        setImageFileUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        clearInterval(progressInterval);

        if (!response.ok) {
          setImageFileUploadError(data.error || "Could not upload image");
          setImageFileUploadProgress(null); 
          setIsUploading(false);
          setImageFile(null);
          setImageFileUrl(null);
          return;
        }

        setImageFileUploadProgress(100);
 
        setTimeout(() => {
          setImageFileUploadProgress(null);
        }, 1000);

        setImageFileUrl(data.imageUrl);
        setFormDataUpdate((prev) => ({
          ...prev,
          profilePicture: data.imageUrl,
        }));
        setIsUploading(false);
      } catch (error) {
        clearInterval(progressInterval);
        setImageFileUploadProgress(null);
        console.error("Error uploading image:", error);
        setImageFileUploadError("Network error: Could not upload image.");
        setIsUploading(false);
        setImageFile(null);
        setImageFileUrl(null);
      }
    };

    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormDataUpdate({ ...formDataUpdate, [e.target.id]: e.target.value });
    setUpdateSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccessMsg(null);

    if (Object.keys(formDataUpdate).length === 0) {
      dispatch(
        updateFailure(
          "No changes to update. Please edit at least one field or choose a new image.",
        ),
      );
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataUpdate),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        dispatch(updateFailure(data?.message || data));
      } else {
        dispatch(updateSuccess(data));
        setUpdateSuccessMsg("User profile updated successfully");
        setFormDataUpdate({}); 
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
 
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full"
          onClick={() => filePickerRef.current.click()}
        >

          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || avatarUrl(currentUser.profilePicture)}
            alt="user"
 
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress && imageFileUploadProgress < 100
                ? "opacity-60"
                : ""
            }`}
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || isUploading}
          className="cursor-pointer"
        >
          {loading
            ? "Loading..."
            : isUploading
              ? "Uploading Image..."
              : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="cursor-pointer w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>

      {updateSuccessMsg && (
        <Alert color="success" className="mt-5">
          {updateSuccessMsg}
        </Alert>
      )}

      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      <div className="text-red-500 flex justify-between mt-5">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
        <span
          onClick={handleSignout}
          className="cursor-pointer hover:underline"
        >
          Sign Out
        </span>
      </div>
      
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto h-14 w-14 text-gray-400 dark:text-gray-200 mb-4" />
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteUser}
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300/60 dark:focus:ring-red-900/50 text-white font-semibold shadow-lg shadow-red-500/20 disabled:opacity-70"
              >
                {loading ? "Deleting..." : "Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}