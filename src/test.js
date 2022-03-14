var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyJDr9KDV6FXZ1aB'}).base('appt5KHLzOgSsIYjB');

const table = base('Leadboard');

base('Leadboard').select({ 
    sort:[{'Time': 'asc'}]
}).eachPage(function page(records, fetchNextPage) {

    records.forEach((record)=>  console.log(record.get('Name')+" "+record.get('Time')));
});

