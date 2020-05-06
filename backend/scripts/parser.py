import pandas as pd
import sys
import os
import io
import requests
import json

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
car = valid.loc[valid[10] == 1]
truck = valid.loc[valid[10] == 2]
bus = valid.loc[valid[10] == 3]
# print(c.columns)
# print(c[2].sum())
result = {
  "cars": car.shape[0],
  "trucks": truck.shape[0],
  "busses": bus.shape[0]
}
json_formatted = json.dumps(result)
print(json_formatted)
