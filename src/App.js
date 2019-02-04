import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Landing from './modules/landing/landing';
import Login from './modules/auth/login/login';
import Signup from './modules/auth/signup/signup';
import PostView from './modules/posts/view/view';
import PostCreate from './modules/posts/create/create';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { NotificationContainer } from 'react-notifications';
import axios from './axios';
import './App.css';
import 'react-notifications/lib/notifications.css';


const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  }
});

class App extends Component {
  state = {
    isLoggedIn: false
  };

  componentDidMount = () => {
    const token = localStorage.getItem('posty_token');
    if (token) {
      this.setState({ isLoggedIn: true });
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.location !== prevProps.location) {
      const token = localStorage.getItem('posty_token');
      if (token) {
        // eslint-disable-next-line dot-notation
        axios.defaults.headers.common['authorization'] = token;
        this.setState({ isLoggedIn: true });
      }
    }
  }

  logOut = () => {
    localStorage.removeItem('posty_token');
    this.setState({ isLoggedIn: false });
    this.props.history.push('/');
  }

  render() {
    return (

      <Router>
        <React.Fragment>
          <CssBaseline />
          <AppBar position='static' color='default'>
            <Toolbar>
              <Typography
                variant='h6'
                color='inherit'
                noWrap
                className='toolbarTitle'>
                <Icon>local_library</Icon>Posty
            </Typography>
              <Button>
                <Link to='/posts' className='no-decoration'>Posts</Link>
              </Button>
              {
                this.state.isLoggedIn
                  ? <React.Fragment>
                    <Button onClick={this.logOut}>Logout</Button>
                  </React.Fragment>
                  : <React.Fragment>
                    <Button>
                      <Link to='/login' className='no-decoration'>Login</Link>
                    </Button>
                    <Button>
                      <Link to='/signup' className='no-decoration'>Signup</Link>
                    </Button>
                  </React.Fragment>
              }

            </Toolbar>
          </AppBar>
          <main className='main'>
            <Route path='/' exact component={Landing} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/posts' exact component={PostView} />
            <Route path='/posts/create' component={PostCreate} />
          </main>
          <NotificationContainer />
        </React.Fragment>
      </Router >
    );
  }
}

export default withRouter(withStyles(styles)(App));
