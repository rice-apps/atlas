import httplib
import xml.etree.ElementTree as ET
import json


def read_data(course_url):
  """
  Given the specific url extension, retreives the XML describing all of the courses for a given semester.

  Example input:
  course_url = 'admweb/!SWKSECX.main?term=201420&title=&course=&crn=&coll=&dept=&subj='
  """

  connection = httplib.HTTPSConnection('courses.rice.edu', 443)
  connection.connect()
  connection.request(
      'GET',
      course_url
  )
  courses_xml = connection.getresponse()
  return courses_xml

def translate_to_parse(course):
  """
  Given a well-formed XElement object representing a course, formats it into JSON such that it can be sent
  to Parse.
  """

  
  return ""

def write_data(f_name, data):
  """
  Given an output data object, writes as JSON to the specified output file
  name f_name.
  """
  json_data = json.dumps(data, indent=2)
  out = open(f_name, 'w')
  out.write(json_data)
  out.close()

def main():
  course_url = sys.argv[1]
  input_data = read_data(course_url)
  # Convert XML string to XElement tree
  courses_parsed = ET.fromstring(input_data)
  output_data = [translate_to_parse(course) for course in courses_parsed]
  write_data('courses_data_parse.json', output_data)

if __name__ == '__main__':
  main()