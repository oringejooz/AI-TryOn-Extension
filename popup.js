document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('photoInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const preview = document.getElementById('preview');
  const storedPhotos = document.getElementById('storedPhotos');
  const fileStatus = document.getElementById('fileStatus');
  const fileName = document.getElementById('fileName');

  // Load existing photos on popup open
  loadStoredPhotos();

  // Show filename and checkbox when photo is selected
  photoInput.addEventListener('change', function() {
    const file = photoInput.files[0];
    if (file) {
      fileName.textContent = file.name;
      fileStatus.classList.add('visible');
    } else {
      fileStatus.classList.remove('visible');
    }
  });

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
            name: file.name,
            timestamp: new Date().toISOString()
          });
          
          chrome.storage.local.set({ photos: photos }, function() {
            console.log('Photo saved');
            loadStoredPhotos();
            // Reset the file input and status display
            photoInput.value = '';
            fileStatus.classList.remove('visible');
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
        container.innerHTML += `<br>File: ${photo.name}<br>Uploaded: ${date}`;
        storedPhotos.appendChild(container);
      });
    });
  }
});