"""
This script creates a containsWithin relation between Place objects. 
The main function contains a hard-coded list of relevant objectIds. The results
are written to the file relation_results.json.

"""


import sys, httplib, json

def curl(child, parent, parse_app_id, rest_api_key):
  """
  Given the Parse objectId for a parent and child, with the App ID 
  and the REST API key, adds the parent object to the containedWithin 
  relation of the child.
  """

  connection = httplib.HTTPSConnection('api.parse.com', 443)
  connection.connect()
  
  connection.request(
    'PUT',
    '/1/classes/Place/' + child,
    json.dumps({"containedWithin":{"__op":"AddRelation","objects":[{"__type":"Pointer","className":"Place","objectId":parent}]}}),
    {
      "X-Parse-Application-Id": parse_app_id,
      "X-Parse-REST-API-Key": rest_api_key,  
      "Content-Type": "application/json"
    }
  )
  return json.loads(connection.getresponse().read())

  



def main():
  print sys.argv
  parse_app_id = sys.argv[1] 
  rest_api_key = sys.argv[2]
 
  # Contains objectId of parents mapped to list of objectIds of children
  parent_child_dict = {
    "rm7nkk638L": ["EWGOudMC7A"],
    "RejEOCAJMw": ["HwCOap9AHY"],
    "qcbqDStDzc": ["fW1WeyxioQ"],
    "EJHLUOqrMp": ["gMuAyjJ1w2"],
    "RnKfSYdgsv": ["apHNzGZnzp"],
    "WpRoJ9rATo": ["yexfOfyfgv"],
    "GgeFvwDQbn": ["V81vX9YI9D"],
    "3lLJykP6jR": ["YMQFKOJ5WC"],
    "eKUivm7MDg": ["z3QNtnl4Js"],
    "ajQfyDwdOD": ["LLxNNyJQjT"],
    "d0kkrmV2Gy": ["q1zBq3XZJB"],
    "fynArVxZGC": ["EUWxh5Z542"],
    "UL4zXw9qHP": ["YQ9LqeT20V", "cJuDmLLFj8", "KHqJxCZemt"],
    "pPFTyEQ67N": ["GRBJ92j5ZP"],
    "PCdsVOHdh6": ["dMLD0xsZPR"],
    "yAbcTsBmJw": ["G93e9hoYVn"]
  }
  
  results = []
  
  for parent in parent_child_dict:
  	for child in parent_child_dict[parent]:
  		results.append(curl(child, parent, parse_app_id, rest_api_key))
        
  f_out = open('relation_results.json', 'w')
  f_out.write(json.dumps(results, indent=2))
  f_out.close()

if __name__ == '__main__':
  main()
