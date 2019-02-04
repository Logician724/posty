import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import classes from './signup.module.css';
import axios from '../../../axios';
import { NotificationManager } from 'react-notifications';

class Signup extends Component {
    state = {
        confirmPassword: '',
        email: '',
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

        return this.setState({
            [name]: value
        });
    }

    signup = () => {
        const currentState = this.state;
        const { history } = this.props;
        axios.post('/signup', currentState)
            .then((res) => {
                if (!res || !res.data) {
                    return NotificationManager.error('An unknown error occurred, please try again later.');
                }
                localStorage.setItem('posty_token', res.data.data.token);
                // eslint-disable-next-line dot-notation
                axios.defaults.headers.common['authorization'] = localStorage.getItem('posty_token');

                NotificationManager.success('You have signed up successfully');

                return history.push('/posts');
            })
            .catch((err) => {
                if (!err ||
                    !err.response ||
                    !err.response.data ||
                    !err.response.data.err) {
                    if (err.response.status === 401) {
                        return NotificationManager.error(err.response.data.msg);
                    }

                    return NotificationManager.error('An unknown error occurred, please try again later.');
                }
                const { errors } = err.response.data;

                return Object.keys(errors).forEach(
                    (error) => NotificationManager.error(`${errors[error].param} is invalid`));
            });
    }

    componentDidMount = () => {
        const token = localStorage.getItem('posty_token');
        if (token) {
            this.props.history.push('/posts');
        }
    }

    render() {
        return (
            <div className={classes.signupWrapper}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Signup
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
                            <InputLabel htmlFor='email'>email</InputLabel>
                            <Input
                                id='email'
                                name='email'
                                autoComplete='email'
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
                        <FormControl
                            margin='normal'
                            required
                            fullWidth
                            error={this.state.password !== this.state.confirmPassword}>
                            <InputLabel htmlFor='confirmPassword'>Confirm Password</InputLabel>
                            <Input
                                name='confirmPassword'
                                type='password'
                                id='confirmPassword'
                                autoComplete='password'
                                onChange={this.handleInputChange} />
                        </FormControl>
                        <Button
                            fullWidth
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.submit}
                            onClick={this.signup}
                        >
                            Signup
            </Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

export default Signup;
