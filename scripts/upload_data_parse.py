"""
This script uploades the Places data to the Parse data store.

Usage: python cureate_data_parse.py \
  <data json filename> <application id> <rest api key>
"""

import json, httplib, sys


def main():
  print sys.argv
  f_name = sys.argv[1]
  app_id = sys.argv[2]
  rest_api_key = sys.argv[3]

  f = open(f_name, 'r')
  data = json.loads(f.read())
  connection = httplib.HTTPSConnection('api.parse.com', 443)
  connection.connect()
  results = []
  for place in data:
    connection.request(
      'POST',
      '/1/classes/Place',
      json.dumps(place),
      {"X-Parse-Application-Id": app_id, "X-Parse-REST-API-Key": rest_api_key}
    )
    result = json.loads(connection.getresponse().read())
    results.append(result)
    print result

  f_out = open('upload_results.json', 'w')
  f_out.write(json.dumps(results, indent=2))
  f_out.close()

if __name__ == '__main__':
  main()

