import json
import os

story_folder_path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))

story_folders = os.listdir('..')
story_folders = filter(lambda path: path != 'resources', story_folders)
story_folders = map(lambda path: '../' + path, story_folders)
story_folders = filter(lambda path: os.path.isdir(path), story_folders)
story_folders = map(lambda path: path + '/metadata.json', story_folders)

def load_json(file_path):
    with open(file_path) as json_file:
        return json.load(json_file)

json_files = map(load_json, story_folders)
json_files = filter(lambda story_metadata: story_metadata['is_listed'], json_files)
json_files = list(json_files)

with open('story-listing.json', 'w') as file:
    file.write(json.dumps(json_files, indent=4))
with open('story-listing.minified.json', 'w') as file:
    file.write(json.dumps(json_files, separators=(',', ':')))