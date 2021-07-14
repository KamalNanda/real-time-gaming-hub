import React, {Component} from 'react' 
import './style.css'
import axios from 'axios'
import {API_ROOT} from '../../config.json'
import { toast } from 'react-toastify';
export default class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: ''
        } 
    } 
    onInputChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    onFormSubmit = (e) => {
        e.preventDefault()
        axios.post(`${API_ROOT}/auth/login`, {
            username: this.state.username,
            password: this.state.password
        }).then(res => {
            console.log(res)
            toast.success(res.data.message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }); 
            localStorage.setItem('user', res.data.user._id)
            this.props.history.history.push('/menu')
        }).catch(err => {
            console.log(err)
            toast.error("Error - " + err.response.data.message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }); 
        })
    } 
    render(){
        return(
            <div id="game_body"> 
                <div class="wrapper clearfix" style={{height:'600px', width:'600px'}}>
                    <div className="login-container">
                    <h2 style={{textAlign:'center'}}>LOGIN</h2>
                        <form className="login-form">
                            <div className="form-group">
                                <label>Username</label>
                                <input onChange={this.onInputChange} value={this.state.username} placeholder="Enter your Username" name="username" type="email" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input onChange={this.onInputChange} value={this.state.password} placeholder="Enter your Password" name="password" type="password" />
                            </div>
                            <center>
                                <div className="login-btn" onClick={(e) => this.onFormSubmit(e)}>LOGIN</div>
                                <p style={{fontSize:'1.2rem', marginTop:'10px'}}>Didn't have an account? <a href="/register">Join Us Now</a></p>
                            </center>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
