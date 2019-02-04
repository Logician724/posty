import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import classes from './view.module.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import axios from '../../../axios';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
const limit = 10;

const timeSince = (timeStamp) => {
    const now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
    if (secondsPast < 60) {
        return parseInt(secondsPast, 10) + 's';
    }
    if (secondsPast < 3600) {
        return parseInt(secondsPast / 60, 10) + 'm';
    }
    if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600, 10) + 'h';
    }
    if (secondsPast > 86400) {
        const day = timeStamp.getDate();
        const month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ', '');
        const year = timeStamp.getFullYear() == now.getFullYear()
            ? ''
            : ' ' + timeStamp.getFullYear();

        return day + ' ' + month + year;
    }

    return null;
};
class PostView extends Component {

    state = {
        error: false,
        hasMore: true,
        isLoading: false,
        offset: 0,
        posts: []
    };

    componentDidMount = () => {
        window.addEventListener('scroll', this.handleScroll);
        this.loadPosts();
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {

        // Stop execution o early if:
        // * there's an error
        // * it's already loading
        // * there's nothing left to load
        if (this.state.error || this.state.isLoading || !this.state.hasMore) {
            return;
        }
        const windowHeight = 'innerHeight' in window
            ? window.innerHeight
            : document.documentElement.offsetHeight;
        const { body } = document;
        const html = document.documentElement;
        const docHeight = Math.
            max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        // Checks that the page has scrolled to the bottom
        if (
            windowBottom >= docHeight
        ) {
            this.loadPosts();
        }
    };

    loadPosts = () => {
        const { history } = this.props;
        const { state } = this;
        this.setState({ isLoading: false }, () => {
            axios.get(`/posts/${limit}/${state.offset}`)
                .then((res) => {

                    if (!res || !res.data) {
                        return NotificationManager.error('An unknown error occurred, please try again later.');
                    }

                    return this.setState((prevState) => {
                        const newPosts = prevState.posts.concat(res.data.docs);

                        return {
                            ...prevState,
                            hasMore: res.data.offset < res.data.total,
                            isLoading: false,
                            offset: newPosts.length,
                            posts: newPosts
                        };
                    });
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
        });
    };


    render() {
        const postsJSX = [];
        for (const post of this.state.posts) {
            postsJSX.push(
                <div className={[
                    classes.card,
                    classes.center
                ].join(' ')} key={post._id}>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar className={classes.avatar}>
                                    {post.creator.charAt(0).toUpperCase()}
                                </Avatar>
                            }
                            title={post.creator}
                            subheader={timeSince(new Date(post.createdAt))}
                        />
                        <CardContent>
                            <Typography component='p'>
                                {post.text}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className='d-flex'>
                    <Link to='/posts/create' className={classes.center}>
                        <Fab color='primary' aria-label='Add' >
                            <AddIcon />
                        </Fab>
                    </Link>
                </div>
                <div className={classes.postsWrapper} >
                    {postsJSX}
                </div>
            </React.Fragment>
        );
    }
}
export default PostView;
