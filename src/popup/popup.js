document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('adversaireCheckbox');
  
    // Check if chrome.storage is available and use chrome.storage.local if chrome.storage.sync is not available
    const storage = chrome.storage.sync || chrome.storage.local;
  
    // Load the checkbox state from storage
    storage.get('modeAdversaire', function(data) {
      checkbox.checked = data.modeAdversaire || false;
    });
  
    // Add an event listener to save the checkbox state
    checkbox.addEventListener('change', function() {
      storage.set({ modeAdversaire: checkbox.checked });
    });
});