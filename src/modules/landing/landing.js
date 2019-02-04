import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const landing = () => (
    <div className='w-100'>
        <div className='half-page text-center d-flex w-100 p-3 mx-auto flex-column'>
            <div className='mt-auto mb-auto center'>
                <div className='landing-info'>
                    <Typography component='h1' variant='h1'>
                        Posty
                    </Typography>
                    <p > Something I hacked in a couple of hours</p>
                    <Link to='/signup' className='no-decoration' >
                        <Button>
                            Sign Up Now
                    </Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default landing;

