// // Load the dropdown list with the available data sets
// d3.json("samples.json").then((data) => {
//     var names = data.names;
//     d3.select('#selDataset').selectAll('option').data(names).enter().append('option').text(function (data) {
//         return data;
//     });
// });

// // this runs when the user selects a value from the dropdown list
// function optionChanged(value) {
//     // grab the sample values
//     d3.json("samples.json").then((data) => {
//         var samp_val = data.samples;

//         var sampleValues = [];
//         var otuIds = [];
//         var otuLabels = [];
//         var otuIdsString = [];

//         // loop through the samples to find the one that matches the user chosen value
//         samp_val.forEach(person => {
//             if (person.id === value) {
//                 sampleValues = person.sample_values;
//                 otuIds = person.otu_ids;
//                 otuLabels = person.otu_labels;
//                 otuIds.map(otu => {
//                     otuIdsString.push(`OTU ${otu}`);
//                 });
//             }
//         });

//         // pull the metadata and populate the Demographics table
//         var wash = 0;
//         var Metadata=data.metadata;
//         Metadata.forEach(person => {
//             if (person.id ==value){
//                 var demographics = Object.entries(person);
//                 wash = demographics[6][1];
//                 d3.selectAll('p').remove();
//                 d3.select('#sample-metadata').selectAll('p').data(demographics).enter().append('p').text(d=>{
//                     return `${d[0]}: ${d[1]}`;
//                 });
//             }
//         }); 

//         // ***********************************************
//         // Create the Gauge chart displaying the wash data
//         // ***********************************************
//         var traceGauge = {
//             type: 'pie',
//             showlegend: false,
//             hole: 0.4,
//             rotation: 90,
//             values: [ 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
//             text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
//             direction: 'clockwise',
//             textinfo: 'text',
//             textposition: 'inside',
//             marker: {
//               colors: ['','','','','','','','','','white'],
//               labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
//               hoverinfo: 'label'
//             }
//           }
      
//           // needle
//           var degrees = (180/9) * wash
//           var radius = 0.5
//           var radians = degrees * Math.PI / 180
//           var x = -1 * radius * Math.cos(radians)
//           var y = radius * Math.sin(radians)
      
//           var gaugeLayout = {
//             shapes: [{
//               type: 'line',
//               x0: 0.5,
//               y0: 0.5,
//               x1: x + 0.5,
//               y1: y + 0.5,
//               line: {
//                 color: 'black',
//                 width: 3
//               }
//             }],
//             title: 'Wash Frequency Chart',
//             xaxis: {visible: false, range: [-1, 1]},
//             yaxis: {visible: false, range: [-1, 1]}
//           }
      
//           var dataGauge = [traceGauge]

//           Plotly.newPlot('gauge', dataGauge, gaugeLayout);

//         // ***********************************************************
//         // Create the horizontal bar chart with the chosen sample data
//         // ***********************************************************
//         var trace1 = {
//             x: sampleValues.slice(0, 10).reverse(),
//             y: otuIdsString.slice(0, 10).reverse(),
//             orientation: 'h',
//             type: 'bar',
//             text: otuLabels.slice(0, 10).reverse()
//         }
//         var data1 = [trace1];

//         var layout = {
//             title: 'Top Ten Bacteria Present'
//         }

//         Plotly.newPlot('bar', data1, layout);

//         // **********************
//         // Create the Bubble Plot
//         // **********************
//         var trace2 = {
//             x: otuIds,
//             y: sampleValues,
//             text: otuLabels,
//             mode: 'markers',
//             marker: {
//                 size: sampleValues,
//                 color: otuIds
//             }
//         }
//         var data2 = [trace2];
//         var layout2 = {
//             xaxis: {
//                 title: 'OTU IDs'
//             },
//             showlegend: false,
//             title: "All Bacteria Present"
//         }

//         Plotly.newPlot('bubble', data2, layout2);
//     });
// }

var option = "";
var dataSet ;


function init() {

  d3.json("samples.json").then(function(data){
    dataSet = data;

    console.log(dataSet);
    
    displayMetaData(940,dataSet);
    displayHBarChart(940,dataSet);
    displayBubbleChart(940,dataSet);

    var optionMenu = d3.select("#selDataset");

    data.names.forEach(function(name){
      optionMenu.append("option").text(name);
    });
 })
}

function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }

function optionChanged(value) {
    option = value;
    displayMetaData(option,dataSet);
    displayHBarChart(option,dataSet);
    displayBubbleChart(option,dataSet);
}

function displayMetaData(option,dataSet) {
    
    
    var mtdata = dataSet.metadata.filter(row => row.id == option);
    d3.select("#sample-metadata").html(displayObject(mtdata[0]));
        
}

function displayObject(obj) {
    var str = "";
    Object.entries(obj).forEach(([key,value]) => {
        str += `<br>${key}:${value}</br>`;
        if(key=="wfreq"){
            buildGauge(value);
            console.log("gauge value is:" +value);
        }
        
    });
    return str;
}

function displayHBarChart(option,dataSet) {
    
    var barData = dataSet.samples.filter(sample => sample.id == option);
    console.log(barData);
    

    

    var y = barData.map(row =>row.otu_ids);  
    var y1 =[];

    
   
    for(i=0;i<y[0].length;i++){
        y1.push(`OTU ${y[0][i]}`);
    }

    var x = barData.map(row =>(row.sample_values));
    var text = barData.map(row =>row.otu_labels);
    

    var trace = {
        x:x[0].slice(0,10),
        y:y1.slice(0,10),
        text:text[0].slice(0,10),
        type:"bar",
        orientation:"h",
        
    };

    var data = [trace];

    var layout = {
        yaxis: {
            autorange: "reversed" 
        }
    }

    

    
    Plotly.newPlot("bar",data,layout);
}

function displayBubbleChart(option,dataSet) {

    var barData = dataSet.samples.filter(sample => sample.id == option);
    console.log(barData); 

    var x = barData.map(row =>row.otu_ids); 
    var y = barData.map(row =>row.sample_values); 
    var text = barData.map(row =>row.otu_labels);
    var marker_size = barData.map(row =>row.sample_values);
    var marker_color = barData.map(row =>row.otu_ids);
    
    console.log(x[0]);
    console.log(y[0]);
    console.log(text);
    
    var trace1 = {
        x:x[0],
        y:y[0],
        text: text[0],
        mode:"markers",
        marker: {
            color: marker_color[0],
            size: marker_size[0]
        }
        
    };

    var data = [trace1];

    var layout = {
        xaxis:{
            title: "OTU ID"
        }

    };

    Plotly.newPlot("bubble",data,layout);

}



init();