import pandas as pd
import sys
import os
import io
import requests
import json

def hourlist(data):
  list=[]
  for x in range(24):
    hour1 = valid.loc[(valid[3] == x) & (valid[9] == 1)]
    hour2 = valid.loc[(valid[3] == x) & (valid[9] == 2)]
    result = {
      "way1": hour1.shape[0],
      "way2": hour2.shape[0]
    }
    list.append(result)
  return list

year = sys.argv[1]
ely = sys.argv[2]
lam_id = sys.argv[3]
year_short = year[-2:]
day = sys.argv[4]
url = "https://aineistot.vayla.fi/lam/rawdata/{0}/{1}/lamraw_{2}_{3}_{4}.csv".format(
    year, ely, lam_id, year_short, day)
s = requests.get(url).content
c = pd.read_csv(io.StringIO(s.decode('utf-8')), sep=';', header=None)

valid = c.loc[c[12] == 0]
car = valid.loc[(valid[10] == 1) | (valid[10] == 6) | (valid[10] == 7)]
truck = valid.loc[(valid[10] == 2) | (valid[10] == 4) | (valid[10] == 5)]
bus = valid.loc[valid[10] == 3]
# print(valid)
# print(c[2].sum())

result = {
    "total": {
        "cars": car.shape[0],
        "trucks": truck.shape[0],
        "busses": bus.shape[0],
        "total": valid.shape[0]
    },
    "hourly": hourlist(valid)
}
json_formatted = json.dumps(result)
print(json_formatted)
