var findCounters = new Promise((resolve,reject) => {
	console.log('Finding counters');
  setTimeout(() => {
  	var data = 10;
    console.log('got the data');
    resolve(data);
  },5000);
});

findCounters.then((data) => {
	console.log('we got '+ data);
})
