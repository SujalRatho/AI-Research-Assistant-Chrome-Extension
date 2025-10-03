
document.addEventListener('DOMContentLoaded',()=>{
  // when dom loads, getting notes from local storage and showing in textarea
  chrome.storage.local.get(['researchNotes'],function(result){
    if(result.researchNotes){
      document.getElementById('notes').value = result.researchNotes;
    }
  });

  // Initialize theme
  initializeTheme();

  document.getElementById('summarizeBtn').addEventListener('click',summarizeText);
  document.getElementById('saveNotesBtn').addEventListener('click',saveNotes);
  document.getElementById('themeToggle').addEventListener('click',toggleTheme);

});



async function summarizeText() {
  const button = document.getElementById('summarizeBtn');
  const originalContent = button.innerHTML;
  
  try {
      // Show loading state
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
      button.disabled = true;
      
      //getting active tab
      const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
      //getting selected text
      const [{result}] = await chrome.scripting.executeScript({
          target: {tabId:tab.id},
          function:() => window.getSelection().toString()
      });

      if(!result){
          showresult('Please select some text first', 'error');
          return;
      }
      
      const response = await fetch('http://localhost:8080/api/research/process',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({content:result,operation:'summarize'})
      });

      if(!response.ok){
        throw new Error(`API Error: ${response.status}`);
      }
      
      const text = await response.text();
      showresult(text.replace(/\n/g,'<br>'));

  } catch (error) {
      showresult('Error: '+error.message, 'error');
  } finally {
      // Reset button state
      button.innerHTML = originalContent;
      button.disabled = false;
  }
}


async function saveNotes() {
    const button = document.getElementById('saveNotesBtn');
    const originalContent = button.innerHTML;
    const notes = document.getElementById('notes').value;
    
    try {
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Saving...</span>';
        button.disabled = true;
        
        chrome.storage.local.set({'researchNotes':notes}, function(){
            showresult('Notes saved successfully!', 'success');
        });
    } catch (error) {
        showresult('Error saving notes: ' + error.message, 'error');
    } finally {
        // Reset button state
        button.innerHTML = originalContent;
        button.disabled = false;
    }
}

function showresult(content, type = 'success') {
    const resultsDiv = document.getElementById('results');
    const iconClass = type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
    const messageClass = type === 'error' ? 'error-message' : 'success-message';
    
    resultsDiv.innerHTML = `
        <div class="${messageClass}">
            <i class="${iconClass}"></i>
            <span>${type === 'error' ? 'Error' : 'Success'}</span>
        </div>
        <div class="result-item">
            <div class="result-content">${content}</div>
        </div>
    `;
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Theme management functions
function initializeTheme() {
    // Get saved theme from localStorage or default to light
    chrome.storage.local.get(['theme'], function(result) {
        const savedTheme = result.theme || 'light';
        setTheme(savedTheme);
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Save theme preference
    chrome.storage.local.set({'theme': newTheme});
}

function setTheme(theme) {
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    
    // Set theme attribute
    html.setAttribute('data-theme', theme);
    
    // Update icon
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeIcon.parentElement.title = 'Switch to light mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeIcon.parentElement.title = 'Switch to dark mode';
    }
}