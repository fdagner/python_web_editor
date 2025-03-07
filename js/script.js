document.addEventListener("DOMContentLoaded", function () {
  // Initialize first Ace Editor 
  window.editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/python");

  // Initialize second Ace Editor
  window.editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.session.setMode("ace/mode/python");
  editor2.setReadOnly(true);  // Make second editor read-only

  // Store breakpoints
  let breakpoints = new Set();

  // Function for retrieving the parameter from the URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Get file name from the URL (e.g. ?file=myscript.py)
  const filename = getQueryParam("file");
  const storageKey = filename ? `python_code_${filename}` : "python_code_default";

  // Add breakpoint toggle functionality
  editor.on("guttermousedown", function (e) {
    const target = e.domEvent.target;

    if (target.className.indexOf("ace_gutter-cell") === -1) {
      return;
    }

    // Get the clicked row (line number - 1 because Ace uses 0-based indexing)
    const row = e.getDocumentPosition().row;

    // Remove all existing breakpoints
    editor.session.clearBreakpoints();

    // Add the new breakpoint (if it wasn't already set)
    if (!breakpoints.has(row)) {
      breakpoints.clear(); // Clear any previous breakpoints
      breakpoints.add(row);
      editor.session.setBreakpoint(row);
    } else {
      // If the breakpoint exists, remove it
      breakpoints.clear();
      editor.session.clearBreakpoints();
    }

    // Save the current breakpoint to localStorage
    localStorage.setItem(`${storageKey}_breakpoints`, JSON.stringify([...breakpoints]));

    e.stop(); // Prevent other events

    // Sync the second editor with code up to breakpoint
    syncEditorWithBreakpoint();
  });

  // Sync the second editor with code up to breakpoint
  function syncEditorWithBreakpoint() {
    const code = editor.getValue();
    const breakpointLine = [...breakpoints].pop(); // Get the last breakpoint (if any)
    if (breakpointLine !== undefined) {
      const codeUntilBreakpoint = code.split("\n").slice(0, breakpointLine + 1).join("\n");
      editor2.setValue(codeUntilBreakpoint, -1);
    } else {
      editor2.setValue(code, -1); // Show all code if no breakpoint
    }
  }

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
          syncEditorWithBreakpoint();  // Sync second editor after loading
        })
        .catch(error => console.error("Fehler beim Laden der Datei:", error));
    }
  }

  // Automatically save changes in the editor
  editor.session.on("change", function () {
    localStorage.setItem(storageKey, editor.getValue());
    syncEditorWithBreakpoint();  // Sync the second editor when code changes
  });

  // Load code at startup
  loadCode();

  // Reset button: Reset Editor and Local Storage
  document.getElementById("reset").addEventListener("click", function () {
    localStorage.removeItem(storageKey);
    document.getElementById("output").textContent = "Ausgabe wird hier angezeigt...";
    editor.setValue("");
    editor2.setValue("");

    // Clear all breakpoints
    breakpoints.clear();
    editor.session.clearBreakpoints();
    editor2.setValue(""); // Clear second editor

    if (filename) {
      fetch(`py/${filename}`)
        .then(response => {
          if (!response.ok) throw new Error("File could not be loaded");
          return response.text();
        })
        .then(code => {
          editor.setValue(code, -1);
          syncEditorWithBreakpoint();  // Sync second editor after loading
        })
        .catch(error => console.error("Error loading file:", error));
    }
  });

  document.getElementById("download").addEventListener("click", function () {
    const filename = getQueryParam("file") || "code.py";
    const code = editor2.getValue();  // Download the code from editor2
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  });

  // Optional: Load stored breakpoints from localStorage
  const storedBreakpoints = localStorage.getItem(`${storageKey}_breakpoints`);
  if (storedBreakpoints) {
    breakpoints = new Set(JSON.parse(storedBreakpoints));
    breakpoints.forEach(row => editor.session.setBreakpoint(row));
    syncEditorWithBreakpoint();  // Sync second editor with existing breakpoints
  }

  // Save breakpoints when they change
  editor.session.on("changeBreakpoint", function () {
    localStorage.setItem(`${storageKey}_breakpoints`, JSON.stringify([...breakpoints]));
  });
});
