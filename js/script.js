document.addEventListener("DOMContentLoaded", function () {
  // Initialize Ace Editor
  window.editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/python");

  // Function for retrieving the parameter from the URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /// Get file name from the URL (e.g. ?file=myscript.py)
  const filename = getQueryParam("file");
  const storageKey = filename ? `python_code_${filename}` : "python_code_default";

  // Load code from local storage or file
  function loadCode() {
    const storedCode = localStorage.getItem(storageKey);
    if (storedCode) {
      editor.setValue(storedCode, -1);
    } else if (filename) {
      fetch(`py/${filename}`)
        .then(response => {
          if (!response.ok) throw new Error("Datei konnte nicht geladen werden");
          return response.text();
        })
        .then(code => {
          editor.setValue(code, -1);
        })
        .catch(error => console.error("Fehler beim Laden der Datei:", error));
    }
  }

  // Automatically save changes in the editor
  editor.session.on("change", function () {
    localStorage.setItem(storageKey, editor.getValue());
  });

  // Load code at startup
  loadCode();

  // Reset button: Reset Editor and Local Storage
  document.getElementById("reset").addEventListener("click", function () {
    localStorage.removeItem(storageKey);
    document.getElementById("output").textContent = "Ausgabe wird hier angezeigt...";

    // Always reset editor before attempting to load a file
    editor.setValue("");

    if (filename) {
      // Reload file
      fetch(`py/${filename}`)
        .then(response => {
          if (!response.ok) throw new Error("File could not be loaded");
          return response.text();
        })
        .then(code => {
          editor.setValue(code, -1);
        })
        .catch(error => console.error("Error loading file:", error));
    }
  });


  // Activate/deactivate full screen mode
  document.getElementById("fullscreen").addEventListener("click", function () {
    const element = document.documentElement;
    const fullscreenButton = document.getElementById("fullscreen");

    if (document.fullscreenElement) {
      document.exitFullscreen();
      document.body.classList.remove("fullscreen");
      fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    } else {
      element.requestFullscreen();
      document.body.classList.add("fullscreen");
      fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
    }
  });

  // Monitors the end of full screen mode
  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
      document.body.classList.remove("fullscreen");
      document.getElementById("fullscreen").innerHTML = '<i class="fas fa-expand"></i>';
    }
  });

  // Execute code with Brython
  document.getElementById("run").addEventListener("click", function () {
    const outputDiv = document.getElementById("output");
    outputDiv.textContent = "Code wird ausgeführt...";

    try {
      __BRYTHON__.run_script(editor.getValue());
    } catch (error) {
      outputDiv.textContent = `Fehler: ${error}`;
    }


  });
  document.getElementById("download").addEventListener("click", function () {
    const filename = getQueryParam("file") || "code.py";
    const code = editor.getValue();
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  });

});
