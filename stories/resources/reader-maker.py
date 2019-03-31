import json
import os
import re

with open('read-template.html', 'r') as file:
    read_template = file.read()

file_var_regex = re.compile('\\$\\{([^}]*)\\}')

story_folder_path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))

story_folders = os.listdir('..')
story_folders = filter(lambda path: path != 'resources', story_folders)
story_folders = map(lambda path: '../' + path, story_folders)
story_folders = filter(lambda path: os.path.isdir(path), story_folders)

def load_json(file_path):
    with open(file_path) as json_file:
        return json.load(json_file)

def escape_quotes(str):
    return str.replace('"', '\\"')

for story_folder in story_folders:
    storyMetadata = load_json(story_folder + '/metadata.json')
    file_vars = re.findall(file_var_regex, read_template)
    file_output = read_template
    for file_var in file_vars:
        eval_var = eval(file_var)
        file_output = file_output.replace('${' + file_var + '}', eval_var)
    with open(story_folder + "/read.html", "w") as file:
        file.write(file_output)