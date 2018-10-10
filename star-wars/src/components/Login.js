import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/login.css';
import axios from 'axios';

class Login extends Component {

    state = {
        loggedIn: false,
        fetchedResource: true,
        invalidCredentials: 'hide-error'
    }

    people = [];

    validateLogIn = (e) => {
        e.preventDefault();
        let userName = this.userName.value;
        let password = this.password.value;
        this.people.some((character)=> {
            if(character.name.toLowerCase() === userName.toLowerCase() && character.birth_year === password) {
                window.sessionStorage.starWarsLoggedIn = true;
                this.setState({ //Just to re-render the component and thus redirect to search component
                    loggedIn: true
                })
                return true;
            }
        })
        if(!window.sessionStorage.starWarsLoggedIn) {
            this.setState({
                invalidCredentials:'invalid-credentials'
            })
        }
    }

    fetchResource(url) {
        let people;
        this.setState({
            fetchedResource: false
        })
        people = people || this.people;
        axios.get(url).then((response) => {
            people.push(...response.data.results);
            if(response.data.next) {
                this.fetchResource(response.data.next)
            }
            else {
                this.setState({
                    fetchedResource: true
                })
                window.localStorage.setItem('starWarsPeople', JSON.stringify(this.people));
            }   
        });
    }

    componentDidMount() {
        var apiUrl = "https://swapi.co/api/people/";
        if(!window.localStorage.starWarsPeople) {
            this.fetchResource(apiUrl);
        }
        else {
            this.people = JSON.parse(window.localStorage.getItem('starWarsPeople'));
        }
    }

    render() {
            if(window.sessionStorage.starWarsLoggedIn) {
                return (
                    <Redirect to='/search' />
                )
            }
            else {
                return (
                    <div className='login'>
                        <form>
                            <input type='text' placeholder='username' ref={(user)=>{this.userName=user}} />
                            <input type='password' placeholder='password' ref={(password)=>{this.password=password}}/>
                            <br></br><button onClick={(e) => this.validateLogIn(e)}>Login</button>
                        </form>
                        <span className={this.state.invalidCredentials}>Invalid username or password</span>
                    </div>
                )
            }
        }
    }

export default Login;