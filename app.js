const { fork } = require('child_process')
const {Worker} = require('worker_threads')
const {performance, PerformanceObserver} = require('perf_hooks')

const performanceObserver = new PerformanceObserver((items)=>{
    items.getEntries().forEach(entry=>console.log(entry.name, entry.duration))
})

performanceObserver.observe({entryTypes: ['measure']})

const workerFunction = (array)=>{
    try{
        return new Promise((res, rej)=>{
            performance.mark('workerFunction start')
            const worker = new Worker('./worker.js', {
                workerData: {array}
            })
            worker.on('message', (msg)=>{
                res(msg)
                performance.mark('workerFunction end')
                performance.measure('workerFunction','workerFunction start', 'workerFunction end')
            })
            worker.on('error', rej)
        })
    }catch(error){
        console.error(error.message)
    }
}

const forkFunction = (array)=>{
    try {
        return new Promise((res, rej)=>{
            performance.mark('forkFunction start')
            const forkProcess = fork('./fork.js')
            forkProcess.send({array})
            forkProcess.on('message', (msg)=>{
                res(msg)
                performance.mark('forkFunction end')
                performance.measure('forkFunction','forkFunction start', 'forkFunction end')
            })
            forkProcess.on('error', rej)
        })
    }catch(error){
        console.error(error.message)
    }

}

const main = async ()=>{
    const workerResultPromise =  workerFunction([25, 19, 48, 30]);
    const forkResultPromise = forkFunction([25, 19, 48, 30]);

    workerResultPromise?.then(res=>{
        console.log(res)
    })

    forkResultPromise?.then(res=>{
        console.log(res)
    })

}

main()