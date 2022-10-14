import React, {useEffect, useState} from "react"
import {CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis,} from "recharts"
import Complex from 'complex.js'

export const OptInf = () => {
    const [abs1, setAbs1] = useState()
    const [arg1, setArg1] = useState()
    const [abs2, setAbs2] = useState()
    const [arg2, setArg2] = useState()

    const alpha = 1
    const m = 1000
    const n = 1000
    const a = -5
    const b = 5
    const p = -25
    const q = 25
    const hx = (b - a) / n
    const hksi = (q - p) / m
    const fk = (x) => {
        return Complex(Complex(-1).sqrt().mul((x) / 10)).exp()
    }

    const fun = (l, x) => {
        return Complex(-alpha * (x - l) ** 2).exp()
    }

    const Fl = (l) => {
        let res = 0
        for (let x = a; x.toFixed(2) < b; x += hx) res = Complex(res).add(Complex(fun(l, x)).mul(fk(x)))
        return Complex(res).mul(hx)
    }

    useEffect(() => {
        let arr = []
        for (let x = a; x.toFixed(2) <= b; x += hx)
            arr = [...arr, {x: "x : " + x.toFixed(2), y: fk(x).abs()}]
        setAbs1(arr)

        arr = []
        for (let x = a; x.toFixed(2) <= b; x += hx)
            arr = [...arr, {x: "x : " + x.toFixed(2), y: fk(x).arg()}]
        setArg1(arr)

        arr = []
        for (let x = p; x.toFixed(2) <= q; x += hksi)
            arr = [...arr, {x: "x : " + x.toFixed(2), y: Fl(x).abs().toFixed(3)}]
        setAbs2(arr)

        arr = []
        for (let x = p; x.toFixed(2) <= q; x += hksi)
            arr = [...arr, {x: "x : " + x.toFixed(2), y: Fl(x).arg()}]
        setArg2(arr)

    }, [])

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        setInterval(() => {
            setWidth(window.innerWidth)
        }, 0.1)
    })

    return (
        <div style={{fontSize: '14px', marginLeft: 20, marginRight: 20}}>
            <div style={{textAlign: 'center', fontSize: '26px'}}>Амплитуда входного сигнала</div>
            <ComposedChart
                width={width > 1000 ? 960 : width - 40}
                height={400}
                data={abs1}
                margin={{
                    top: 5,
                    right: 0,
                    left: -15,
                    bottom: 5
                }}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dot={false} dataKey="y" fill="#F28511"/>
            </ComposedChart>

            <div style={{textAlign: 'center', fontSize: '26px'}}>Фаза входного сигнала</div>
            <ComposedChart
                width={width > 1000 ? 960 : width - 40}
                height={400}
                data={arg1}
                margin={{
                    top: 5,
                    right: 0,
                    left: -15,
                    bottom: 5
                }}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dot={false} dataKey="y" fill="#F28511"/>
            </ComposedChart>

            <div style={{textAlign: 'center', fontSize: '26px'}}>Амплитуда выходного сигнала</div>
            <ComposedChart
                width={width > 1000 ? 960 : width - 40}
                height={400}
                data={abs2}
                margin={{
                    top: 5,
                    right: 0,
                    left: -15,
                    bottom: 5
                }}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Tooltip/>
                <Line dot={false} dataKey="y" fill="#F28511"/>
            </ComposedChart>

            <div style={{textAlign: 'center', fontSize: '26px'}}>Фаза выходного сигнала</div>
            <ComposedChart
                width={width > 1000 ? 960 : width - 40}
                height={400}
                data={arg2}
                margin={{
                    top: 5,
                    right: 0,
                    left: -15,
                    bottom: 5
                }}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Tooltip/>
                <Line dot={false} dataKey="y" fill="#F28511"/>
            </ComposedChart>
        </div>
    )
}
