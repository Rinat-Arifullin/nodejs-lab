const { rejects } = require("assert");
const factorial = require("./factorial");
const {Worker} = require('worker_threads')

const compute = (arr)=>{
    return new Promise((resolve, rejects)=>{
        const worker = new Worker('./worker.js', {
            workerData: {
                arr
            }
        })
        worker.on('message', (msg)=>{
            console.log(worker.threadId)
            resolve(msg)
        });
        worker.on('error', rejects)
    })
}

const main = async () => {
    try{
        performance.mark('start');

        const result = await Promise.all([
            compute([25, 20, 19, 48,30,50]),
            compute([25, 20, 19, 48,30,50]),
            compute([25, 20, 19, 48,30,50]),
            compute([25, 20, 19, 48,30,50]),
        ])
        console.log(result)
        performance.mark('end');
        performance.measure('main', 'start', 'end')
        console.log(performance.getEntriesByName('main').pop()) 

    }catch(error){
        console.log(error.message)
    }
    
}

main();