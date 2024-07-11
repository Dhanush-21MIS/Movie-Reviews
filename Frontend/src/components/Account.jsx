import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';

const stockImages = [
  'https://img.freepik.com/free-photo/3d-illustration-cute-cartoon-girl-blue-jacket-glasses_1142-41044.jpg?t=st=1720699838~exp=1720703438~hmac=db8f82804eba9cd2e70793f2cb96d4c0dc6daa0e87198450b1c49411b7f35b99&w=740',
  'https://img.freepik.com/free-photo/portrait-young-woman-wearing-glasses-3d-rendering_1142-43632.jpg?t=st=1720699860~exp=1720703460~hmac=e1a09ca9759d473b88b2e486ad2b655514075747f4405dbb7dbd06c0de21c02e&w=740',
  'https://img.freepik.com/free-photo/3d-illustration-cute-cartoon-boy-with-backpack-his-back_1142-40542.jpg?t=st=1720699910~exp=1720703510~hmac=deb0af99e9193691eb9919ddd891df805bea831cf55f0f750fbeb6891a6a8085&w=740',
  'https://img.freepik.com/free-photo/portrait-handsome-hipster-man-glasses-3d-rendering_1142-51612.jpg?t=st=1720699952~exp=1720703552~hmac=ecf87a4b8f7cb2d35e83507538595e5e5fd4b445913accb45c1a305ff3178b34&w=740',
];

const AccountPage = () => {
  const [userData, setUserData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePictureSelect = async (image) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3001/user/profile-picture',
        { profilePicture: image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData((prevUserData) => ({
        ...prevUserData,
        profilePicture: response.data.profilePicture,
      }));
      // Reload the page after the profile picture is updated
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile picture:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="account-page">
      <h1>Account Details</h1>
      <div className="profile-picture-container">
        {userData.profilePicture ? (
          <img src={userData.profilePicture} alt="Profile" className="profile-image" />
        ) : (
          <div className="no-picture">No profile picture set</div>
        )}
      </div>
      <div className="user-details">
        <h3>Username: {userData.username}</h3>
        <p>Email: {userData.email}</p>
      </div>
      <div className="stock-images">
        <h3>Select a Profile Picture:</h3>
        <div className="stock-images-container">
          {stockImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Stock ${index + 1}`}
              className="stock-image"
              onClick={() => handleProfilePictureSelect(image)}
            />
          ))}
        </div>
      </div>
      {uploading && <p>Updating...</p>}
    </div>
  );
};

export default AccountPage;
