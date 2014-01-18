require 'rubygems'
require 'json'

##############
## SETTINGS ##
##############
# 1 Directory where the documentation is; set relative to this file
$docDir = "documentation"
# 2 Languages supported - language followed by file extension
$languages = [
  ["curl", "curl"],
  ["ruby", "rb"]
]


##################
## SCRIPT START ##
##################

$rootDir = Dir.pwd

# First, let's preserve the old api file in case something goes wrong
File.delete "app/data/docs_old.json" if File.exist?("app/data/docs_old.json")
File.rename "app/data/docs.json", "app/data/docs_old.json" if File.exist?("app/data/docs.json")

def build_api_map(depth, currdir)
  Dir.chdir currdir

  #depth = directory_depth(currdir, topdir)
  map = {}

  if depth == 0
    map[:languages] = []
    $languages.each do |l|
      map[:languages].push(l[0])
    end
  end

  if depth > 0
    map[:title] = File.basename(currdir).gsub(/^\d\d-/, '').gsub('-', ' ')
    map[:link] = File.basename(currdir).gsub(/^\d\d-/, '').downcase
    map[:directoryPath] = $docDir + File.expand_path(currdir).split($docDir)[1]
  end

  
  print "depth:",depth," currdir:",currdir,"\n"

  map[:superSections] = [] if depth == 0
  map[:sections] = [] if depth == 1
  map[:subSections] = [] if depth == 2
  Dir.glob("*").each do |filename|

    print "file:",filename,"\n"

    # If it's a directory, it signals a new section
    # so we need particular keys in the JSON file
    if File.directory? filename
      puts "directory"
      newdepth = depth + 1
      map[:superSections].push(build_api_map(newdepth, filename)) if depth == 0
      map[:sections].push(build_api_map(newdepth, filename))  if depth == 1
      map[:subSections].push(build_api_map(newdepth, filename))  if depth == 2

    # Now we check if the file is a description file
    elsif File.basename(filename).split(".")[0] == "description"
      puts "desc"
      map[:description] = $docDir + File.expand_path(filename).split($docDir)[1]

    # Next we look at the example files
    elsif File.basename(filename).split(".")[0] == "example"
      puts "example"

      fileExt = filename.split(".")[1]

      $lang_key = ""
      $languages.each do |lang|
        $lang_key = lang[0] if fileExt == lang[1]
      end

      map[$lang_key] = $docDir + File.expand_path(filename).split($docDir)[1]

    end

  end
  Dir.chdir "../"
  
  return map
end


# Finally, we call the function to initiate the JSON compile
# add_api_info($docDir)
$api_hash = build_api_map(0, $docDir)

# Then we move back to the root directory and write the JSON file
Dir.chdir $rootDir
File.open("app/data/docs.json", "w+") do |file|
  file.write(JSON.pretty_generate($api_hash))
end
