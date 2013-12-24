##############
## SETTINGS ##
##############
# 1 Directory where the documentation is; set relative to this file
$docDir = "documentation"
# 2 Languages supported - language followed by file extension
$languages = [
  ["curl", "curl"],
  ["ruby", "rb"],
  ["python", "py"],
  ["php", "php"],
  ["java", "java"],
  ["node", "node"]
]



##################
## SCRIPT START ##
##################

$rootDir = Dir.pwd

# First, let's preserve the old api file in case something goes wrong
File.delete "api_old.json" if File.exist?("api_old.json")
File.rename "api.json", "api_old.json" if File.exist?("api.json")

# Start building up our json file
$api_text = '{'

# We need a function to get the depth of a file 
# relative to a starting directory
# This is needed for the tabbing and for closing tags
def directory_depth(file, startDir)

  relPath = File.expand_path(file).split(startDir)[1]
  depth = relPath.split("/").length - 1
  return depth

end

# This is the meet and potatoes of the script
def add_api_info(directory)

  # Move into the directory
  Dir.chdir directory

  # Add first two lines
  $api_text += "\n\"superSections\":[\n{"
  # Need a few variables to track how we're moving in the directory tree
  depth = 1
  depth1 = 1

  # Move recursively through all files and directories
  Dir.glob("**/**/**/**/*").each do |filename|

    # Use the depth function to get the file's depth
    depth = directory_depth(filename, directory)

    # This checks if we've moved back in the directory tree
    # and closes the tag if we have
    if depth < depth1
      if depth1 - depth == 1
        $api_text = $api_text[0...-1]
        $api_text += "\n},"
      elsif depth1 - depth == 2
        $api_text = $api_text[0...-1]
        $api_text += "\n}\n]\n}\n],"
      elsif depth1 - depth == 3
        $api_text = $api_text[0...-1]
        $api_text += "\n}\n]\n},"
      end
      depth1 = depth1 - 1
    end
    new_line = "\n" + "\""

    # If it's a directory, it signals a new section
    # so we need particular keys in the JSON file
    if File.directory? filename

      if File.basename(filename)[0..1] == "01"
        $api_text += new_line + "sections\":[\n{" if depth == 2
        $api_text += new_line + "subSections\":[\n{" if depth == 3
      else
        $api_text += "\n{"
      end

      $api_text += "\n" + "\"" + "title\":\"#{File.basename(filename).gsub(/^\d\d-/, '').gsub('-', ' ')}\","
      $api_text += "\n" + "\"" + "directoryPath\":\"#{File.expand_path(filename)}\","

    # Now we check if the file is a description file
    elsif File.basename(filename).split(".")[0] == "description"
      
      $api_text += new_line + "description\":\""
      $api_text += File.expand_path(filename).split($docDir)[1]
      $api_text += "\","

    # Next we look at the example files
    elsif File.basename(filename).split(".")[0] == "example"

      fileExt = filename.split(".")[1]

      $languages.each do |lang|
        $api_text += new_line + lang[0] + "\":" if fileExt == lang[1]
      end

      $api_text += "\"" 
      $api_text += File.expand_path(filename).split($docDir)[1]
      $api_text += "\","

    end

    depth1 = depth

  end

  # This closes all the tags at the end of the file
  $api_text = $api_text[0...-1]
  while depth > 1
    $api_text += "\n}"
    $api_text += "\n]" if depth.odd?
    depth = depth - 1
  end
  $api_text += "\n]\n}"

end

# Finally, we call the function to initiate the JSON compile
add_api_info($docDir)

# Then we move back to the root directory and write the JSON file
Dir.chdir $rootDir
File.open("api.json", "w+") do |file|
  file.write($api_text)
end