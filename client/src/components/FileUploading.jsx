import React, { useState } from 'react';
import axios from 'axios';

const FileUploading = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!file) {
            alert('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:3000/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data, formData);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <form encType="multipart/form-data">
                <input type="file" name="image" onChange={handleFileChange} />
                <button type="button" onClick={uploadImage}>Upload</button>
            </form>
        </div>
    );
};

export default FileUploading;
