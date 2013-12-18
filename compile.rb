currentDir = Dir.pwd

# First, let's preserve the old api file in case something goes wrong
File.delete "api_old.json" if File.exist?("api_old.json")
File.rename "api.json", "api_old.json" if File.exist?("api.json")

# Start building up our json file
api_text = '{'

# Move into the documentation directory
Dir.chdir "documentation"

# Start iterating over these files
Dir.glob('**').each do |filename|

  if File.directory? filename
    api_text += "\n\"superSection\":{"
    api_text += "\n\"title\":\"#{File.basename(filename)}\""
    api_text += ",\n\"directoryPath\":\"#{File.absolute_path(filename)}\""

  end

  api_text += "\n}"
end

api_text += "\n}"

Dir.chdir "../"

File.open("api.json", "w+") do |file|
  file.write(api_text)
end