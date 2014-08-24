import httplib
import xml.etree.ElementTree as ET
import json


def read_data(term):
  """
  Given the specific term, retreives the XML describing all of the courses for a given semester.

  Example input:
  term = '201420'
  """

  course_url = '/admweb/!SWKSECX.main?term='+ term + '&title=&course=&crn=&coll=&dept=&subj='
  connection = httplib.HTTPSConnection('courses.rice.edu', 443)
  connection.connect()
  connection.request(
      'GET',
      course_url
  )
  courses_xml = connection.getresponse()
  return courses_xml



def get_parse_section(course):
  """
  Given a well-formed XElement object representing a course, creates a Section object in JSON such that it can be sent
  to Parse. See JS XElement docs for explanation of use.
  """
  
  var section = {}
  section["courseNumber"] = course.get("course-number")
  section["sectionNumber"] = course.get("section")
  section["crn"] = course.get("crn")
  section["startTime"] = course.get("start-time")
  section["endTime"] = course.get("end-time")
  section["meetingDays"] = course.get("meeting-days")
  section["location"] = course.get("location")
  # TODO write function to create Place attribute pointer based on location string

  return section



def get_parse_course(course):

  var parse_course = {}
  parse_course["termCode"] = course.get("term-code")
  parse_course["termDescription"] = course.get("term-description")
  parse_course["subject"] = course.get("course-number")
  parse_course["school"] = course.get("school")
  parse_course["department"] = course.get("department")
  parse_course["title"] = course.get("title")
  parse_course["description"] = course.get("description")
  parse_course["creditHours"] = course.get("credit-hours")
  parse_course["distGroup"] = course.get("distribution-group")

  return course


def get_parse_courses(courses_tree):
  """
  Keeps track of parse Course objects in a dictionary to avoid duplicates from the XML data
  """

  courses = {}
  for course in courses_tree:
    parse_course = get_course(course)
    parse_course_title = parse_course[subject] + " " + parse_course[courseNumber]
    if parse_course_title not in courses:
      courses[parse_course_title] = parse_course

  return courses




def upload_data(sections, courses, pp_id, rest_api_key):
  """
  Given a list of sections and courses, creates, updates, and deletes the courses in parse based on 
  their current states. 
  """
  
  return ""



def main():
  """
  Note: the XML data queried in this script does not differentiate between courses and sections. For
  our purposes, we have two classes in Parse: Section, which represents a specific meeting of the class
  (with specific teacher, meeting schedule and location), and Course, which represents a course like PHYS 
  101 and all of the attributes that every section shares.
  """

  term = sys.argv[1]
  pp_id = sys.argv[2]
  rest_api_key = sys.argv[3]

  input_data = read_data(course_url)

  # Convert XML string to XElement tree
  courses_tree = ET.fromstring(input_data)

  # List of sections and courses provided by courses.rice.edu
  sections = [get_parse_section(course) for course in courses_tree]
  courses = get_parse_courses(courses_tree)

  # Update the course and section tables in parse
  upload_data(sections, courses, pp_id, rest_api_key)

if __name__ == '__main__':
  main()