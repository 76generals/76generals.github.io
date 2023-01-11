// Modal dialog event handlers
try {
  var modale = document.getElementById('encryptModal');
  var btne = document.getElementById('encryptButton');
  var spane = document.getElementsByClassName('closee')[0];
  var modald = document.getElementById('decryptModal');
  var btnd = document.getElementById('decryptButton');
  var spand = document.getElementsByClassName('closed')[0];

  btne.addEventListener('click', function() {
    modale.style.display = 'block';
  });
  btnd.addEventListener('click', function() {
    modald.style.display = 'block';
  });

  spane.addEventListener('click', function() {
    modale.style.display = 'none';
    document.getElementById('en-file-input').value = '';
    document.getElementById('en-password-input').value = '';
  });
  spand.addEventListener('click', function() {
    modald.style.display = 'none';
    document.getElementById('de-file-input').value = '';
    document.getElementById('de-password-input').value = '';
  });

  window.addEventListener('click', function(e) {
    if (e.target == modale) {
      modale.style.display = 'none';
    }
    if (e.target == modald) {
      modald.style.display = 'none';
    }
  });
} catch (error) {
  console.error('Error setting up modal dialog event handlers:', error);
}

document.getElementById('process-encrypt').addEventListener('click', function() {
  // Get the file and password from the form
  var file = document.getElementById('en-file-input').files[0];
  var password = document.getElementById('en-password-input').value;

  // Encrypt the file
  encryptFile(file, password);
});


function encryptFile(file, password) {
  // Check if the File API is supported by the browser
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('file:', file);
    console.log('password:', password);

    // Check if a file was selected
    if (!file) {
      alert('No file was selected. Please select a file to encrypt.');
      return;
    }

    // Check if the password is long enough
    if (!password || password.length < 5) {
      alert('Please enter a password with at least 5 characters.');
      return;
    }

    // Create a FileReader object
    var reader = new FileReader();
    // Set up an event handler function to be called when the file has been read
    reader.onload = function(event) {
      // Get the file contents
      var fileContent = event.target.result;

      // Encrypt the file contents using the password
      var encrypted = CryptoJS.RC4.encrypt(fileContent, password);

      console.log(encrypted.toString());

      if (confirm("File successfully encrypted! Do you want to save the encrypted file?")) {
        saveAs(new Blob([encrypted], { type: file.type }), file.name + '.encrypted');
      }
      document.getElementById('en-file-input').value = '';
      document.getElementById('en-password-input').value = '';
    };

    // Set up an event handler function to be called when an error occurs
    reader.onerror = function(event) {
      console.error("An error occurred while reading the file: " + event.target.error.name);
      alert("An error occurred while reading the file. Please try again.");
    };

    // Read the file as a binary data buffer
    reader.readAsDataURL(file);
  } else {
    alert('The File APIs are not fully supported by your browser.');
  }
}

document.getElementById('process-decrypt').addEventListener('click', function() {
  // Get the file and password from the form
  var file = document.getElementById('de-file-input').files[0];
  var password = document.getElementById('de-password-input').value;

  // Decrypt the file
  decryptFile(file, password);
});

function decryptFile(file, password) {
  // Check if the File API is supported by the browser
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('file:', file);
    console.log('password:', password);

    // Check if a file was selected
    if (!file) {
      alert('No file was selected. Please select a file to decrypt.');
      return;
    }

    // Check if the password is long enough
    if (!password || password.length < 5) {
      alert('Please enter a password with at least 5 characters.');
      return;
    }
    // Create a FileReader object
    var reader = new FileReader();
    // Set up an event handler function to be called when the file has been read
    reader.onload = function(event) {
      // Get the file contents
      var fileContent = event.target.result;

      // Decrypt the file contents using the password
      var decrypted = CryptoJS.RC4.decrypt(fileContent, password).toString(CryptoJS.enc.Latin1);

      if(!/^data:/.test(decrypted)){
        alert("Invalid pass phrase or file! Please try again.");
        return false;
      }

      console.log(decrypted);
      if (confirm("File successfully decrypted! Do you want to save the decrypted file?")) {
        saveAs(new Blob([decrypted], { type: file.type }), file.name.replace(/.*(\.\w+)/, file.name +".txt"));    
      }
      document.getElementById('de-file-input').value = '';
      document.getElementById('de-password-input').value = '';
    };

    // Set up an event handler function to be called when an error occurs
    reader.onerror = function(event) {
      console.error("An error occurred while reading the file: " + event.target.error.name);
      alert("An error occurred while reading the file. Please try again.");
    };

    // Read the file as a text file
    reader.readAsText(file);
  } else {
    alert('The File APIs are not fully supported by your browser.');
  }
}

