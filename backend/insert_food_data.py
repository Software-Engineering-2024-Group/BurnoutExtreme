import apps
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
app = apps.App()
mongo = app.mongo

f = open('../food_data/calories.csv', 'r', encoding="ISO-8859-1")
l = f.readlines()

for i in range(1, len(l)):
    l[i] = l[i][1:len(l[i]) - 2]

for i in range(1, len(l)):
    temp = l[i].split(",")
    mongo.db.food.insert_one({'food': temp[0], 'calories': temp[1]})
