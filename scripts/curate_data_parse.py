"""
This script curates the Places data in a format compatible with the Place class
in the Parse Rice Maps Data store.

Input File: places_data.json
Output File: places_data_parse.json
"""


def read_data(f_name):
  """
  Given an input file name f_name, reads the JSON data inside returns as
  Python data object.
  """
  pass

def write_data(f_name, data):
  """
  Given an output data object, writes as JSON to the specified output file
  name f_name.
  """
  pass

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
  pass

def main():
  input_data = read_data('places_data.json')
  output_data = [translate_to_parse(place) for place in input_data]
  write_data('places_data_parse.json', output_data)