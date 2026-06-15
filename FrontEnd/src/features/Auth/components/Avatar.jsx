import React from 'react'
import './styles/avatar.scss';
import { useRef, useState } from 'react';
import Button from '../../ui/components/buttons/Button';

export default function AvatarUpload () {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('Max 5MB');
    if (!['image/jpeg', 'image/png'].includes(file.type)) return alert('JPG or PNG only');

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="avatar-card">
      <div className="avatar-ring" onClick={() => inputRef.current.click()}>
        <img style={{width:"100%", height:"100%", objectFit:"cover",
            borderRadius:"50%"
        }} src={preview || '/img-placeholder-2.jpg'} alt="avatar" />
      </div>
      <div className="avatar-card-right">
        <div className="meta">
        <h3>Avatar Core</h3>
        <p>Upload high-res JPG or PNG. Max 5MB.</p>
        <Button text='update Image' color="#000" bg='#fff' padding='.5em' isBorder={true} borderValue={0} 
        clickHandler={()=>inputRef.current.click()}/>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      </div>
    </div>
  );
};