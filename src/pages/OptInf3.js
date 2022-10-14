import React, {useEffect, useState} from "react"
import {CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis,} from "recharts"
import Complex from 'complex.js'
import {fft} from 'fft-js'
import {fftshift} from 'fftshift'
import Plotly from 'plotly.js-dist'
import * as tf from '@tensorflow/tfjs'
import {besselj} from 'bessel'

export const OptInf3 = () => {

    const R = 5

    const N = 128
    const M = 1024

    const n = 1
    const p = 3
    const m = 3

    const x = Array(N).fill(0).map((it, i) => i * R / (N - 1))

    const factorial = n => n < 1 ? 1 : n * factorial(n - 1)

    const C = k => k < 1 ? 1 : Array(k).fill(0).map((it, i) =>
        n + p - i).reduce((a, b) => a * b) / factorial(k)

    const L = r => Array(n + 1).fill(0).map((it, j) =>
        (-1) ** j * C(n - j) * r ** j / factorial(j)).reduce((a, b) => a + b)

    const f = r => Complex(Math.exp(-(r ** 2)) * r ** p * L(r ** 2))

    const to3D = (y) => {
        let arr2D = Array(N * 2).fill(Array(N * 2).fill(Complex(0)))
        const arr = Array(N * 2).fill(0).map((it, i) => i)
        const t = tf.meshgrid(arr, arr)
        let [xs, ys] = [t[0].arraySync(), t[1].arraySync()]
        xs = xs.map(i => i.map(i => i.valueOf() - N))
        ys = ys.map(i => i.map(i => i.valueOf() - N))
        const fi = Array(N * 2).fill(Array(N * 2).fill(0)).map((it, i) =>
            it.map((it, j) => Math.atan2(ys[i][j], xs[i][j])))
        let dist = Array(N * 2).fill(Array(N * 2).fill(0)).map((it, i) =>
            it.map((it, j) => Math.floor(Math.sqrt(xs[i][j] ** 2 + ys[i][j] ** 2)) + 1))
        const mask = dist.map(it => it.map(it => it.valueOf() < N))
        dist = dist.map((it, i) => it.map((it, j) => mask[i][j] ? y[it.valueOf()] : it.valueOf()))
        arr2D = arr2D.map((it, i) => it.map((it, j) => mask[i][j] ? dist[i][j] : it.valueOf()))
        return {
            abs: arr2D.map((it, i) => it.map((it, j) =>
                Complex(0, 1).mul(m * fi[i][j]).exp().mul(it.valueOf()).abs())),
            arg: arr2D.map((it, i) => it.map((it, j) =>
                Complex(0, 1).mul(m * fi[i][j]).exp().mul(it.valueOf()).arg())),
            num: arr2D.map((it, i) => it.map((it, j) =>
                [Complex(0, 1).mul(m * fi[i][j]).exp().mul(it.valueOf()).re,
                    Complex(0, 1).mul(m * fi[i][j]).exp().mul(it.valueOf()).im]
            ))
        }
    }

    const hankel_transform = (x, y, m) => {
        let Y = Array(N).fill({re: 0, im: 0})
        for (let p = 0; p < N; ++p)
            for (let r = 0; r < N; ++r) {
                const add = Complex(2 * Math.PI).div(Complex(0, 1).pow(m)).mul(y[r]).mul(besselj(2 * Math.PI * x[r] * x[p], m) * x[r] * (R / N))
                Y[p] = {re: Y[p].re += add.re, im: Y[p].im += add.im}
            }
        return Y
    }

    const transpose = matrix => matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));

    const bpf = (f) => {
        let h = R / (N * 2 - 1)
        let k = (M - N * 2) / 2
        let F = [...Array(k).fill([0, 0]), ...f, ...Array(k).fill([0, 0])]
        F = fftshift(fft(fftshift(F)))
        F.splice(0, k)
        F.splice(N * 2, k)
        F = F.map((it, i) => [it.valueOf()[0] * h, it.valueOf()[1] * h])
        return F
    }

    const bpf3D = (f) => {
        let arr = transpose(JSON.parse(JSON.stringify(f)))
        for (let i = 0; i < N * 2; ++i) arr[i] = bpf(arr[i])
        arr = transpose(arr)
        for (let i = 0; i < N * 2; ++i) arr[i] = bpf(arr[i])
        let arr2 = JSON.parse(JSON.stringify(arr))
        for (let i = 0; i < N * 2; ++i)
            for (let j = 0; j < N * 2; ++j) [arr[i][j], arr2[i][j]] = [Complex(arr[i][j]).abs(), Complex(arr2[i][j]).arg()]
        return {abs: arr, arg: arr2}
    }

    const [abs1, setAbs1] = useState()
    const [arg1, setArg1] = useState()
    const [abs2, setAbs2] = useState()
    const [arg2, setArg2] = useState()

    useEffect(() => {
        let [absY, argY, y] = [[], [], []]
        for (let r = 0; r < N; ++r) {
            absY.push({x: "x : " + x[r], y: f(x[r]).abs()})
            argY.push({x: "x : " + x[r], y: f(x[r]).arg()})
            y.push(f(x[r]))
        }
        setAbs1(absY)
        setArg1(argY)
        const to3d = to3D(y)
        const ht = hankel_transform(x, y, m);
        [absY, argY] = [[], []]
        for (let p = 0; p < N; ++p) {
            absY.push({x: "x : " + x[p], y: Math.sqrt(ht[p].re ** 2 + ht[p].im ** 2)})
            argY.push({x: "x : " + x[p], y: Math.atan2(ht[p].im, ht[p].re)})
        }
        setAbs2(absY)
        setArg2(argY)

        let time = performance.now();
        const to3d2 = to3D(ht)
        time = performance.now() - time;
        console.log('Время выполнения преобразования Ханкеля = ', time / 10 ** 3);

        time = performance.now();
        const bpf3d = bpf3D(to3d.num)
        time = performance.now() - time;
        console.log('Время выполнения преобразования Фурье = ', time / 10 ** 3);

        Plotly.newPlot('myDiv', [{z: to3d.abs, type: 'surface'}], layout);
        Plotly.newPlot('myDiv2', [{z: to3d.arg, type: 'surface'}], layout);
        Plotly.newPlot('myDiv3', [{z: to3d2.abs, type: 'surface'}], layout);
        Plotly.newPlot('myDiv4', [{z: to3d2.arg, type: 'surface'}], layout);
        Plotly.newPlot('myDiv5', [{z: bpf3d.abs, type: 'surface'}], layout);
        Plotly.newPlot('myDiv6', [{z: bpf3d.arg, type: 'surface'}], layout);
    }, [])

    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        setInterval(() => {
            setWidth(window.innerWidth)
        }, 0.1)
    })
    let layout = {title: '', width: width > 1000 ? 960 / 2 : width / 2 - 40, height: 500}

    return (
        <div style={{fontSize: '14px', marginLeft: 20, marginRight: 20}}>
            <div style={{display: 'flex'}}>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Амплитуда</div>
                    <ComposedChart
                        width={width > 1000 ? 960 / 2 : width / 2 - 20}
                        height={300}
                        data={abs1}
                        syncId="anyId"
                        margin={{
                            top: 5,
                            right: 5,
                            left: -30,
                            bottom: 5
                        }}>
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="x"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dot={false} dataKey="y"/>
                    </ComposedChart>
                </div>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Фаза</div>
                    <ComposedChart
                        width={width > 1000 ? 960 / 2 : width / 2 - 20}
                        height={300}
                        data={arg1}
                        syncId="anyId"
                        margin={{
                            top: 5,
                            right: 0,
                            left: -25,
                            bottom: 5
                        }}>
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="x"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dot={false} dataKey="y"/>
                    </ComposedChart>
                </div>
            </div>

            <div style={{display: 'flex'}}>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Амплитуда восстановленного изображения</div>
                    <div id='myDiv'/>
                </div>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Фаза восстановленного изображения</div>
                    <div id='myDiv2'/>
                </div>
            </div>

            <div style={{display: 'flex'}}>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Амплитуда после преобразования Хенкеля</div>
                    <ComposedChart
                        width={width > 1000 ? 960 / 2 : width / 2 - 20}
                        height={300}
                        data={abs2}
                        syncId="anyId"
                        margin={{
                            top: 5,
                            right: 5,
                            left: -30,
                            bottom: 5
                        }}>
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="x"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dot={false} dataKey="y"/>
                    </ComposedChart>
                </div>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Фаза после преобразования Хенкеля</div>
                    <ComposedChart
                        width={width > 1000 ? 960 / 2 : width / 2 - 20}
                        height={300}
                        data={arg2}
                        syncId="anyId"
                        margin={{
                            top: 5,
                            right: 0,
                            left: -25,
                            bottom: 5
                        }}>
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="x"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dot={false} dataKey="y"/>
                    </ComposedChart>
                </div>
            </div>

            <div style={{display: 'flex'}}>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Амплитуда восстановленного изобр после Ханкеля</div>
                    <div id='myDiv3'/>
                </div>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Фаза восстановленного изобр после Ханкеля</div>
                    <div id='myDiv4'/>
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px'}}>Амплитуда БПФ восстановленного изображения</div>
                    <div id='myDiv5'/>
                </div>
                <div>
                    <div style={{textAlign: 'center', fontSize: '26px', position: 'relstive', top: 30}}>Фаза БПФ восстановленного изображения</div>
                    <div id='myDiv6'/>
                </div>
            </div>
        </div>
    )
}
