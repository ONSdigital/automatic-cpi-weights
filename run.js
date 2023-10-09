import data from './inflation_data.js'
import fetch from 'node-fetch';
import { createArrayCsvWriter } from 'csv-writer'
import * as fs from 'fs'

let date_ob = new Date().toDateString()

fs.writeFile('./timestamp.txt', date_ob, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});



const weights = []
for (let i = 0; i < data.length; i++) {
    console.log('getting inflation weight ' + data[i].weight_cdid)
    var url = "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/" + data[i].weight_cdid + "/data"
    const response = await fetch(url)
    const ons = await response.json()
    weights.push(ons)
    if (i == data.length - 1) {
        processWeights(weights)
    }
}



function processWeights(everything) {

    const headers = ['description', 'year', 'value']
    const rows = []

    everything.forEach(
        d => d.years.forEach(
            e => rows.push([d.description.title, e.year, e.value])
            )
    )
    
    const csvWriter = createArrayCsvWriter({
        header: headers,
        path: './data.csv'
    });

    csvWriter.writeRecords(rows).then(() => {
        console.log('written csv')
    })
}