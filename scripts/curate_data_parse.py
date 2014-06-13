"""
This script curates the Places data in a format compatible with the Place class
in the Parse Rice Maps Data store.

Input File: places_data.json
Output File: places_data_parse.json
"""
import json


def read_data(f_name):
  """
  Given an input file name f_name, reads the JSON data inside returns as
  Python data object.
  """
  f = open(f_name, 'r')
  json_data = json.loads(f.read())
  f.close()
  return json_data

def write_data(f_name, data):
  """
  Given an output data object, writes as JSON to the specified output file
  name f_name.
  """
  json_data = json.dumps(data)
  out = open(f_name, 'w')
  out.write(json_data)
  out.close()


def translate_to_parse(place):
  """
  Given a python dictionary place, translates the data format to make it
  compatible with the Parse class.

  Example Input:
  {
    "name":"Anderson Biological Laboratories, M.D.",
    "type":"building",
    "abbreviation":"ABL",
    "location":{
        "latitude":"29.718644",
        "longitude":"-95.402363"
  }

  Example Output:
  {
    "name": "Anderson Biological Laboratories, M.D.",
    "types": [],
    "symbol": "ABL",
    "location": {"__type":"GeoPoint","latitude":29.718644,"longitude":-95.402363},
    "geometryType": "GeoPoint"
  }
  """

  out = {}
  out["name"] = place["name"]
  out["types"] = []
  out["symbol"] = place["abbreviation"]
  out["location"] = {"__type":"GeoPoint",
                     "latitude":float(place["location"]["latitude"]),
                     "longitude":float(place["location"]["longitude"])}  
  assign_type(out)

def levenshtein(s1, s2):
  """
  Given two strings s1 and s2, returns the levenshtein
  distance between the two strings.
  Credit: http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance
  """

  if len(s1) < len(s2):
    return levenshtein(s2, s1)
 
  # len(s1) >= len(s2)
  if len(s2) == 0:
    return len(s1)
 
  previous_row = xrange(len(s2) + 1)
  for i, c1 in enumerate(s1):
    current_row = [i + 1]
    for j, c2 in enumerate(s2):
      insertions = previous_row[j + 1] + 1 # j+1 instead of j since previous_row and current_row are one character longer
      deletions = current_row[j] + 1       # than s2
      substitutions = previous_row[j] + (c1 != c2)
      current_row.append(min(insertions, deletions, substitutions))
    previous_row = current_row
 
  return previous_row[-1]



def assign_type(obj):
  """
  Given a dictionary objs, iterates through objs, matching the name of
  each object in obj to a name-type pair in the types (from types.json)
  by levenshtein distance and assigning the matching type value to obj
  """
 
  json_text = open("types.json").read()
  types = json.loads(json_text)
 
  optimal_type = ""
  optimal_score = float('inf')
  for type_pair in types:
    score = levenshtein(type_pair["name"], obj["name"])
    if score < optimal_score: optimal_type = type_pair["type"]
  obj["type"] = optimal_type
 


def main():
  input_data = read_data('places_data.json')
  output_data = [translate_to_parse(place) for place in input_data]
  write_data('places_data_parse.json', output_data)

if __name__ == '__main__':
  main()
