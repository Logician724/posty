
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import classes from './login.module.css';
import { NotificationManager } from 'react-notifications';

import axios from '../../../axios';

class Login extends Component {
    state = {
        password: '',
        username: ''
    }

    handleInputChange = (event) => {
        const { target } = event;
        let value = null;
        if (target.type === 'checkbox') {
            value = target.checked;
        } else {
            // eslint-disable-next-line prefer-destructuring
            value = target.value;
        }
        const { name } = target;

        this.setState({
            [name]: value
        });
    }

    componentDidMount = () => {
        const token = localStorage.getItem('posty_token');
        if (token) {
            this.props.history.push('/posts');
        }
    }

    login = () => {
        const currentState = this.state;
        const { history } = this.props;
        axios.post('/login', currentState)
            .then((res) => {
                if (!res || !res.data) {
                    return NotificationManager.error('An unknown error occurred, please try again later.');
                }
                localStorage.setItem('posty_token', res.data.data.token);
                // eslint-disable-next-line dot-notation
                axios.defaults.headers.common['authorization'] = localStorage.getItem('posty_token');

                NotificationManager.success('You have signed in successfully');

                return history.push('/posts');
            })
            .catch((err) => {
                if (!err ||
                    !err.response ||
                    !err.response.data ||
                    !err.response.data.errors) {
                    if (err.response.status === 401) {
                        return NotificationManager.error(err.response.data.msg);
                    }

                    return NotificationManager.error('An unknown error occurred, please try again later.');
                }
                const { errors } = err.response.data;

                return Object.keys(errors).forEach(
                    (error) => NotificationManager.error(`${errors[error].param} is invalid`));
            });
    };

    render() {
        return (
            <div className={classes.loginWrapper}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Login
                    </Typography>
                    <form className={classes.form} onSubmit={(event) => event.preventDefault()}>
                        <FormControl margin='normal' required fullWidth>
                            <InputLabel htmlFor='username'>Username</InputLabel>
                            <Input
                                id='username'
                                name='username'
                                autoComplete='username'
                                autoFocus
                                onChange={this.handleInputChange} />
                        </FormControl>
                        <FormControl margin='normal' required fullWidth>
                            <InputLabel htmlFor='password'>Password</InputLabel>
                            <Input
                                name='password'
                                type='password'
                                id='password'
                                autoComplete='password'
                                onChange={this.handleInputChange} />
                        </FormControl>
                        <Button
                            fullWidth
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.submit}
                            onClick={this.login}
                        >
                            Login
            </Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

export default Login;
