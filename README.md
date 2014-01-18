riq_dev
=======

Code for developer.relateiq.com


### Compiling JSON

1. Clone repo
2. cd into repo directory
3. (only to update documentation) run 'ruby compile.rb'

### Settings

- All settings are at the top of the compile file: 'compile.rb'. Explanation of the settings is found there as well.
- Otherwise, simply update the documentation by adding or changing documents in the 'documentation' directory
- Order of sections is handled by prepending numbers to the directories. E.g., '01-API'
- First level directories are super-sections, second level are sections, third level are sub-sections
- Each directory can have one 'explanation.html' file
- Each directory can have as many example files as there are supported languages. E.g., 'example.curl', 'example.rb', 'example.py', etc.
- **remember to run 'ruby compile.rb' after updating documentation**


### Styles

- Sass files are in app/sass
- Compiled css is in app/css
- It is highly recommended that you make edits in the Sass file and compile. Editing the css directly may result in edits being overriden by the Sass compile.
- See installing dev tools below

### Installing Dev Tools (optional)

1. cd into directory
2. Run 'bundle install'
3. Run 'compass watch' (compiles Sass)
