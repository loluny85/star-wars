import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import '../styles/search.css';
import axios from 'axios';

class Search extends Component {

    state = {
        searchPopulation: null
    }

    planets = [];

    logout = () => {
        window.sessionStorage.removeItem('starWarsLoggedIn');
    }

    fetchResource(url) {
        let planets;
        this.setState({
            fetchedResource: false
        })
        planets = planets || this.planets;
        axios.get(url).then((response) => {
            planets.push(...response.data.results);
            if(response.data.next) {
                this.fetchResource(response.data.next)
            }
            else {
                this.setState({
                    fetchedResource: true
                })
                window.localStorage.setItem('starWarsPlanets', JSON.stringify(this.planets));
            }   
        });
    }

    componentDidMount() {
        var apiUrl = "https://swapi.co/api/planets/";
        if(!window.localStorage.starWarsPlanets) {
            this.fetchResource(apiUrl);
        }
        else {
            this.planets = JSON.parse(window.localStorage.getItem('starWarsPlanets'));
        }
    }

    searchPopulationChange = () => {
        this.setState({
            searchPopulation: this.searchPopulation.value
        })
    }


    render() {
        if(!window.sessionStorage.starWarsLoggedIn) {
            return (
                <Redirect to='/login' />
            )
        }
        else {
            let searchPopulation = this.state.searchPopulation;
            return (
                <div className='search'>
                    <input type='text' placeholder='search by population' onChange={this.searchPopulationChange} className='search-box' ref={(searchPopulation)=>this.searchPopulation=searchPopulation}/>
                    <NavLink to='/login' onClick={this.logout} className='logout'>Logout</NavLink><br></br>
                    {
                        this.planets.map((planet)=>{
                            if(Number(planet.population) <= Number(searchPopulation)) {
                                if(Number(planet.population) === 0) {
                                    planet.population = 10; //To make the planet visible on the screen
                                }
                                const planetStyle = { //Setting relative size to planets
                                    height: Math.log(planet.population, 10)*10,
                                    width: Math.log(planet.population, 10)*10
                                }
                                return (
                                    <div key={planet.name} style={planetStyle} className='planet'> 
                                        <div className='wrap'>
                                            <div style={planetStyle} className='background'></div>
                                            <div style={planetStyle} className='clouds'>
                                            </div>   
                                        </div>
                                        <div className='mask'></div>
                                        <div className='planet-label'>
                                        <span>{planet.name}</span><br></br>
                                        <span>{planet.population}</span>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            )
        }
    }
}

export default Search;