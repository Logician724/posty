
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import classes from './create.module.css';
import { NotificationManager } from 'react-notifications';
import TextField from '@material-ui/core/TextField';
import axios from '../../../axios';

class PostCreate extends Component {
    state = {
        text: ''
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
        if (!token) {
            this.props.history.push('/login');
        }
    }

    createPost = () => {
        const { history } = this.props;
        axios.post('/posts', this.state).then((res) => {
            if (!res || !res.data) {
                return NotificationManager.error('An unknown error occurred, please try again later.');
            }
            NotificationManager.success('Post has been added successfully');

            return history.push('/posts');
        })
            .catch((err) => {
                if (!err ||
                    !err.response ||
                    !err.response.data ||
                    !err.response.data.errors) {
                    if (err.response && err.response.status === 401) {
                        NotificationManager.error('Authorization Error, please login again');

                        return history.push('/login');
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
            <div className={classes.createWrapper}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Create Post
                    </Typography>
                    <form className={classes.form} onSubmit={(event) => event.preventDefault()}>
                        <TextField
                            className={classes.center}
                            id='text'
                            name='text'
                            autoComplete='text'
                            multiline={true}
                            label = {'Your post text here'}
                            rows={4}
                            autoFocus
                            onChange={this.handleInputChange} />
                        <Button
                            fullWidth
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.submit}
                            onClick={this.createPost}
                        >
                            Create Post
                        </Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

export default PostCreate;
