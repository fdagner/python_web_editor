# Python Web Editor

This is a simple Python editor that allows users to write, run, and download Python code directly in the browser using [Brython](https://brython.info/). It integrates a code editor using the [Ace Editor](https://ace.c9.io/) and supports features like loading and saving code, fullscreen mode, and code execution with Brython.

This project is not intended for production use but is designed for **educational purposes**, such as in classrooms or learning environments. It can be useful for quick Python exercises, demonstrations, or as a teaching aid, but it is not optimized for real-world application development.

## Features

1. **Code Editing with Ace Editor**  
   The editor uses Ace Editor with syntax highlighting for Python. You can write and edit Python code directly in the browser.

2. **Automatic Code Saving**  
   Code is automatically saved in the local storage of your browser, so you won't lose your progress. When you load the page again, the editor will restore the saved code.

3. **File Handling**  
   - If a `file` parameter is provided in the URL (e.g., `?file=myscript.py`), it loads the corresponding file from the `py/` directory on the server.
   - You can download the code as a `.py` file using the download button.

4. **Run Python Code**  
   Python code can be executed directly in the browser using Brython. When you click the **Run** button, the code will be executed, and the output will be displayed in the output section. Any errors will also be shown.

5. **Reset Function**  
   The **Reset** button clears the editor and removes the saved code from local storage. It will attempt to reload the file from the server (if available).

6. **Fullscreen Mode**  
   You can toggle fullscreen mode by clicking the **Fullscreen** button, allowing you to maximize the editor for a better coding experience.

7. **Code Output**  
   The output of the executed code will be displayed in the "Output" section. If there are any errors in the code, they will be shown here as well.

## Usage

1. Open the editor in your browser.
2. Write your Python code in the editor window.
3. Click **Run** to execute the code. The output will appear in the "Output" section.
4. Click **Reset** to clear the editor and output.
5. Click **Download** to download your code as a `.py` file.
6. Toggle fullscreen mode using the **Fullscreen** button for a larger editor view.

## File Structure

- `index.html`: The main HTML file with the editor and code execution functionality.
- `js/`: Contains the JavaScript files needed for Brython, Ace Editor, and other functionalities.
- `css/`: Contains styles for the page layout.
- `py/`: Directory where Python files can be loaded from and saved to.
- `script.js`: JavaScript file with the logic for editor setup, saving/loading code, and handling interactions.
- `brython.min.js` and `brython_stdlib.js`: Brython JavaScript files for running Python in the browser.

## Requirements

- A modern web browser with support for JavaScript and local storage.

## TODOs

- **Improve Mobile View**: Enhance the layout and functionality of the editor for mobile devices, ensuring a smooth and responsive experience.
- **Enhance Fullscreen Mode**: Improve fullscreen mode handling to better adjust the layout for different screen sizes and prevent UI issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
