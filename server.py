import csv
import json

from flask import Flask
app = Flask(__name__)


# serve the data as a list of JSON objects
@app.route('/data.json')
def data():
    with open('data.csv') as data:
        # parse csv
        reader = csv.DictReader(data)
        # dump as json for easier handling in JS
        return json.dumps(list(reader))


# serve the page with the source linked
@app.route('/')
def root():
    return '''
    <script src="//cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.11.0/d3.js"></script>
    <script src="/main.js"></script>
    '''


# serve the actual JS code
@app.route('/main.js')
def script():
    with open('main.js') as source:
        return source.read()
