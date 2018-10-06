const http = require('http')
const {host, port, clusterHealthEndpoint, nodeHealthEndpoint} = require('./config')
const clusterHealthOptions = {host, port, path : clusterHealthEndpoint, method:'GET'}
const nodeHealthOptions = {host, port, path : nodeHealthEndpoint, method:'GET'}
const getWordArrayFromLine = (line) => line.split(" ").filter((word) => word.trim() !== "")
const getObjectFromResponse = (text) => {
    const keyValArray = text.split("\n")
    const keys = getWordArrayFromLine(keyValArray[0])
    const values = getWordArrayFromLine(keyValArray[1])
    const obj = {}
    for(var i = 0; i < keys.length; i++) {
        obj[keys[i]] = values[i]
    }
    return obj
}
const clusterApi = () => {
    //console.log("pinging cluster")
    const req = http.request(clusterHealthOptions, (res) => {
        //console.log(`STATUS: ${res.statusCode}`);
        var str = ""
        res.setEncoding('utf8')
        res.on('data', (data) => {
            str += data.toString()
        })

        res.on('end', () => {
            //console.log(str)
            console.log(getObjectFromResponse(str))
        })
        res.on('error', (err) => {
            console.log(err)
        })
    })
    req.on('error', (e) => {
        console.log(e.message)
    })
    req.end()
}


const nodeApi = () => {
    //console.log("pinging node")
    const req = http.request(nodeHealthOptions, (res) => {
        //console.log(`STATUS: ${res.statusCode}`);
        var str = ""
        res.setEncoding('utf8')
        res.on('data', (data) => {
            str += data.toString()
        })

        res.on('end', () => {
            //console.log(str)
            console.log(getObjectFromResponse(str))
        })
        res.on('error', (err) => {
            console.log(err)
        })
    })
    req.on('error', (e) => {
        console.log(e.message)
    })
    req.end()
}



setInterval(clusterApi, 2000)
setTimeout( () => {
    setInterval(nodeApi, 2000)
}, 1000)
