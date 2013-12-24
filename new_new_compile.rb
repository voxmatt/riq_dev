require 'rubygems'
require 'json'

def directory_hash(path, name=nil)
  data = {:data => (name || path)}
  data[:children] = children = []
  Dir.foreach(path) do |entry|
    next if (entry == '..' || entry == '.')
    full_path = File.join(path, entry)
    if File.directory?(full_path)
      children << directory_hash(full_path, entry)
    else
      children << entry
    end
  end

  text = data.to_json
  
  File.open("api.json", "w+") do |file|
    file.write(text)
  end
end

directory_hash("documentation")