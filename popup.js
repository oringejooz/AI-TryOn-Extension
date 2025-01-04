document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('photoInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const preview = document.getElementById('preview');
    const storedPhotos = document.getElementById('storedPhotos');
  
    // Load existing photos on popup open
    loadStoredPhotos();
  
    uploadBtn.addEventListener('click', function() {
      const file = photoInput.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const photoData = e.target.result;
          
          // Store the photo
          chrome.storage.local.get(['photos'], function(result) {
            const photos = result.photos || [];
            photos.push({
              data: photoData,
              timestamp: new Date().toISOString()
            });
            
            chrome.storage.local.set({ photos: photos }, function() {
              console.log('Photo saved');
              loadStoredPhotos();
            });
          });
        };
        
        reader.readAsDataURL(file);
      }
    });
  
    function loadStoredPhotos() {
      chrome.storage.local.get(['photos'], function(result) {
        const photos = result.photos || [];
        storedPhotos.innerHTML = '';
        
        photos.forEach((photo, index) => {
          const img = document.createElement('img');
          img.src = photo.data;
          img.style.maxWidth = '100%';
          img.style.marginBottom = '10px';
          
          const date = new Date(photo.timestamp).toLocaleDateString();
          const container = document.createElement('div');
          container.appendChild(img);
          container.innerHTML += `<br>Uploaded: ${date}`;
          storedPhotos.appendChild(container);
        });
      });
    }
  });