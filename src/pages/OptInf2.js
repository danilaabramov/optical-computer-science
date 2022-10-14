import React, {useEffect, useState} from "react"
import {CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis,} from "recharts"
import Complex from 'complex.js'
import {fft} from 'fft-js'
import {fftshift} from 'fftshift'
import Plotly from 'plotly.js-dist'
import * as tf from '@tensorflow/tfjs'

export const OptInf2 = () => {
    const [abs, setAbs] = useState()
    const [absNew, setAbsNew] = useState()

    const [abs1, setAbs1] = useState()
    const [arg1, setArg1] = useState()
    const [abs2, setAbs2] = useState()
    const [arg2, setArg2] = useState()
    const [abs3, setAbs3] = useState()
    const [arg3, setArg3] = useState()

    const [abs4, setAbs4] = useState()
    const [arg4, setArg4] = useState()
    const [abs5, setAbs5] = useState()
    const [arg5, setArg5] = useState()

    let N = 2 ** 10
    let M = 2 ** 16
    let a1 = -5
    let a2 = 5

    let b2 = (N * N) / (4 * a2 * M)
    let b1 = -b2
    let hx = (a2 - a1) / N
    let hu = (b2 - b1) / N

    const gauss = (x) => {
        return Complex(-(x ** 2)).exp()
    }

    const sinc = (x) => {
        let x1 = x
        if (x1 === 0) return Complex(1)
        let ans = Math.sin((x1) * Math.PI) / ((x1) * Math.PI)
        return Complex(ans)
    }

    const bpf = (f) => {
        let h = (a2 - a1) / (N - 1)
        let k = (M - N) / 2
        let F = [...Array(k).fill([0, 0]), ...f, ...Array(k).fill([0, 0])]
        F = fftshift(fft(fftshift(F)))
        F.splice(0, k)
        F.splice(N, k)
        F.forEach((item, i) => {
            F[i] = [F[i][0] * h, F[i][1] * h]
        })
        return F
    }

    const xArr = () => {
        let x = []
        for (let i = a1; i < a2; i += hx) x.push(i)
        return x
    }

    let x = xArr()

    const analitic_Furie2 = (f) => {
        let arr_F = []
        for (let i_u = 0, F; i_u < N; ++i_u, arr_F = [...arr_F, [F.re, F.im]])
            if (b1 + i_u * hu > -0.5 && b1 + i_u * hu < 0.5 && f[i_u][0] !== 0) F = Complex(1)
            else F = Complex(0)
        return arr_F
    }

    const analitic_Furie1 = (f) => {
        let arr_F = []
        for (let i_u = 0, F = Complex(0); i_u < N; ++i_u, arr_F = [...arr_F, [F.re, F.im]], F = Complex(0))
            for (let i = 0; i < N; ++i)
                F = F.add(Complex(-1).sqrt().mul(-2 * Math.PI * x[i] * (b1 + i_u * hu)).exp().mul(f[i]).mul(hx))
        return arr_F
    }

    useEffect(() => {
        if (!abs) return
        let [Fbpf, Faf] = [bpf(abs), analitic_Furie1(abs)]
        let arr = []
        for (let x = b1, i = 0; x < b2; x += (b2 - b1) / N, ++i) arr = [...arr, {
            x: "x : " + x,
            y: Complex(Fbpf[i]).abs()
        }]
        setAbs2(arr)
        arr = []
        for (let x = b1, i = 0; x < b2; x += (b2 - b1) / N, ++i) arr = [...arr, {
            x: "x : " + x,
            y: Complex(Fbpf[i]).arg()
        }]
        setArg2(arr)
        arr = []
        for (let x = b1, i = 0; x < b2; x += (b2 - b1) / N, ++i) arr = [...arr, {
            x: "x : " + x,
            y: Complex(Faf[i]).abs()
        }]
        setAbs3(arr)
        arr = []
        for (let x = b1, i = 0; x < b2; x += (b2 - b1) / N, ++i) arr = [...arr, {
            x: "x : " + x,
            y: Complex(Faf[i]).arg()
        }]
        setArg3(arr)
    }, [abs])

    useEffect(() => {
        if (!absNew) return
        let [Fbpf, Faf] = [bpf(absNew), analitic_Furie2(absNew)]
        let arr = []
        for (let x = b1, i = 0; x < b2; x += hu, ++i) arr = [...arr, {
            x: "x : " + x,
            y: Complex(Fbpf[i]).abs(),
            y2: Complex(Faf[i]).abs()
        }]
        setAbs5(arr)
        arr = []
        for (let x = b1, i = 0; x < b2; x += hu, ++i) arr = [...arr, {
            x: "x : " + x,
            y: Complex(Fbpf[i]).arg(),
            y2: Complex(Faf[i]).arg()
        }]
        setArg5(arr)
    }, [absNew])


    useEffect(() => {
        let [arr, arr2] = [[], []]
        for (let x = a1; x < a2; x += hx) {
            arr = [...arr, {x: "x : " + x, y: gauss(x).abs()}]
            arr2 = [...arr2, [gauss(x).re, gauss(x).im]]
        }
        setAbs1(arr)
        arr = []
        for (let x = a1; x < a2; x += hx) arr = [...arr, {x: "x : " + x, y: gauss(x).arg()}]
        setArg1(arr)
        setAbs(arr2)
        arr = []
        arr2 = []
        for (let x = a1; x < a2; x += hx) {
            arr = [...arr, {x: "x : " + x, y: sinc(x).abs()}]
            arr2 = [...arr2, [sinc(x).re, sinc(x).im]]
        }
        setAbs4(arr)
        arr = []
        for (let x = a1; x < a2; x += hx) arr = [...arr, {x: "x : " + x, y: sinc(x).arg()}]
        setArg4(arr)
        setAbsNew(arr2)
        // let [tX, tY] = tf.meshgrid(x, x)
        // let [X, Y] = [tX.arraySync(), tY.arraySync()]
        //
        // let gauss3 = gauss3D(X, Y)
        // let bpf3 = bpf3D(gauss3.num)
        // let af3 = analitic3D(gauss3.num)
        //
        // let sinc3 = sinc3D(X, Y)
        // let bpf32 = bpf3D(sinc3.num)
        // let af32 = analitic3D2(sinc3.num)
        //
        // Plotly.newPlot('myDiv', [{z: gauss3.abs, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv2', [{z: gauss3.arg, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv3', [{z: bpf3.abs, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv4', [{z: bpf3.arg, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv5', [{z: af3.abs, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv6', [{z: af3.arg, type: 'surface'}], layout);
        //
        // Plotly.newPlot('myDiv7', [{z: sinc3.abs, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv8', [{z: sinc3.arg, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv9', [{z: bpf32.abs, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv10', [{z: bpf32.arg, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv11', [{z: af32.abs, type: 'surface'}], layout);
        // Plotly.newPlot('myDiv12', [{z: af32.arg, type: 'surface'}], layout);
    }, [])

    function transpose(matrix) {
        return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
    }

    const bpf3D = (f) => {
        let arr = transpose(JSON.parse(JSON.stringify(f)))
        for (let i = 0; i < f.length; ++i) arr[i] = bpf(arr[i])
        arr = transpose(arr)
        for (let i = 0; i < f.length; ++i) arr[i] = bpf(arr[i])
        let arr2 = JSON.parse(JSON.stringify(arr))
        for (let i = 0; i < f.length; ++i) for (let j = 0; j < N; ++j) [arr[i][j], arr2[i][j]] = [Complex(arr[i][j]).abs(), Complex(arr2[i][j]).arg()]
        return {abs: arr, arg: arr2}
    }

    const analitic3D = (f) => {
        let arr = transpose(JSON.parse(JSON.stringify(f)))
        for (let i = 0; i < N; ++i) arr[i] = analitic_Furie1(arr[i])
        arr = transpose(arr)
        for (let i = 0; i < N; ++i) arr[i] = analitic_Furie1(arr[i])
        let arr2 = JSON.parse(JSON.stringify(arr))
        for (let i = 0; i < N; ++i) for (let j = 0; j < N; ++j) [arr[i][j], arr2[i][j]] = [Complex(arr[i][j]).abs(), Complex(arr2[i][j]).arg()]
        return {abs: arr, arg: arr2}
    }

    const analitic3D2 = (f) => {
        let arr = transpose(JSON.parse(JSON.stringify(f)))
        for (let i = 0; i < N; ++i) arr[i] = analitic_Furie2(arr[i])
        arr = transpose(arr)
        for (let i = 0; i < N; ++i) arr[i] = analitic_Furie2(arr[i])
        let arr2 = JSON.parse(JSON.stringify(arr))
        for (let i = 0; i < N; ++i) for (let j = 0; j < N; ++j) [arr[i][j], arr2[i][j]] = [Complex(arr[i][j]).abs(), Complex(arr2[i][j]).arg()]
        return {abs: arr, arg: arr2}
    }

    const gauss3D = (X, Y) => {
        let [num, abs, arg] = [[], [], []]
        for (let i = 0, [arr, arr2, arr3] = [[], [], []]; i < X.length; ++i, [arr, arr2, arr3] = [[], [], []]) {
            for (let j = 0; j < X[i].length; ++j) {
                let g = gauss(X[i][j]).mul(gauss(Y[i][j]));
                [arr, arr2, arr3] = [[...arr, [g.re, g.im]], [...arr2, g.abs()], [...arr3, g.arg()]]
            }
            [num, abs, arg] = [[...num, arr], [...abs, arr2], [...arg, arr3]]
        }
        return {num, abs, arg}
    }

    const sinc3D = (X, Y) => {
        let [num, abs, arg] = [[], [], []]
        for (let i = 0, [arr, arr2, arr3] = [[], [], []]; i < X.length; ++i, [arr, arr2, arr3] = [[], [], []]) {
            for (let j = 0; j < X[i].length; ++j) {
                let s = sinc(X[i][j]).mul(sinc(Y[i][j]));
                [arr, arr2, arr3] = [[...arr, [s.re, s.im]], [...arr2, s.abs()], [...arr3, s.arg()]];
            }
            [num, abs, arg] = [[...num, arr], [...abs, arr2], [...arg, arr3]]
        }
        return {num, abs, arg}
    }

    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        setInterval(() => {
            setWidth(window.innerWidth)
        }, 0.1)
    })
    let layout = {title: '', width: width > 1000 ? 960 / 2 : width / 2 - 20, height: 500}

    return (
        <div style={{fontSize: '14px', marginLeft: 20, marginRight: 20}}>
            <div style={{display: 'flex'}}>
                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={abs1}
                    syncId="anyId"
                    margin={{
                        top: 5,
                        right: 5,
                        left: 0,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>

                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={arg1}
                    syncId="anyId"
                    margin={{
                        top: 5,
                        right: 0,
                        left: 5,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x" scale="band"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>
            </div>

            <div style={{display: 'flex'}}>
                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={abs2}
                    syncId="anyId"
                    margin={{
                        top: 5,
                        right: 5,
                        left: 0,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>

                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={arg2}
                    syncId="anyId"
                    margin={{
                        top: 5,
                        right: 0,
                        left: 5,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>
            </div>

            <div style={{display: 'flex'}}>
                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={abs3}
                    syncId="anyId"
                    margin={{
                        top: 5,
                        right: 5,
                        left: 0,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>

                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={arg3}
                    syncId="anyId"
                    margin={{
                        top: 5,
                        right: 0,
                        left: 5,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>
            </div>

            <div style={{display: 'flex'}}>
                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={abs4}
                    syncId="anyId2"
                    margin={{
                        top: 5,
                        right: 5,
                        left: 0,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>

                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={arg4}
                    syncId="anyId2"
                    margin={{
                        top: 5,
                        right: 0,
                        left: 5,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y"/>
                </ComposedChart>
            </div>

            <div style={{display: 'flex'}}>
                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={abs5}
                    syncId="anyId2"
                    margin={{
                        top: 5,
                        right: 5,
                        left: 0,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y" strokeWidth={10}/>
                    <Line type="monotone" dot={false} dataKey="y2" stroke="orange"/>
                </ComposedChart>

                <ComposedChart
                    width={width > 1000 ? 960 / 2 : width / 2 - 20}
                    height={300}
                    data={arg5}
                    syncId="anyId2"
                    margin={{
                        top: 5,
                        right: 0,
                        left: 5,
                        bottom: 5
                    }}>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dot={false} dataKey="y" strokeWidth={10}/>
                    <Line type="monotone" dot={false} dataKey="y2" stroke="orange"/>
                </ComposedChart>
            </div>

            <div style={{display: 'flex'}}>
                <div id='myDiv'/>
                <div id='myDiv2'/>
            </div>
            <div style={{display: 'flex'}}>
                <div id='myDiv3'/>
                <div id='myDiv4'/>
            </div>
            <div style={{display: 'flex'}}>
                <div id='myDiv5'/>
                <div id='myDiv6'/>
            </div>
            <div style={{display: 'flex'}}>
                <div id='myDiv7'/>
                <div id='myDiv8'/>
            </div>
            <div style={{display: 'flex'}}>
                <div id='myDiv9'/>
                <div id='myDiv10'/>
            </div>
            <div style={{display: 'flex'}}>
                <div id='myDiv11'/>
                <div id='myDiv12'/>
            </div>
        </div>
    )
}
