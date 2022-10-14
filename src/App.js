import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {OptInf} from './pages/OptInf'
import {OptInf2} from './pages/OptInf2'
import {OptInf3} from './pages/OptInf3'


function App() {

    return (
        <div style={{overflowX: 'hidden'}}>
            <main className="App-main">
                <Router>
                    <div>
                        <div className="content" style={{
                            borderRadius: '20px',
                            maxWidth: '1000px',
                            margin: 'auto',
                            padding: '30px',
                            marginBottom: '50px',
                            marginTop: '50px'
                        }}>
                            <Switch>

                                <Route path="/optinf3">
                                    <div style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: 20}}>
                                        <div style={{width: '100%'}}>

                                            <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">1</div>
                                                </div>
                                            </Link>
                                            <Link to="/optinf2" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">2</div>
                                                </div>
                                            </Link>
                                            <Link to="/optinf3" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">3</div>
                                                </div>
                                            </Link>

                                        </div>
                                    </div>
                                    <OptInf3/>
                                </Route>

                                <Route path="/optinf2">
                                    <div style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: 20}}>
                                        <div style={{width: '100%'}}>

                                            <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">1</div>
                                                </div>
                                            </Link>
                                            <Link to="/optinf2" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">2</div>
                                                </div>
                                            </Link>
                                            <Link to="/optinf3" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">3</div>
                                                </div>
                                            </Link>

                                        </div>
                                    </div>
                                    <OptInf2/>
                                </Route>

                                <Route path="/">
                                    <div style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: 20}}>
                                        <div style={{width: '100%'}}>

                                            <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">1</div>
                                                </div>
                                            </Link>
                                            <Link to="/optinf2" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">2</div>
                                                </div>
                                            </Link>
                                            <Link to="/optinf3" style={{textDecoration: 'none', color: 'white'}}>
                                                <div style={{width: '33.33%', display: 'inline-block '}}>
                                                    <div className="btn-link">3</div>
                                                </div>
                                            </Link>

                                        </div>
                                    </div>
                                    <OptInf/>
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </Router>
            </main>
        </div>
    );
}

export default App;
