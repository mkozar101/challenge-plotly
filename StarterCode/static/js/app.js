// Pull in the data from the json file
d3.json("samples.json").then((data) => {

    // 
    // Dynamically fill in the drop down for subject_id based on the json file provided
    // 
    // Retreive the subject id from json file
    var subject_id = data.names;
    
    // Select the drop down that will dynamically hold the ids
    var dropDown = d3.select("#selDataset");

    // Add options to the drop down based on the data provided
    var options = dropDown.selectAll("option")
        .data(subject_id)
        .enter()
        .append("option")
        .text(function(d){
            return d
        })
        .attr("value", function(d){
            return d
        }); 

    // 
    // Create initializing function that will provide stand in data for the visualizations when you land on the page
    // 
    // DEFAULT SUBJECT BIOGRAPHIC DATA
    // from the original data set, pull out just the meta data on subjects
    var subject_meta_data = data.metadata
    
    // filter the meta data based on the selected_id
    var selected_meta_data = subject_meta_data.filter(subject => subject.id == data.names[0])

    // Get key, value pairs from the selected subject's metadata
    var selected_values = Object.values(selected_meta_data[0])
    var selected_keys = Object.keys(selected_meta_data[0])

    // Select the #sample-metadata
    var metadata_panel = d3.select("#sample-metadata")
    
    // Clear it out
    metadata_panel.html("")

    // Fill in the div with id=sample-metadata with child div elements and provide text to fill it based on meta data on the subject. 
    selected_keys.forEach((element, index) => metadata_panel.append("div").text(`${selected_keys[index]}: ${selected_values[index]}`))

    
    
    // DEFAULT HORIZONTAL BAR GRAPH 
    // about out the data with only samples
    var subject_sample_data = data.samples;

    // filter the data on samples by the selected id
    var selected_data = subject_sample_data.filter(sample => sample.id == data.names[0]);

    // Break up the selected data in arrays and get first 10 values 
    var otu_ids = selected_data[0].otu_ids.slice(0,10).reverse();
    var sample_values = selected_data[0].sample_values.slice(0,10).reverse();

    // Use map method to append a string infront of otu_ids so it's clear what the value means on the bar chart
    var otu_ids = otu_ids.map(element => "OTU " + element);

    // Start to build the chart in plotly
    var data_bar = [
        {
        type: 'bar',
        x: sample_values,
        y: otu_ids,
        orientation: 'h'
        }
    ];

    var layout_bar = {
        title: 'Top 10 Operational Taxonomic Units (OTU)',
        xaxis: {title:"Incidence"},
        yaxis: {title:"OTU id"}
        };
    
    Plotly.newPlot('bar',data_bar,layout_bar);

    // // DEFAULT BUBBLE CHART
    // Get OTU labels
    var otu_labels = selected_data[0].otu_labels.slice(0,10).reverse();

    var trace1_bubble = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,  
        mode: 'markers',
        marker: {
          size: sample_values,
          color: ["rgb(93, 164, 214)","rgb(103, 124, 214)","rgb(43, 4, 114)","rgb(34, 11, 214)","rgb(193, 114, 214)","rgb(33, 44, 55)","rgb(22, 66, 111)","rgb(13, 1, 67)","rgb(200, 200, 200)","rgb(3, 5, 6)",]
        }
      };
      
    var data_bubble = [trace1_bubble];
    
    var layout_bubble = {
        title: 'OTU Samples',
        showlegend: false,
        xaxis: {title: "OTU id"},
        yaxis: {title: "Sample Values"}
    };
    
    Plotly.newPlot('bubble', data_bubble, layout_bubble);




    // 
    // Visualization Control by Selected Subject ID
    // 
    // Set on change even listner for the drop down
    dropDown.on("change", optionChanged);
    
    function optionChanged() {

        // CONTROL DEMOGRAPHIC INFO TABLE

            // get the value of the select drop down
            var selected_id = dropDown.property("value");
            
            // filter the meta data based on the selected_id
            var selected_meta_data = subject_meta_data.filter(subject => subject.id == selected_id);

            // Get key, value pairs from the selected subject's metadata
            var selected_values = Object.values(selected_meta_data[0]);
            var selected_keys = Object.keys(selected_meta_data[0]);

            // Select the #sample-metadata
            var metadata_panel = d3.select("#sample-metadata");
            
            // Clear it out
            metadata_panel.html("");

            // Fill in the div with id=sample-metadata with child div elements and provide text to fill it based on meta data on the subject. 
            selected_keys.forEach((element, index) => metadata_panel.append("div").text(`${selected_keys[index]}: ${selected_values[index]}`));
        
        // CONTROL BAR CHART
            // filter the data on samples by the selected id
            var selected_data = subject_sample_data.filter(sample => sample.id == selected_id);

            // Break up the selected data in arrays and get first 10 values 
            var otu_ids = selected_data[0].otu_ids.slice(0,10);
            var sample_values = selected_data[0].sample_values.slice(0,10).reverse();
            var otu_labels = selected_data[0].otu_labels.slice(0,10).reverse();

            // Use map method to append a string infront of otu_ids so it's clear what the value means on the bar chart
            var otu_ids = otu_ids.map(element => "OTU " + element);

            Plotly.restyle('bar', 'x', [sample_values])
            Plotly.restyle('bar', 'y', [otu_ids])
        
        // CONTROL BUBBLE CHART
            Plotly.restyle('bubble', 'x', [otu_ids])
            Plotly.restyle('bubble', 'y', [sample_values])
            Plotly.restyle('bubble','text',[otu_labels])

            
    };
});



