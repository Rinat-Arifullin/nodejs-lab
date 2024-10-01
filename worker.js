const factorial = require("./factorial")
const {parentPort, workerData} = require('worker_threads')


const compute = ({arr})=>{
    const arrey = []
    for(let i = 0; i < 10000000; i++){
        arrey.push(i*i)
    }
    return arr.map(el=>factorial(el))
}

parentPort?.postMessage(compute(workerData))